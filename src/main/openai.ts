import { OpenAI, ClientOptions } from 'openai';

let openai: OpenAI | null = null;
let initError: string | null = null;
let currentModel: string = 'gpt-3.5-turbo';

export function initializeOpenAI(config: { apiKey: string; baseUrl?: string; model?: string }): void {
  try {
    if (!config.apiKey) {
      initError = '未设置 OpenAI API 密钥，AI 功能将不可用。请在设置中配置 API 密钥。';
      openai = null;
      return;
    }

    const openaiConfig: ClientOptions = {
      apiKey: config.apiKey
    };

    if (config.baseUrl) {
      try {
        // Validate the URL
        new URL(config.baseUrl);
        openaiConfig.baseURL = config.baseUrl;
      } catch (error) {
        console.error('Invalid OPENAI_BASE_URL:', error);
      }
    }

    openai = new OpenAI(openaiConfig);
    currentModel = config.model || 'gpt-3.5-turbo';
    initError = null;

    console.log('OpenAI initialized with model:', currentModel);
  } catch (error) {
    console.error('Error initializing OpenAI:', error);
    initError = '初始化 AI 功能失败：' + (error instanceof Error ? error.message : '未知错误');
    openai = null;
  }
}

export interface FFmpegCommand {
  command: string;
  description: string;
}

const SYSTEM_PROMPT = `You are an expert in FFmpeg video processing

Important notes:
- Generate commands that are compatible with fluent-ffmpeg in Electron
- Focus on common video processing tasks like compression, format conversion, and filters
- The description should be user-friendly and explain the effect in simple terms
- The description MUST be in the same language as the user's input task
- Commands MUST:
  * Start with "ffmpeg -i"
  * Use basic filters with proper syntax:
    - For fps: -filter:v fps=30
    - For scale: -filter:v scale=1280:720
    - For multiple filters: -filter:v "fps=30,scale=1280:720"
  * Avoid using quotes in filter values
  * Avoid filter_complex unless absolutely necessary
  * Include a descriptive output filename (e.g. input_30fps.mp4)
  * Keep output filename related to the effect (e.g. input_compressed.mp4)

Return ONLY a valid JSON object with two properties:
1. command: The FFmpeg command to execute
2. description: A simple, non-technical explanation of what changes will be made to the video`

export async function generateFFmpegCommand(prompt: string, filename: string): Promise<FFmpegCommand> {
  if (!openai) {
    throw new Error(initError || 'AI 功能未初始化');
  }

  try {
    console.log('Using model:', currentModel);
    const completion = await openai.chat.completions.create({
      model: currentModel,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Generate an FFmpeg command for the following task: "${prompt}"
          The input filename is: "${filename}"`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('AI 未返回有效响应');
    }

    try {
      // Try to extract JSON content
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      const parsedResponse = JSON.parse(jsonStr);

      // Validate returned object has required fields
      if (!parsedResponse.command || !parsedResponse.description) {
        throw new Error('AI 返回的数据格式无效');
      }

      return parsedResponse as FFmpegCommand;
    } catch (error) {
      console.error('Failed to parse OpenAI response:', response);
      throw new Error('AI 返回的数据格式无效');
    }
  } catch (error: unknown) {
    console.error('Error generating FFmpeg command:', error);
    throw error;
  }
}

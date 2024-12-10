import { OpenAI, ClientOptions } from 'openai';
import * as dotenv from 'dotenv';
import { join } from 'path';

// 加载 .env 文件
dotenv.config({
  path: join(process.cwd(), '.env')
});

// Validate and construct OpenAI configuration
const openaiConfig: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY
};

if (process.env.OPENAI_BASE_URL) {
  try {
    // Validate the URL
    new URL(process.env.OPENAI_BASE_URL);
    openaiConfig.baseURL = process.env.OPENAI_BASE_URL;
  } catch (error) {
    console.error('Invalid OPENAI_BASE_URL:', error);
  }
}

const openai = new OpenAI(openaiConfig);

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
  try {
    console.log('Using OpenAI config:', {
      baseURL: openaiConfig.baseURL,
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
    });

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
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
      throw new Error('No response from OpenAI');
    }

    try {
      // Try to extract JSON content
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : response;
      const parsedResponse = JSON.parse(jsonStr);

      // Validate returned object has required fields
      if (!parsedResponse.command || !parsedResponse.description) {
        throw new Error('Response missing required fields');
      }

      return parsedResponse as FFmpegCommand;
    } catch (error) {
      console.error('Failed to parse OpenAI response:', response);
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error: unknown) {
    console.error('Error generating FFmpeg command:', error);
    throw error;
  }
}

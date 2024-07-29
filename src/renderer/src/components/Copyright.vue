<script setup lang="ts"></script>

<template>
  <main class="flex items-center h-[40px] overflow-hidden">
    <section class="flex-auto">
      <span class="github">
        <a href="https://github.com/aaaaa-pi/zipideo" target="_blank" class="github-btn">
          <span class="gh-icon" aria-hidden="true"></span>
          <span class="gh-text">Star</span>
        </a>
        <a href="https://github.com/aaaaa-pi/zipideo/issues/new" target="_blank" class="github-bug"
          >Request new features / Report a bug</a
        >
      </span>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.github {
  @apply flex gap-2 items-center justify-between;

  .github-btn {
    @apply flex px-3 pt-1 rounded gap-1 ml-3 border border-[#aaa];
    background-image: linear-gradient(to bottom, #fff 0, #eee 100%);

    .gh-icon {
      display: block;
      width: 20px;
      height: 20px;
      background: url(../assets/download.svg) 0 0 / 100% 100% no-repeat;
    }
  }

  .github-btn:hover {
    background-color: #dcdcdc;
    background-image: none;
    border-color: #b5b5b5;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  .github-bug {
    @apply flex items-center text-xs h-[30px] px-1 rounded-lg mr-3 border-dashed border-2 border-blue-600 text-[#0a65cc];
  }
}
</style>

<template>
  <div class="min-h-screen flex flex-col bg-page text-content">
    <LayoutHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

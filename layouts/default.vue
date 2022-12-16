<template>
  <div class="bg-slate-100 min-h-screen">
    <div class="container mx-auto lg:px-14">
      <TheNavbar />
      <PromoBanner />
      <div class="pt-5 md:pt-20 pb-5">
        <slot />
      </div>
      <TheFooter />
    </div>
  </div>
</template>

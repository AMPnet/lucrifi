<template>
  <div class="bg-slate-100 h-screen">
    <div class="container mx-auto lg:px-14">
      <TheNavbar />
      <div class="pt-12 md:pt-36 pb-5">
        <slot />
      </div>
      <TheFooter />
    </div>
  </div>
</template>

<template>
  <div class="bg-slate-100 min-h-screen">
    <div class="container mx-auto lg:px-14">
      <TheNavbar />
      <div class="pt-5 md:pt-20 pb-5 grid grid-cols-12 px-20 gap-x-3">
        <div class="col-span-2">
          <PayrollsSideMenu />
        </div>
        <div class="col-span-10">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

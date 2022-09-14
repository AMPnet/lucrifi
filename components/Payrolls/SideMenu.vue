<script setup lang="ts"></script>

<template>
  <div
    class="flex flex-col justify-left bg-violet-600 text-white px-1 py-3 rounded-3xl text-xs gap-y-2"
  >
    <NuxtLink
      to="/payrolls"
      activeClass="opacity-100 bg-violet-500 rounded-lg"
      class="opacity-75"
    >
      <div class="flex items-center gap-x-2.5 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>New template</span>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/payrolls/templates"
      activeClass="opacity-100 bg-violet-500 rounded-lg"
      class="opacity-75"
    >
      <div class="flex items-center gap-x-2.5 opacity-75 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        </svg>

        <span>Templates</span>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/payrolls/address-book"
      activeClass="opacity-100 bg-violet-500 rounded-lg"
      class="opacity-75"
    >
      <div class="flex items-center gap-x-2.5 opacity-75 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>

        <span>Address book</span>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/payrolls/previous-payments"
      activeClass="opacity-100 bg-violet-500 rounded-lg"
      class="opacity-75"
    >
      <div class="flex items-center gap-x-2.5 opacity-75 p-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
          />
        </svg>

        <span>Previous payments</span>
      </div>
    </NuxtLink>
  </div>
</template>

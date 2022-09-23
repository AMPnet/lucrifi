<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <div
    class="flex flex-col justify-left bg-violet-600 text-white px-1 py-3 rounded-3xl text-xs gap-y-2"
  >
    <NuxtLink
      to="/payrolls"
      :class="
        route.path.endsWith('/payrolls')
          ? 'opacity-100 bg-violet-500 rounded-lg'
          : 'opacity-50'
      "
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
      :class="
        route.path.includes('templates')
          ? 'opacity-100 bg-violet-500 rounded-lg'
          : 'opacity-50'
      "
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
            d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
          />
        </svg>

        <span>Templates</span>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/payrolls/address-book"
      :class="
        route.path.includes('address-book')
          ? 'opacity-100 bg-violet-500 rounded-lg'
          : 'opacity-50'
      "
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
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>

        <span>Address book</span>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/payrolls/previous-payments"
      :class="
        route.path.includes('previous-payments')
          ? 'opacity-100 bg-violet-500 rounded-lg'
          : 'opacity-50'
      "
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
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <span>Previous payments</span>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useTemplates } from "@/stores/templates";

definePageMeta({
  layout: "payrolls",
});

const templatesStore = useTemplates();

const pending = ref(true);

templatesStore.fetchTemplates().finally(() => {
  pending.value = false;
});
</script>

<template>
  <div>
    <div class="rounded-t-md border-t border-x border-slate-200">
      <div
        class="bg-slate-100 rounded-t-md text-black font-bold text-sm grid grid-cols-7 py-4 px-5"
      >
        <span class="col-span-1">Created at</span>
        <span class="col-span-4">Template name</span>
        <span class="col-span-1">Last edited</span>
        <span class="col-span-1 text-center">Actions</span>
      </div>

      <div v-if="pending" class="border-b">
        <h3 class="text-slate-400 text-base my-8 text-center">
          Loading data...
        </h3>
      </div>

      <div v-else>
        <div v-if="templatesStore.templates.length > 0">
          <PayrollsTemplatesListItem
            v-for="(template, index) in templatesStore.templates"
            :key="index"
            :template="template"
          ></PayrollsTemplatesListItem>
        </div>
        <div v-else class="border-b">
          <h3 class="text-slate-400 text-base my-8 text-center">
            No templates found. Create a new template by clicking on "New
            template" menu.
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

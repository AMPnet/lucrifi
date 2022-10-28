<script setup lang="ts">
import { TemplateItem } from "@/types/payrolls/TemplateData";
import { useTemplates } from "@/stores/templates";
import { PropType } from "vue";

const templatesStore = useTemplates();

const props = defineProps({
  template: {
    type: Object as PropType<TemplateItem>,
    required: true,
  },
});

const showMenu = ref(false);
</script>

<template>
  <div
    class="bg-white text-gray-700 py-7 px-5 border-b border-slate-200 font-semibold hover:bg-slate-200"
  >
    <div class="grid grid-cols-7">
      <NuxtLink
        :to="`/payrolls/templates/${template.id}`"
        class="col-span-1 self-center text-xs text-slate-500"
      >
        {{ parseDatetime(props.template.created_at) }}</NuxtLink
      >

      <NuxtLink
        :to="`/payrolls/templates/${template.id}`"
        class="col-span-4 flex items-center gap-1.5"
      >
        <span>{{ props.template.template_name }}</span>
      </NuxtLink>

      <NuxtLink
        :to="`/payrolls/templates/${template.id}`"
        class="col-span-1 text-xs text-slate-500 self-center"
        >{{
          parseDatetime(props.template.updated_at || props.template.created_at)
        }}</NuxtLink
      >
      <div class="col-span-1 flex items-center justify-center">
        <div class="relative flex justify-start sm:justify-end">
          <button @click="showMenu = !showMenu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </button>

          <div
            v-show="showMenu"
            class="absolute z-10 left-0 sm:left-auto sm:right-0 top-6"
          >
            <div class="min-h-full py-3 sm:py-0 text-center">
              <div
                class="bg-white flex flex-col gap-3 rounded-lg py-2 text-sm text-left overflow-hidden shadow-lg sm:w-full"
              >
                <button
                  @click=""
                  class="hover:bg-slate-100 whitespace-nowrap w-full px-4 py-1.5"
                >
                  <div class="flex items-center gap-2">
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
                        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                      />
                    </svg>

                    <span>Share Link</span>
                  </div>
                </button>

                <NuxtLink
                  :to="`/payrolls/templates/${template.id}`"
                  @click="showMenu = false"
                  class="hover:bg-slate-100 whitespace-nowrap w-full px-4 py-1.5"
                >
                  <div class="flex items-center gap-2">
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
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>

                    <span>Preview</span>
                  </div>
                </NuxtLink>

                <button
                  @click="
                    templatesStore.removeTemplate(props.template.id);
                    showMenu = false;
                  "
                  class="hover:bg-slate-100 text-red-700 whitespace-nowrap w-full px-4 py-1.5"
                >
                  <div class="flex items-center gap-2">
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>

                    <span>Delete</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export interface Options {
  name: string;
  status: string;
  select: string;
  timeline: Date | Date[] | null;
}

export const useProjectDate = defineStore("project-date", () => {
  const projectOptions = ref<Options[]>([]);
  const projectArchived = ref<Options[]>([]);

  const newProjectAdd = (updateOption: Options) => {
    const newOption = reactive<Options>({
      name: "",
      status: "",
      select: "",
      timeline: null,
    });
    Object.assign(newOption, updateOption);
    projectOptions.value.push(newOption);
  };

  const projectsNames = computed(() => {
    return projectOptions.value.map((item) => item.name);
  });

  return { projectOptions, projectArchived, newProjectAdd, projectsNames };
});

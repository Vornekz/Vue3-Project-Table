import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export interface Options {
  name: string;
  status: string;
  select: string;
  timeline: Date | Date[] | null;
}

export const useProjectDate = defineStore("project-date", () => {
  const projectOptions = ref<Options[]>([]);

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

  return { projectOptions, newProjectAdd };
});

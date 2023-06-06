import { defineStore } from "pinia";
import { reactive } from "vue";

export interface Options {
  name: string;
  status: string;
  select: string;
  timeline: Date | Date[] | null;
}

export const useProjectDate = defineStore("project-date", () => {
  const projectOptions = reactive<Options>({
    name: "",
    status: "",
    select: "",
    timeline: null,
  });

  function newProjectAdd(updateOption: Options) {
    Object.assign(projectOptions, updateOption);
  }

  return { projectOptions, newProjectAdd };
});

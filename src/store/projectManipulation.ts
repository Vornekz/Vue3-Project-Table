import { defineStore } from "pinia";
import { Options } from "./projectDate";
import { ref } from "vue";

export const useProjectManipulation = defineStore(
  "project-manipulation",
  () => {
    const selectedProject = ref<Options[]>([]);
    const count = ref(0);

    // const transferProjectDate = (date: Options[]) => {};
    const checkFalse = () => {
      selectedProject.value.length = 0;
      count.value = 0;
    };

    return { selectedProject, count, checkFalse };
  }
);

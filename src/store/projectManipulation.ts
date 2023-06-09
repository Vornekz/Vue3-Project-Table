import { defineStore } from "pinia";
import { Options } from "./projectData";
import { ref } from "vue";

export const useProjectManipulation = defineStore(
  "project-manipulation",
  () => {
    const selectedProject = ref<Options[]>([]);
    const count = ref(0);
    const search = ref<string>("");
    const theme = ref(false);

    const checkFalse = () => {
      selectedProject.value.length = 0;
      count.value = 0;
    };

    const nameIndex = (data: Options[]) => {
      const indexArr = ref<number[]>([]);

      selectedProject.value.forEach((item) => {
        let index: number = data.findIndex((obj) => obj.name === item.name);
        indexArr.value.push(index);
      });
      indexArr.value.sort((a, b) => b - a);

      return indexArr;
    };

    const themeChange = () => {
      theme.value = !theme.value;
      localStorage.theme = JSON.stringify(theme.value);
    };

    return {
      selectedProject,
      count,
      search,
      theme,
      themeChange,
      checkFalse,
      nameIndex,
    };
  }
);

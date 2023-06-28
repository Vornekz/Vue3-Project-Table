import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export interface Options {
  name: string;
  status: string;
  select: string;
  timeline: string | string[] | null;
}

export const useProjectData = defineStore("project-data", () => {
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
    let projectOptionsNames = ref<string[]>([]);
    let projectArchivedNames = ref<string[]>([]);
    let projectNames = ref<string[]>([]);
    projectOptionsNames.value = projectOptions.value.map((item) => item.name);
    projectArchivedNames.value = projectArchived.value.map((item) => item.name);
    projectNames.value = [...projectOptionsNames.value].concat(
      projectArchivedNames.value
    );
    return projectNames;
  });

  const projectLoad = async (): Promise<{
    data: string | null;
    archive: string | null;
  }> => {
    const data = await localStorage.data;
    const archive = await localStorage.archived;

    return { data, archive };
  };

  return {
    projectOptions,
    projectArchived,
    newProjectAdd,
    projectsNames,
    projectLoad,
  };
});

import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useSelectIndex = defineStore("select-index", () => {
  interface GroupType {
    name: string;
    count: number;
    selected: boolean;
  }

  const group = ref<GroupType[]>([
    {
      name: "All",
      count: 0,
      selected: true,
    },
    {
      name: "Not started",
      count: 0,
      selected: false,
    },
    {
      name: "Planing",
      count: 0,
      selected: false,
    },
    {
      name: "In progress",
      count: 0,
      selected: false,
    },
    {
      name: "Completed",
      count: 0,
      selected: false,
    },
    {
      name: "Dropped",
      count: 0,
      selected: false,
    },
    {
      name: "Archived",
      count: 0,
      selected: false,
    },
  ]);

  const selectedIndex = ref(0);
  const newName = ref("All");
  const router = useRouter();

  const projectsCoutn = (projectStatus: string) => {
    group.value.forEach((element) => {
      if (element.name === projectStatus) {
        element.count++;
      }
    });
    group.value[0].count++;
  };

  const projectCountDown = (indexStatus: string, archived: boolean) => {
    group.value.forEach((element) => {
      if (element.name === indexStatus) {
        if (group.value[group.value.length - 1].selected) {
          if (!archived) {
            group.value[group.value.length - 1].count--;
          }
        } else {
          element.count--;
          group.value[0].count--;
          if (archived) {
            group.value[group.value.length - 1].count++;
          }
        }
      }
    });
  };

  const selectFilterElement = (select: string) => {
    let newIndex = ref(group.value.findIndex((item) => item.name === select));
    selectElement(newIndex.value);
    router.push({
      name: group.value[selectedIndex.value].name,
    });
  };

  const selectElement = (index: number) => {
    group.value[selectedIndex.value].selected = false;
    selectedIndex.value = index;
    newName.value = group.value[selectedIndex.value].name;
    group.value[selectedIndex.value].selected = true;
  };

  return {
    group,
    selectedIndex,
    newName,
    selectFilterElement,
    selectElement,
    projectsCoutn,
    projectCountDown,
  };
});

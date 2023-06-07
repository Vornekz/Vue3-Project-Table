import { defineStore } from "pinia";
import { ref } from "vue";

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

  const selectFilterElement = (select: string) => {
    let newIndex = ref(group.value.findIndex((item) => item.name === select));
    selectElement(newIndex.value);
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
  };
});

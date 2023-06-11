<script setup lang="ts">
import { ref } from "vue";
import { useSelectIndex } from "@/store/selectIndex";
import { useProjectManipulation } from "@/store/projectManipulation";
import { useProjectDate } from "@/store/projectDate";
import MainNavGroup from "@/components/MainNavGroup.vue";
import CreateProject from "@/components/CreateProject.vue";
import { computed } from "@vue/reactivity";

let selectIndex = useSelectIndex();
let selected = useProjectManipulation();
const porjectDate = useProjectDate();
let selectFilterElement = selectIndex.selectFilterElement;
const action = ref("Actions");
let windowOpen = ref(false);
let filterSelect = ref("All");

const changeName = () => {
  filterSelect.value = selectIndex.newName;
};

const openWindow = () => {
  windowOpen.value = !windowOpen.value;
};

const nameIndex = computed(() => {
  const indexArr = ref<number[]>([]);
  selected.selectedProject.forEach((item) => {
    let index: number = porjectDate.projectOptions.findIndex(
      (obj) => obj.name === item.name
    );
    indexArr.value.push(index);
  });
  return indexArr;
});

const actionAcept = () => {
  if (selected.selectedProject.length > 0) {
    if (action.value === "Delete") {
      nameIndex.value.value.forEach((index) => {
        porjectDate.projectOptions.splice(index, 1);
      });
    } else if (action.value === "Archive") {
      nameIndex.value.value.forEach((index) => {
        porjectDate.projectArchived.push(porjectDate.projectOptions[index]);
        porjectDate.projectOptions.splice(index, 1);
      });
    }

    selected.selectedProject.length = 0;
    selected.count = 0;
  }
};
</script>

<template>
  <section>
    <div class="mainNav">
      <div class="select">
        <label for="actions" class="select__label">
          <span>{{ selected.count }}</span>
          Selected
        </label>
        <select
          name="actions"
          id="actions"
          class="select__actions"
          v-model="action"
        >
          <option value="Actions" selected hidden>Actions</option>
          <option value="Edit">Edit</option>
          <option value="Archive">Archive</option>
          <option value="Delete">Delete</option>
        </select>
        <button class="select__button" @click="selected.checkFalse">
          &#10005;
        </button>
        <button class="select__button confirm" @click="actionAcept">
          &#10003;
        </button>
      </div>
      <form class="search">
        <div class="search__filter">
          <label for="group" class="search__filter-label">
            <svg>
              <use xlink:href="@/assets/svg/sprite.svg#group"></use>
            </svg>
          </label>
          <select
            name="group"
            id="group"
            class="search__filter-select"
            v-model="filterSelect"
            @change="selectFilterElement(filterSelect)"
          >
            <option value="All" selected>All</option>
            <option value="Not started">Not started</option>
            <option value="Planing">Planing</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
        <div class="search__input">
          <label for="search" class="search__input-label">
            <svg>
              <use xlink:href="@/assets/svg/sprite.svg#search"></use>
            </svg>
          </label>
          <input
            type="search"
            name="search"
            id="search"
            class="search__input-place"
            placeholder="Search"
          />
        </div>
      </form>
      <button class="mainNav__button" @click="openWindow">
        <svg>
          <use xlink:href="@/assets/svg/sprite.svg#plus"></use>
        </svg>
        New Project
      </button>
    </div>
    <MainNavGroup class="mainNavGroup" @change-filter-value="changeName" />
    <CreateProject :window-open="windowOpen" @close-open-window="openWindow" />
  </section>
</template>

<style scoped lang="scss">
@import "@/assets/style/mixin.scss";
.mainNav {
  display: grid;
  grid-template-columns: 300px 300px 1fr;
  grid-column-gap: 20px;
  align-items: center;
  padding: 30px;

  .select {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-right: 40px;

    &__label {
      span {
        @include countCircle;
      }
    }

    &__actions {
      @include searchBorder(100px, 6px);
      padding: 5px 10px;
    }

    &__button {
      border: none;
      outline: none;
      background-color: transparent;
      color: #ea3b51;

      &:hover {
        color: #5e5adb;
      }
    }
    .confirm {
      color: green;

      &:hover {
        color: #5e5adb;
      }
    }
  }

  .search {
    display: flex;
    align-items: center;

    &__filter {
      position: relative;

      &-label {
        position: absolute;
        left: 15px;
        top: 10px;

        svg {
          fill: #464f60;
          width: 12px;
          height: 14px;
        }
      }

      &-select {
        @include searchBorder(unset, 6px 0 0 6px);
        padding-left: 30px;
      }
    }

    &__input {
      position: relative;

      &-label {
        position: absolute;
        left: 15px;
        top: 10px;

        svg {
          fill: #868fa0;
          width: 12px;
          height: 14px;
        }
      }

      &-place {
        @include searchBorder(200px, 0 6px 6px 0);
        padding-left: 30px;
      }
    }
  }

  &__button {
    display: flex;
    margin: 0 20px;
    align-items: center;
    justify-content: space-evenly;
    justify-self: flex-end;
    @include searchBorder(130px, 6px);
    background-color: #5e5adb;
    color: #fff;

    svg {
      fill: #fff;
      width: 12px;
      height: 14px;
    }
  }
}

.mainNavGroup {
  width: 80%;
}
</style>

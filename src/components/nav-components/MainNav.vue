<script setup lang="ts">
import { ref, watch } from "vue";
import { useSelectIndex } from "@/store/selectIndex";
import { useProjectManipulation } from "@/store/projectManipulation";
import { useProjectData } from "@/store/projectData";
import MainNavGroup from "@/components/nav-components/MainNavGroup.vue";
import CreateProject from "@/components/nav-components/CreateProject.vue";
import { computed } from "@vue/reactivity";
import { saveData } from "@/composable/dataLocalSave";

const selectIndex = useSelectIndex();
const selected = useProjectManipulation();
const porjectData = useProjectData();
const action = ref("Actions");
const windowOpen = ref(false);
const filterSelect = ref("All");

const changeName = () => {
  filterSelect.value = selectIndex.newName;
};

const openWindow = () => {
  windowOpen.value = !windowOpen.value;
};

const archivedCheck = computed(() => {
  if (filterSelect.value === "Archived") {
    return selected.nameIndex(porjectData.projectArchived);
  } else {
    return selected.nameIndex(porjectData.projectOptions);
  }
});

const actionAcept = () => {
  if (selected.selectedProject.length > 0) {
    if (action.value === "Delete") {
      archivedCheck.value.value.forEach((index) => {
        if (filterSelect.value === "Archived") {
          selectIndex.projectCountDown(
            porjectData.projectArchived[index].status,
            false
          );
          porjectData.projectArchived.splice(index, 1);
        } else {
          selectIndex.projectCountDown(
            porjectData.projectOptions[index].status,
            false
          );
          porjectData.projectOptions.splice(index, 1);
        }
      });
    } else if (action.value === "Archive") {
      archivedCheck.value.value.forEach((index) => {
        selectIndex.projectCountDown(
          porjectData.projectOptions[index].status,
          true
        );
        porjectData.projectArchived.push(porjectData.projectOptions[index]);
        porjectData.projectOptions.splice(index, 1);
      });
    }

    saveData();
    selected.checkFalse();
  }
};

watch(
  () => filterSelect.value,
  () => {
    action.value = "Actions";
  }
);
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
          <option value="Archive" v-if="filterSelect !== 'Archived'">
            Archive
          </option>
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
            @change="selectIndex.selectFilterElement(filterSelect)"
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
            v-model="selected.search"
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 30px;

  .select {
    flex-basis: 300px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 10px 40px 10px 10px;

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
      cursor: pointer;

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
    flex-basis: 300px;
    display: flex;
    align-items: center;
    margin: 10px 20px 10px 10px;

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
    margin: 10px 20px;
    margin-left: auto;
    align-items: center;
    justify-content: space-evenly;
    @include searchBorder(130px, 6px);
    background-color: #5e5adb;
    color: #fff;
    cursor: pointer;

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
@/store/projectData

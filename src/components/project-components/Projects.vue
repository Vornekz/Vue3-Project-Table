<script setup lang="ts">
import { Options } from "@/store/projectDate";
import { useProjectManipulation } from "@/store/projectManipulation";
import { onMounted, reactive, ref, watch, watchEffect } from "vue";

export interface Edit {
  push: boolean;
  name: string;
  date: {
    newName: string;
    newStatus: string;
    newTimeline: Date | Date[] | null;
  };
}

const props = defineProps<{
  date: Options[];
  keyId: string;
}>();
const selected = useProjectManipulation();
const selectedDate = ref<Options[]>([]);
const selectAll = ref(false);
const newDate = ref<Options[][]>([]);
const filterdDate = ref<Options[]>([]);
const curentPage = ref(1);
const pages = ref<number[]>([]);
const edit = reactive<Edit>({
  push: false,
  name: "",
  date: {
    newName: "",
    newStatus: "",
    newTimeline: new Date(),
  },
});

onMounted(() => {
  selectAll.value = false;

  pages.value.length = 0;
  for (let i = 1; i <= newDate.value.length; i++) {
    pages.value.push(i);
  }
});

const setEdit = (element: Options) => {
  edit.push = !edit.push;
  edit.name = element.name;
  edit.date.newName = element.name;
  edit.date.newStatus = element.status;
  edit.date.newTimeline = element.timeline;
};

const closeEdit = () => {
  edit.push = !edit.push;
};

const confirmEdit = () => {};

watch(
  () => selected.search.length,
  (newValue) => {
    if (newValue > 0) {
      selectAll.value = false;
    }
  }
);

watch(
  () => newDate.value.length,
  (newValue, oldValue) => {
    if (newValue - oldValue === 1) {
      pages.value.push(newValue);
    } else {
      pages.value.length = 0;
      for (let i = 1; i <= newDate.value.length; i++) {
        pages.value.push(i);
      }
    }
  }
);

watch(selectedDate, (newValue) => {
  selected.selectedProject = newValue;
  selected.count = newValue.length;
  if (selected.selectedProject.length === 0) {
    selectAll.value = false;
    console.log(selected.selectedProject.length);
  }
});

watch(selectAll, (newValue) => {
  if (newValue) {
    selectedDate.value = [...filterdDate.value];
  } else {
    selected.checkFalse();
  }
});

watchEffect(() => {
  props.date;
  let startElement = ref(0);
  let endElement = ref(4);

  if (selected.search.length > 0) {
    filterdDate.value = props.date.filter((item) => {
      return item.name.toLowerCase().includes(selected.search.toLowerCase());
    });
  } else {
    filterdDate.value = props.date;
  }

  if (filterdDate.value.length >= 5) {
    let partDate = ref<Options[]>([]);
    newDate.value.length = 0;
    for (let i = 0; i < filterdDate.value.length / 4; i++) {
      partDate.value = filterdDate.value.slice(
        startElement.value,
        endElement.value
      );
      newDate.value.push(partDate.value);
      startElement.value = endElement.value;
      endElement.value += 4;
    }
  } else {
    newDate.value = [[...filterdDate.value]];
  }
});
</script>

<template>
  <div class="projects">
    <div class="projects__project">
      <div class="projects__project-checkbox">
        <label class="selectAll" :for="`selectAll ${keyId}`">Select All</label>
        <input type="checkbox" :id="`selectAll ${keyId}`" v-model="selectAll" />
      </div>
      <div class="projects__project-index">
        <h4>№</h4>
      </div>
      <div class="projects__project-name">
        <h4>Name</h4>
      </div>
      <div class="projects__project-status">
        <h4>Status</h4>
      </div>
      <div class="projects__project-date project-date">
        <h4>Timeline</h4>
      </div>
    </div>
    <div
      class="project__page"
      v-for="(page, pageIndex) in newDate"
      :key="`${curentPage} ${pageIndex} ${keyId}`"
    >
      <div
        v-if="pageIndex + 1 === curentPage"
        class="projects__project"
        v-for="(element, i) in page"
        :key="`${element.name} ${i + 1} ${keyId}`"
      >
        <div class="projects__project-checkbox">
          <input
            type="checkbox"
            :name="element.name"
            :id="`${element.name} checkbox #${i + 1} ${keyId}`"
            :value="element"
            v-model="selectedDate"
            v-if="!edit.push || edit.name !== newDate[pageIndex][i].name"
          />
        </div>
        <div class="projects__project-index">
          <p>№ {{ pageIndex * 4 + (i + 1) }}</p>
        </div>
        <div class="projects__project-name">
          <p v-if="!edit.push || edit.name !== newDate[pageIndex][i].name">
            {{ element.name }}
          </p>
          <input
            type="text"
            v-if="edit.name === element.name && edit.push"
            v-model="edit.date.newName"
          />
        </div>
        <div class="projects__project-status">
          <p v-if="!edit.push || edit.name !== newDate[pageIndex][i].name">
            {{ element.status }}
          </p>
          <select
            name="editSelect"
            class="projects__project-status"
            v-model="edit.date.newStatus"
            v-if="edit.name === element.name && edit.push"
          >
            <option value="Not started">Not started</option>
            <option value="Planing">Planing</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>
        <div class="projects__project-date project-date">
          <div
            class="project-date_single"
            v-if="!Array.isArray(element.timeline)"
          >
            <p class="project-date__single-date">
              <span v-if="element.status === 'Planing'"
                >Planned project start:</span
              >
              <span v-else>Project start:</span>
              {{
                element.timeline !== null
                  ? element.timeline.toLocaleString()
                  : "Without Date"
              }}
            </p>
          </div>
          <div class="project-date__range" v-else>
            <p class="project-date__range-date1">
              <span>Project start:</span>
              {{
                element.timeline !== null
                  ? (element.timeline as Date[])[0].toLocaleString()
                  : "Without Date"
              }}
            </p>
            <svg class="project-date__range-svg">
              <use xlink:href="@/assets/svg/sprite.svg#point-right"></use>
            </svg>
            <p class="project-date__range-date2">
              <span v-if="element.status === 'Planing'"
                >Planned project deadline:</span
              >
              <span v-else-if="element.status === 'In Progress'"
                >Project deadline:</span
              >
              <span v-else-if="element.status === 'Completed'"
                >Project compleated:</span
              >
              <span v-else>Project dropped</span>
              {{
                element.timeline !== null
                  ? (element.timeline as Date[])[1].toLocaleString()
                  : ""
              }}
            </p>
          </div>
        </div>
        <button class="projects__project-edit" @click="setEdit(element)">
          Edit
        </button>
        <button
          class="projects__project-edit"
          v-if="edit.name === element.name && edit.push"
          @click="closeEdit"
        >
          Close
        </button>
        <button
          class="projects__project-confirm"
          v-if="edit.name === element.name && edit.push"
        >
          Confirm
        </button>
      </div>
    </div>

    <div class="projects__pages" v-if="pages.length > 1">
      <button
        class="projects__pages-page"
        v-for="number in pages"
        @click="curentPage = number"
      >
        {{ number }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/style/mixin";
.projects {
  padding: 30px;

  &__pages {
    width: fit-content;
    margin: 10px auto;
    display: flex;
    justify-content: center;

    &-page {
      padding: 10px;
      margin-right: 10px;
      border: 1px black solid;
      border-radius: 30%;
      background-color: #9cb1db;
      cursor: pointer;
    }
  }

  &__project {
    display: flex;
    position: relative;
    align-items: center;
    border: 3px solid rgb(163, 155, 155);
    border-radius: 10px;
    min-height: 10vh;
    margin-bottom: 25px;
    padding: 0 25px;
    background-color: #f7f9fc;
    color: #4f5a65;

    &-checkbox {
      position: relative;
      flex-basis: 5%;
      display: flex;
      justify-content: center;
      margin: 15px;

      .selectAll {
        width: 75px;
        position: absolute;
        bottom: 30px;
        left: 0;
      }

      input {
        width: 25px;
        height: 25px;
      }
    }

    &-index {
      flex-basis: 10%;
      margin: 15px;
      display: flex;
      justify-content: center;
      font-size: 25px;
    }

    &-name {
      flex-basis: 30%;
      max-width: 375px;
      margin: 15px;
      font-size: 25px;
      overflow-wrap: break-word;
    }

    &-status {
      flex-basis: 15%;
      display: flex;
      justify-content: center;
      font-size: 20px;
    }

    &-date {
      flex-basis: 35%;
      display: flex;
      justify-content: center;
      text-align: center;
      font-size: 18px;

      .project-date__range-svg {
        transform: rotate(90deg);
        width: 15px;
        height: 15px;
      }
    }

    &-edit {
      @include insideProjectButton();
      border-top: 0;
      border-right: 0;
    }
    &-confirm {
      @include insideProjectButton(unset, 0.5px, 0.5px, unset);
      border-bottom: 0;
      border-right: 0;
    }
  }
}
</style>

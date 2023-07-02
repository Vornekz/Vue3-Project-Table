<script setup lang="ts">
import { Options, useProjectData } from "@/store/projectData";
import { useProjectManipulation } from "@/store/projectManipulation";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useCheck } from "@/composable/dataCheck";
import DatePicker from "@/components/project-components/DatePicker.vue";
import { useSelectIndex } from "@/store/selectIndex";
import { saveData } from "@/composable/dataLocalSave";

export interface Edit {
  push: boolean;
  name: string;
  status: string;
}

const props = defineProps<{
  data: Options[];
  keyId: string;
}>();

const selected = useProjectManipulation();
const projectData = useProjectData();
const projectIndex = useSelectIndex();
const selectedData = ref<Options[]>([]);
const selectAll = ref(false);
const newData = ref<Options[][]>([]);
const filterdData = ref<Options[]>([]);
const curentPage = ref(1);
const pages = ref<number[]>([]);
const redDateStyle = ref(false);
const redStyle = ref(false);
const edit = reactive<Edit>({
  push: false,
  name: "",
  status: "",
});
const editOption = ref<Options>({
  name: "",
  status: "Not started",
  select: "start",
  timeline: new Date().toLocaleString(),
});

onMounted(() => {
  selectAll.value = false;

  pages.value.length = 0;
  for (let i = 1; i <= newData.value.length; i++) {
    pages.value.push(i);
  }
});

const setEdit = (element: Options) => {
  selected.checkFalse();
  edit.push = !edit.push;
  edit.name = editOption.value.name = element.name;
  edit.status = editOption.value.status = element.status;
  editOption.value.select = element.select;
  editOption.value.timeline = element.timeline;
};

const closeEdit = () => {
  edit.push = !edit.push;
  editOption.value = {
    name: "",
    status: "Not started",
    select: "start",
    timeline: new Date().toLocaleString(),
  };
};

const nameVarification = computed(() => {
  for (const name of projectData.projectsNames.value) {
    if (name === editOption.value.name && name !== edit.name) {
      return true;
    }
  }
  return false;
});

const confirmEdit = async (element: Options) => {
  if (useCheck(editOption.value, nameVarification, redStyle, redDateStyle)) {
  } else {
    if (editOption.value.status === "Not started") {
      editOption.value.timeline = null;
    }
    redStyle.value = false;
    if (edit.push && element.name === edit.name) {
      selected.selectedProject.push(element);
      projectIndex.projectCountDown(edit.status, false);

      Object.assign(
        projectData.projectOptions[
          selected.nameIndex(projectData.projectOptions).value[0]
        ],
        editOption.value
      );

      projectIndex.projectsCoutn(editOption.value.status);
      selected.selectedProject.length = 0;
      saveData();
      edit.push = !edit.push;
    }
  }
};

watch(
  () => editOption.value.name,
  (newValue) => {
    if (newValue.trim() !== "") {
      redStyle.value = false;
    }
  }
);

watch(
  () => editOption.value.timeline,
  (newValue) => {
    if (newValue !== null) {
      redDateStyle.value = false;
    }
  }
);

watch(
  () => selected.search.length,
  (newValue) => {
    if (newValue > 0) {
      selectAll.value = false;
    }
  }
);

watch(
  () => newData.value.length,
  (newValue, oldValue) => {
    if (newValue - oldValue === 1) {
      pages.value.push(newValue);
    } else {
      pages.value.length = 0;
      for (let i = 1; i <= newData.value.length; i++) {
        pages.value.push(i);
      }
    }
  }
);

watch(selectedData, (newValue) => {
  selected.selectedProject = newValue;
  selected.count = newValue.length;
  if (selected.selectedProject.length === 0) {
    selectAll.value = false;
  }
});

watch(selectAll, (newValue) => {
  if (newValue) {
    selectedData.value = [...filterdData.value];
  } else {
    selected.checkFalse();
  }
});

watchEffect(() => {
  props.data;
  let startElement = ref(0);
  let endElement = ref(4);

  if (selected.search.length > 0) {
    filterdData.value = props.data.filter((item) => {
      return item.name.toLowerCase().includes(selected.search.toLowerCase());
    });
  } else {
    filterdData.value = props.data;
  }

  if (filterdData.value.length >= 5) {
    let partData = ref<Options[]>([]);
    newData.value.length = 0;
    for (let i = 0; i < filterdData.value.length / 4; i++) {
      partData.value = filterdData.value.slice(
        startElement.value,
        endElement.value
      );
      newData.value.push(partData.value);
      startElement.value = endElement.value;
      endElement.value += 4;
    }
  } else {
    newData.value = [[...filterdData.value]];
  }
});
</script>

<template>
  <div class="projects">
    <div class="projects__project" :class="{ black: selected.theme }">
      <div class="projects__project-checkbox">
        <label v-if="!edit.push" class="selectAll" :for="`selectAll ${keyId}`"
          >Select All</label
        >
        <input
          v-if="!edit.push"
          type="checkbox"
          :id="`selectAll ${keyId}`"
          v-model="selectAll"
        />
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
      v-for="(page, pageIndex) in newData"
      :key="`${curentPage} ${pageIndex} ${keyId}`"
    >
      <div
        v-if="pageIndex + 1 === curentPage"
        class="projects__project"
        v-for="(element, i) in page"
        :key="`${element.name} ${i + 1} ${keyId}`"
        :class="{ black: selected.theme }"
      >
        <div class="projects__project-checkbox">
          <input
            type="checkbox"
            :name="element.name"
            :id="`${element.name} checkbox #${i + 1} ${keyId}`"
            :value="element"
            v-model="selectedData"
            v-if="!edit.push"
          />
        </div>
        <div class="projects__project-index">
          <p>№ {{ pageIndex * 4 + (i + 1) }}</p>
        </div>
        <div class="projects__project-name">
          <p v-if="!edit.push || edit.name !== newData[pageIndex][i].name">
            {{ element.name }}
          </p>
          <input
            type="text"
            v-if="edit.name === element.name && edit.push"
            v-model="editOption.name"
            :class="{ error: redStyle }"
          />
        </div>
        <div class="projects__project-status">
          <p v-if="!edit.push || edit.name !== newData[pageIndex][i].name">
            {{ element.status }}
          </p>
          <select
            name="editSelect"
            class="projects__project-status"
            v-model="editOption.status"
            v-if="edit.name === element.name && edit.push"
          >
            <option value="Not started">Not started</option>
            <option value="Planing">Planing</option>
            <option value="In progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>
        <div
          class="projects__project-date project-date"
          v-if="!edit.push || edit.name !== newData[pageIndex][i].name"
        >
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
                element.timeline !== null ? element.timeline : "Without Date"
              }}
            </p>
          </div>
          <div class="project-date__range" v-else>
            <p class="project-date__range-date1">
              <span>Project start:</span>
              {{
                element.timeline !== null
                  ? (element.timeline as string[])[0]
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
                  ? (element.timeline as string[])[1]
                  : ""
              }}
            </p>
          </div>
        </div>
        <DatePicker
          class="projects__project-date"
          :update-option="editOption"
          :red-date-style="redDateStyle"
          v-if="edit.name === element.name && edit.push"
        />
        <button
          class="projects__project-edit"
          @click="setEdit(element)"
          v-if="projectIndex.newName !== 'Archived'"
          :class="{ blue: selected.theme }"
        >
          Edit
        </button>
        <button
          class="projects__project-edit"
          v-if="
            edit.name === element.name &&
            edit.push &&
            projectIndex.newName !== 'Archived'
          "
          @click="closeEdit"
          :class="{ blue: selected.theme }"
        >
          Close
        </button>
        <button
          class="projects__project-confirm"
          v-if="edit.name === element.name && edit.push"
          @click="confirmEdit(element)"
          :class="{ blue: selected.theme }"
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
  padding: 10px 30px;

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
    flex-wrap: wrap;
    position: relative;
    align-items: center;
    justify-content: center;
    border: 3px solid rgb(163, 155, 155);
    border-radius: 10px;
    min-height: 10vh;
    margin-bottom: 25px;
    padding-right: 75px;
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
        top: 30px;
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

      .error {
        border-color: #ff0000;
        outline-color: #ff0000;
      }
    }

    &-status {
      flex-basis: 10%;
      display: flex;
      justify-content: center;
      margin: 0 5px;
      font-size: 20px;
    }

    &-date {
      flex-basis: 35%;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 5px;
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
  .black {
    background-color: #4f5a65;
    color: #fff;
  }

  .blue {
    background-color: #5e5adb;
    color: #fff;
  }
}
</style>
@/store/projectData

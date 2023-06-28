<script setup lang="ts">
import { Options, useProjectData } from "@/store/projectData.ts";
import DatePicker from "@/components/project-components/DatePicker.vue";
import { reactive, ref, watch, watchEffect } from "vue";
import { computed } from "@vue/reactivity";
import { useSelectIndex } from "@/store/selectIndex";
import { useCheck } from "@/composable/dataCheck";
import { useProjectManipulation } from "@/store/projectManipulation";
import { saveData } from "@/composable/dataLocalSave";

interface Status {
  status: string;
  id: string;
}

const props = defineProps<{
  windowOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "closeOpenWindow"): void;
}>();

const projectData = useProjectData();
const index = useSelectIndex();
const manipulation = useProjectManipulation();
const redStyle = ref(false);
const redDateStyle = ref(false);

const updateOption = reactive<Options>({
  name: "",
  status: "Not started",
  select: "start",
  timeline: new Date().toLocaleString(),
});

const statusInput = ref<Status[]>([
  {
    status: "Not started",
    id: "notStarted",
  },
  {
    status: "Planing",
    id: "planing",
  },
  {
    status: "In progress",
    id: "inProgress",
  },
  {
    status: "Completed",
    id: "completed",
  },
  {
    status: "Dropped",
    id: "dropped",
  },
]);

const nameVarification = computed(() => {
  for (const name of projectData.projectsNames.value) {
    if (name === updateOption.name) {
      return true;
    }
  }
  return false;
});

const addAndClose = () => {
  if (useCheck(updateOption, nameVarification, redStyle, redDateStyle)) {
  } else {
    if (updateOption.status === "Not started") {
      updateOption.timeline = null;
    }
    redStyle.value = false;
    projectData.newProjectAdd(updateOption);
    index.projectsCoutn(updateOption.status);
    emit("closeOpenWindow");
    saveData();
  }
};

const reset = () => {
  updateOption.name = "";
  updateOption.select = "start";
  updateOption.status = "Not started";
  updateOption.timeline = new Date().toLocaleString();
};

watchEffect(() => {
  if (props.windowOpen === true) {
    updateOption.timeline = new Date().toLocaleString();
    reset();
  }
});

watch(updateOption, (newValue) => {
  if (newValue.name.trim() !== "") {
    redStyle.value = false;
  }

  if (newValue.timeline !== null) {
    redDateStyle.value = false;
  }
});

watch(
  () => updateOption.status,
  (newValue) => {
    if (newValue !== "Completed" && newValue !== "Dropped") {
      updateOption.select = "start";
    }
  }
);
</script>

<template>
  <section class="create" v-if="props.windowOpen">
    <header class="create__header" :class="{ grey: manipulation.theme }">
      <h3>Add new Project</h3>
    </header>
    <form
      class="create__project"
      onsubmit="return false"
      :class="{ blue: manipulation.theme }"
    >
      <div class="project-name">
        <label for="projectName" class="project-name__label">
          Project name
          <span v-if="redStyle === true" style="color: #ff0000">
            incorect value or name already exist
          </span>
        </label>
        <input
          type="text"
          class="project-name__input"
          :class="{ error: redStyle }"
          required
          maxlength="30"
          id="projectName"
          v-model="updateOption.name"
        />
      </div>
      <div class="project-status">
        <h4 class="project-status__title">Project status</h4>
        <label
          class="project-status__label"
          v-for="label in statusInput"
          :key="`label-${label.id}`"
          :for="label.id"
          :class="{ checked: label.status === updateOption.status }"
        >
          {{ label.status }}
        </label>
        <input
          type="radio"
          required
          class="project-status__radio"
          v-for="radio in statusInput"
          :key="`radio-${radio.id}`"
          :id="radio.id"
          :value="radio.status"
          v-model="updateOption.status"
          name="status"
        />
      </div>
      <DatePicker
        :update-option="updateOption"
        :red-date-style="redDateStyle"
      />
    </form>
    <footer class="create__footer" :class="{ grey: manipulation.theme }">
      <button class="cancel" @click="$emit('closeOpenWindow')">Cancel</button>
      <button class="add-project" @click="addAndClose">Add project</button>
    </footer>
  </section>
</template>

<style scoped lang="scss">
@import "@/assets/style/mixin";

.create {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 2;
  left: 45%;
  top: 30%;
  width: 450px;
  height: 515px;
  border: 2px rgba(70, 79, 96, 0.88) solid;
  border-radius: 15px;
  background-color: #e5e5e5;

  &__header {
    height: 60px;
    padding: 20px;
    border-radius: 12px 12px 0 0;
    background-color: rgba(134, 143, 160, 0.44);
    font-size: 18px;
    font-weight: bold;
  }

  &__project {
    padding: 0 20px;
    flex-grow: 1;
  }

  .project-name {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    font-weight: bold;

    &__label {
      margin-bottom: 10px;
    }

    .error {
      border-color: #ff0000;
      outline-color: #ff0000;
    }

    &__input {
      height: 30px;
      border: 1px #9fa5b0 solid;
      border-radius: 5px;
      padding-left: 10px;
      color: #000;
    }
  }

  .project-status {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0;

    &__title {
      width: 100%;
      margin-bottom: 5px;
    }

    .checked {
      background-color: #5e5adb;
      color: #fff;
    }

    &__label {
      padding: 5px;
      margin: 10px 10px 10px 0;
      background-color: #fff;
      border: 1px #9fa5b0 solid;
      border-radius: 5px;
      cursor: pointer;
      color: #000;
    }

    &__radio {
      display: none;
    }
  }

  &__footer {
    display: flex;
    justify-self: flex-end;
    justify-content: flex-end;
    height: 60px;
    padding: 15px;
    border-radius: 0 0 12px 12px;
    background-color: rgba(134, 143, 160, 0.44);

    .cancel {
      @include searchBorder(100px, 6px);
      background-color: #fff;
      border: none;
    }

    .add-project {
      @include searchBorder(130px, 6px);
      margin-left: 20px;
      background-color: #5e5adb;
      border: none;
      color: #fff;
    }
  }
  .blue {
    background-color: #181818ec;
  }

  .grey {
    background-color: #34373a;
  }
}
</style>

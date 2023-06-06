<script setup lang="ts">
import VueDatePicker from "@vuepic/vue-datepicker";
import { DatePickerInstance } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { Options, useProjectDate } from "@/store/projectDate.ts";
import { reactive, ref, watch } from "vue";

interface Status {
  status: string;
  id: string;
}

const props = defineProps<{
  windowClosed: boolean;
}>();

const emit = defineEmits<{
  (e: "closeOpenWindow"): void;
}>();

const projectDate = useProjectDate();
const select = ref("range");
const redStyle = ref(false);
const datepicker = ref<DatePickerInstance>(null);
const datepickerRange = ref<DatePickerInstance>(null);

const updateOption = reactive<Options>({
  name: "",
  status: "Not Started",
  select: "start",
  timeline: null,
});

const statusInput = ref<Status[]>([
  {
    status: "Not Started",
    id: "notStarted",
  },
  {
    status: "Planing",
    id: "planing",
  },
  {
    status: "In Progress",
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

const addAndClose = () => {
  if (updateOption.name === "") {
    redStyle.value = true;
  } else {
    redStyle.value = false;
    projectDate.newProjectAdd(updateOption);
    emit("closeOpenWindow");
  }
};

watch(select, (newValue) => {
  if (newValue === "start" && datepicker) {
    updateOption.timeline = null;
    datepicker.value?.clearValue;
  }
  if (newValue === "range" && datepickerRange) {
    updateOption.timeline = null;
    datepickerRange.value?.clearValue;
  }
});
</script>

<template>
  <section class="create" v-if="props.windowClosed">
    <header class="create__header">
      <h3>Add new Project</h3>
    </header>
    <form class="create__project" onsubmit="return false">
      <div class="project-name">
        <label for="projectName" class="project-name__label">
          Project name
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
      <div class="project-timeline">
        <h4 class="project-timeline__title">Project timeline</h4>
        <select
          name="timeGroup"
          id="timeGroup"
          v-model="select"
          class="project-timeline__select"
        >
          <option value="start">Start time</option>
          <option value="range">Range time</option>
        </select>
        <div class="project-timeline__date" v-if="select === 'start'">
          <VueDatePicker
            ref="datepicker"
            v-model="updateOption.timeline"
            format="MM/dd/yyyy HH:mm"
            placeholder="DD/MM/YYYY"
            :required="select === 'start'"
          >
          </VueDatePicker>
        </div>
        <div class="project-timeline__range" v-if="select === 'range'">
          <VueDatePicker
            ref="datepickerRange"
            v-model="updateOption.timeline"
            format="MM/dd/yyyy HH:mm - MM/dd/yyyy HH:mm"
            placeholder="DD/MM/YYYY ~ DD/MM/YYYY"
            range
            :required="select === 'range'"
          >
          </VueDatePicker>
        </div>
      </div>
    </form>
    <footer class="create__footer">
      <button class="cancel" @click="$emit('closeOpenWindow')">Cancel</button>
      <button class="add-project" @click="addAndClose">Add project</button>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.error {
  border-color: red;
}

@import "@/assets/style/mixin";

.create {
  position: absolute;
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
  }

  .project-name {
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    font-weight: bold;

    &__label {
      margin-bottom: 10px;
    }

    &__input {
      height: 30px;
      border: 1px #9fa5b0 solid;
      border-radius: 5px;
      padding-left: 10px;
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
    }

    &__radio {
      display: none;
    }
  }

  .project-timeline {
    display: grid;
    grid-template: 30px 60px / 1fr 1fr;
    padding: 20px 0;

    &__title {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    &__select {
      @include searchBorder(150px, 6px);
      padding: 5px 10px;
    }

    &__date {
      .mx-datepicker {
        width: 150px;
      }
    }

    &__range {
      .mx-datepicker {
        width: 250px;
      }
    }
  }

  &__footer {
    display: flex;
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
}
</style>

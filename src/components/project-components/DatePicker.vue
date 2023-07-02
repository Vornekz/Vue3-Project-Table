<script setup lang="ts">
import { Options } from "@/store/projectData";
import { ref, watch, watchEffect } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import { DatePickerInstance } from "@vuepic/vue-datepicker";

const props = defineProps<{
  updateOption: Options;
  redDateStyle: boolean;
}>();

const timeline = ref<Date | Date[] | null>(new Date());
const newSelect = ref("");
const datepicker = ref<DatePickerInstance>(null);
const datepickerRange = ref<DatePickerInstance>(null);

watch(timeline, (newValue) => {
  if (newValue !== null) {
    if (Array.isArray(newValue)) {
      props.updateOption.timeline = [
        newValue[0].toLocaleString(),
        newValue[1].toLocaleString(),
      ];
    } else {
      props.updateOption.timeline = newValue.toLocaleString();
    }
  }
});

watch(newSelect, (newValue) => {
  props.updateOption.select = newValue;
});

watchEffect(() => {
  if (
    props.updateOption.status === "Completed" ||
    props.updateOption.status === "Dropped"
  ) {
    newSelect.value = "range";
  } else {
    newSelect.value = props.updateOption.select;
  }
});

watch(newSelect, (newValue) => {
  if (newValue === "start" && datepicker) {
    timeline.value = new Date();
    datepicker.value?.clearValue;
  }
  if (newValue === "range" && datepickerRange) {
    timeline.value = null;
    datepickerRange.value?.clearValue;
  }
});
</script>
<template>
  <div class="project-timeline" v-if="updateOption.status !== 'Not started'">
    <h4 class="project-timeline__title">Project timeline</h4>
    <select
      name="timeGroup"
      id="timeGroup"
      v-model="newSelect"
      class="project-timeline__select"
      v-if="
        updateOption.status !== 'Completed' && updateOption.status !== 'Dropped'
      "
    >
      <option value="start">Start time</option>
      <option value="range">Range time</option>
    </select>
    <div class="project-timeline__select" v-else style="user-select: none">
      Range time
    </div>
    <div class="project-timeline__date" v-if="newSelect === 'start'">
      <VueDatePicker
        ref="datepicker"
        v-model="timeline"
        format="MM/dd/yyyy HH:mm"
        placeholder="DD/MM/YYYY"
        :required="newSelect === 'start'"
        :state="!redDateStyle"
      >
      </VueDatePicker>
    </div>
    <div class="project-timeline__range" v-if="newSelect === 'range'">
      <VueDatePicker
        ref="datepickerRange"
        v-model="timeline"
        format="MM/dd/yyyy HH:mm - MM/dd/yyyy HH:mm"
        placeholder="DD/MM/YYYY ~ DD/MM/YYYY"
        range
        :required="newSelect === 'range'"
        :state="!redDateStyle"
      >
      </VueDatePicker>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/style/mixin";
.project-timeline {
  padding: 10px 0;
  &__title {
    grid-column-start: 1;
    grid-column-end: 3;
    margin: 5px;
  }

  &__select {
    @include searchBorder(150px, 6px);
    padding: 5px 10px;
    margin: 5px;
    background-color: #fff;
    color: #000;
  }

  &__date {
    .mx-datepicker {
      width: 150px;
    }
    margin: 5px;
  }

  &__range {
    .mx-datepicker {
      width: 250px;
    }
  }
}
</style>

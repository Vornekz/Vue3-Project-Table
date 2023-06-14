<script setup lang="ts">
import { Options } from "@/store/projectDate";
import { useProjectManipulation } from "@/store/projectManipulation";
import { ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const props = defineProps<{
  date: Options[];
  keyId: string;
}>();
const selected = useProjectManipulation();
const selectedDate = ref<Options[]>([]);
const selectAll = ref(false);

onBeforeRouteLeave((_to, _from, next) => {
  selected.checkFalse();
  next();
});

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
    selectedDate.value = [...props.date];
  } else {
    selected.checkFalse();
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
      class="projects__project"
      v-for="(element, i) in date"
      :key="`${element.name} ${i + 1} ${keyId}`"
    >
      <div class="projects__project-checkbox">
        <input
          type="checkbox"
          :name="element.name"
          :id="`${element.name} checkbox #${i + 1} ${keyId}`"
          :value="element"
          v-model="selectedDate"
        />
      </div>
      <div class="projects__project-index">
        <p>№ {{ i + 1 }}</p>
      </div>
      <div class="projects__project-name">
        <p>{{ element.name }}</p>
      </div>
      <div class="projects__project-status">
        <p>{{ element.status }}</p>
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.projects {
  padding: 30px;

  &__project {
    display: flex;
    align-items: center;
    border: 3px solid rgb(163, 155, 155);
    border-radius: 10px;
    height: 10vh;
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
      flex-basis: 40%;
      margin: 15px;
      font-size: 25px;
    }

    &-status {
      flex-basis: 15%;
      display: flex;
      justify-content: center;
      font-size: 20px;
    }

    &-date {
      flex-basis: 30%;
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
  }
}
</style>

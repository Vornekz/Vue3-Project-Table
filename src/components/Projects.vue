<script setup lang="ts">
import { useProjectDate } from "@/store/projectDate";

const date = useProjectDate();
</script>

<template>
  <div class="projects">
    <div
      class="projects__project"
      v-for="(element, i) in date.projectOptions"
      :key="`${element.name} ${i + 1}`"
    >
      <div class="projects__project-checkbox">
        <input
          type="checkbox"
          :name="element.name"
          :id="`${element.name} checkbox #${i + 1}`"
        />
      </div>
      <div class="projects__project-index">
        <p>№ {{ i + 1 }}</p>
      </div>
      <div class="projects__project-name">
        <h4>Name: {{ element.name }}</h4>
      </div>
      <div class="projects__project-status">
        <p>Status: {{ element.status }}</p>
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
      flex-basis: 5%;
      display: flex;
      justify-content: center;
      margin: 15px;

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
      h4 {
        font-size: 25px;
      }
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

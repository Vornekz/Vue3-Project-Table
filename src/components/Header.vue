<script setup lang="ts">
import { useProjectData } from "@/store/projectData";
import { useProjectManipulation } from "@/store/projectManipulation";

const data = useProjectData();
const manipulation = useProjectManipulation();
</script>

<template>
  <div class="header" :class="{ black: manipulation.theme }">
    <h1 class="header__title">Projects</h1>
    <div class="header__count">
      {{ data.projectOptions.length + data.projectArchived.length }}
    </div>
    <button
      class="color-chenge"
      @click="manipulation.themeChange"
      :class="{ 'black-swg': manipulation.theme }"
    >
      <svg v-if="manipulation.theme">
        <use xlink:href="@/assets/svg/sprite.svg#sun"></use>
      </svg>
      <svg v-else>
        <use xlink:href="@/assets/svg/sprite.svg#moon"></use>
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/style/mixin.scss";

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 30px;
  background-color: #f7f9fc;
  text-align: center;

  &__title {
    margin-right: 10px;
  }

  &__count {
    font-size: 20px;
    @include countCircle();
  }

  .color-chenge {
    position: absolute;
    width: 30px;
    height: 30px;
    right: 10vw;
    border: 1px #181818 solid;
    border-radius: 50%;

    svg {
      width: 20px;
      height: 20px;
      margin-top: 5px;
      fill: #181818;
    }
  }
  .black-swg {
    background-color: #181818;
    border-color: yellow;
    svg {
      fill: yellow;
    }
  }
}

.black {
  background-color: #181818;
  border-bottom: 2px #9cb1db solid;
  color: #fff;
}
</style>
@/store/projectData

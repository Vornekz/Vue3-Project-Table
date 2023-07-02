<script setup lang="ts">
import { useSelectIndex } from "@/store/selectIndex";

const emit = defineEmits<{
  (e: "changeFilterValue"): void;
}>();

const selectIndex = useSelectIndex();
const group = selectIndex.group;
const selectElement = selectIndex.selectElement;

const select = (i: number) => {
  selectElement(i);
  emit("changeFilterValue");
};
</script>

<template>
  <div class="group">
    <router-link
      class="group__element"
      v-for="(element, i) in group"
      :key="`element-${i}`"
      :class="{ selected: element.selected }"
      @click="select(i)"
      :to="{ name: element.name }"
    >
      <p class="group__element-text">{{ element.name }}</p>
      <span class="group__element-count">{{ element.count }}</span>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/style/mixin.scss";
.group {
  display: grid;
  position: relative;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-column-gap: 20px;

  padding: 10px 30px;

  a:last-child {
    &:after {
      content: "";
      display: block;
      position: absolute;
      left: -10%;
      width: 2px;
      height: 100%;
      background-color: #5e5adb;
    }
  }

  &__element {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    min-width: 125px;
    margin: 10px;
    cursor: pointer;

    &:hover {
      color: #5e5adb;
    }

    &-text {
      margin-right: 10px;
    }

    &-count {
      @include countCircle();
    }
  }

  .selected {
    color: #5e5adb;

    &:before {
      content: "";
      position: absolute;
      bottom: -5px;
      width: 100%;
      height: 3px;
      background-color: #5e5adb;
    }
  }
}
</style>

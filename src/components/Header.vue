<script setup lang="ts">
import { useProjectData } from "@/store/projectData";

const data = useProjectData();
</script>

<template>
  <div class="header">
    <h1 class="header__title">Projects</h1>
    <div class="header__count">
      {{ data.projectOptions.length + data.projectArchived.length }}
    </div>
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
}
</style>
@/store/projectData

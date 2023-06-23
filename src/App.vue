<script setup lang="ts">
import { useProjectManipulation } from "./store/projectManipulation";

const manipulation = useProjectManipulation();
</script>

<template>
  <div id="app" :class="{ black: manipulation.theme }">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
}

.black {
  background-color: #181818;
  color: #fff;
}
</style>

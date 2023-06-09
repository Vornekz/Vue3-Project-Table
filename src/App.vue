<script setup lang="ts">
import Header from "@/components/Header.vue";
import MainNav from "@/components/MainNav.vue";
import Projects from "./components/Projects.vue";
</script>

<template>
  <div id="app">
    <Header />
    <MainNav />
    <Projects />
  </div>
</template>

<style lang="scss">
#app {
  color: black;
}
</style>

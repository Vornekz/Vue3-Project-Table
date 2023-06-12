<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectDate } from "@/store/projectDate";
import { ref, watch } from "vue";
const date = useProjectDate();
const newDate = ref<Options[]>(
  [...date.projectOptions].filter((item) => item.status === "Completed")
);
const keyId = ref("Comp");

watch(date.projectOptions, (newValue) => {
  newDate.value = [...newValue].filter((item) => item.status === "Completed");
});
</script>
<template>
  <div class="completed">
    <Projects :date="newDate" :key-id="keyId" />
  </div>
</template>

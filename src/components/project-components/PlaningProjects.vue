<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectDate } from "@/store/projectDate";
import { ref, watch } from "vue";
const date = useProjectDate();
const newDate = ref<Options[]>(
  [...date.projectOptions].filter((item) => item.status === "Planing")
);
const keyId = ref("Plan");

watch(date.projectOptions, (newValue) => {
  newDate.value = [...newValue].filter((item) => item.status === "Planing");
});
</script>
<template>
  <div class="planing">
    <Projects :date="newDate" :key-id="keyId" />
  </div>
</template>

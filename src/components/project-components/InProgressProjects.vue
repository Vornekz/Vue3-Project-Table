<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectDate } from "@/store/projectDate";
import { ref, watch } from "vue";
const date = useProjectDate();
const newDate = ref<Options[]>(
  [...date.projectOptions].filter((item) => item.status === "In progress")
);
const keyId = ref("Prog");

watch(date.projectOptions, (newValue) => {
  newDate.value = [...newValue].filter((item) => item.status === "In progress");
});
</script>
<template>
  <div class="in-progress">
    <Projects :date="newDate" :key-id="keyId" />
  </div>
</template>

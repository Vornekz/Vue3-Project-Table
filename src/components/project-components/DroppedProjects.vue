<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectDate } from "@/store/projectDate";
import { ref, watch } from "vue";
const date = useProjectDate();
const newDate = ref<Options[]>(
  [...date.projectOptions].filter((item) => item.status === "Dropped")
);
const keyId = ref("Drop");

watch(date.projectOptions, (newValue) => {
  newDate.value = [...newValue].filter((item) => item.status === "Dropped");
});
</script>
<template>
  <div class="dropped">
    <Projects :date="newDate" :key-id="keyId" />
  </div>
</template>

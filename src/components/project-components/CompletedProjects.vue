<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectData } from "@/store/projectData";
import { ref, watch } from "vue";
const data = useProjectData();
const newData = ref<Options[]>(
  [...data.projectOptions].filter((item) => item.status === "Completed")
);
const keyId = ref("Comp");

watch(data.projectOptions, (newValue) => {
  newData.value = [...newValue].filter((item) => item.status === "Completed");
});
</script>
<template>
  <div class="completed">
    <Projects :data="newData" :key-id="keyId" />
  </div>
</template>
@/store/projectData

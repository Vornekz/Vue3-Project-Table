<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectData } from "@/store/projectData";
import { ref, watch } from "vue";
const data = useProjectData();
const newData = ref<Options[]>(
  [...data.projectOptions].filter((item) => item.status === "Dropped")
);
const keyId = ref("Drop");

watch(data.projectOptions, (newValue) => {
  newData.value = [...newValue].filter((item) => item.status === "Dropped");
});
</script>
<template>
  <div class="dropped">
    <Projects :data="newData" :key-id="keyId" />
  </div>
</template>
@/store/projectData

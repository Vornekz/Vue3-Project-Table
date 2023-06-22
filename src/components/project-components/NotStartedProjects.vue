<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectData } from "@/store/projectData";
import { ref, watch } from "vue";
const data = useProjectData();
const newData = ref<Options[]>(
  [...data.projectOptions].filter((item) => item.status === "Not started")
);
const keyId = ref("Not");

watch(data.projectOptions, (newValue) => {
  newData.value = [...newValue].filter((item) => item.status === "Not started");
});
</script>
<template>
  <div class="not-started">
    <Projects :data="newData" :key-id="keyId" />
  </div>
</template>
@/store/projectData

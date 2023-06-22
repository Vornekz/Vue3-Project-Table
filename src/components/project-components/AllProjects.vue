<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectData } from "@/store/projectData";
import { ref, watch } from "vue";
const data = useProjectData();
const newData = ref<Options[]>([...data.projectOptions]);
const keyId = ref("All");

watch(data.projectOptions, (newValue) => {
  newData.value = [...newValue];
});
</script>
<template>
  <div class="all">
    <Projects :data="newData" :key-id="keyId" />
  </div>
</template>
@/store/projectData

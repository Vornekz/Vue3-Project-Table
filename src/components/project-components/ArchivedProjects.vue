<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectData } from "@/store/projectData";
import { ref, watch } from "vue";
const data = useProjectData();
const newData = ref<Options[]>([...data.projectArchived]);
const keyId = ref("Arch");

watch(data.projectArchived, (newValue) => {
  newData.value = [...newValue];
});
</script>
<template>
  <div class="archived">
    <Projects :data="newData" :key-id="keyId" />
  </div>
</template>
@/store/projectData

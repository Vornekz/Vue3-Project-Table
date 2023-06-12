<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectDate } from "@/store/projectDate";
import { ref, watch } from "vue";
const date = useProjectDate();
const newDate = ref<Options[]>([...date.projectOptions]);
const keyId = ref("All");

watch(date.projectOptions, (newValue) => {
  newDate.value = [...newValue];
});
</script>
<template>
  <div class="all">
    <Projects :date="newDate" :key-id="keyId" />
  </div>
</template>

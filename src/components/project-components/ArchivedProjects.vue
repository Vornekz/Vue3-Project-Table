<script setup lang="ts">
import Projects from "./Projects.vue";
import { Options, useProjectDate } from "@/store/projectDate";
import { ref, watch } from "vue";
const date = useProjectDate();
const newDate = ref<Options[]>([...date.projectArchived]);
const keyId = ref("Arch");

watch(date.projectArchived, (newValue) => {
  newDate.value = [...newValue];
});
</script>
<template>
  <div class="archived">
    <Projects :date="newDate" :key-id="keyId" />
  </div>
</template>

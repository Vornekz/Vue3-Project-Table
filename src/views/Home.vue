<script setup lang="ts">
import Header from "@/components/Header.vue";
import MainNav from "@/components/nav-components/MainNav.vue";
import { useProjectData } from "@/store/projectData";
import { useProjectManipulation } from "@/store/projectManipulation";
import { useSelectIndex } from "@/store/selectIndex";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const projectData = useProjectData();
const selectIndex = useSelectIndex();
const manipulation = useProjectManipulation();
const dataReady = ref(false);

onMounted(async () => {
  router.push("/");
  await projectData.projectLoad().then((resolve) => {
    if (resolve.data !== null && resolve.data !== undefined) {
      projectData.projectOptions = JSON.parse(resolve.data);
    }

    if (resolve.archive !== null && resolve.archive !== undefined) {
      projectData.projectArchived = JSON.parse(resolve.archive);
    }
  });

  await selectIndex.countLoad().then((resolve) => {
    if (resolve !== undefined) {
      const countArr = JSON.parse(resolve);
      const index = ref(0);
      for (let item of countArr) {
        selectIndex.group[index.value].count = parseInt(item);
        index.value++;
      }
    }
  });
  if (localStorage.theme !== undefined) {
    manipulation.theme = JSON.parse(localStorage.theme);
  }

  dataReady.value = true;
});
</script>

<template>
  <div class="home" v-if="dataReady">
    <Header />
    <MainNav />
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

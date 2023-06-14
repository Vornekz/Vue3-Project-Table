<script setup lang="ts">
import Header from "@/components/Header.vue";
import MainNav from "@/components/nav-components/MainNav.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  router.push("/");
});
</script>

<template>
  <div class="home">
    <Header />
    <MainNav />
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 3s;
}
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

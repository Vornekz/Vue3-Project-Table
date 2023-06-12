import Home from "@/views/Home.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      children: [
        {
          path: "",
          name: "All",
          component: () =>
            import("@/components/project-components/AllProjects.vue"),
        },
        {
          path: "not-started",
          name: "Not started",
          component: () =>
            import("@/components/project-components/NotStartedProjects.vue"),
        },
        {
          path: "planing",
          name: "Planing",
          component: () =>
            import("@/components/project-components/PlaningProjects.vue"),
        },
        {
          path: "in-progress",
          name: "In progress",
          component: () =>
            import("@/components/project-components/InProgressProjects.vue"),
        },
        {
          path: "completed",
          name: "Completed",
          component: () =>
            import("@/components/project-components/CompletedProjects.vue"),
        },
        {
          path: "dropped",
          name: "Dropped",
          component: () =>
            import("@/components/project-components/DroppedProjects.vue"),
        },
        {
          path: "archived",
          name: "Archived",
          component: () =>
            import("@/components/project-components/ArchivedProjects.vue"),
        },
      ],
    },
  ],
});

export default router;

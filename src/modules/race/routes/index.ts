import { type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: import.meta.env.BASE_URL,
    name: "Dashboard",
    component: () => import("@/modules/race/views/Dashboard.vue"),
  },
];

export default routes;

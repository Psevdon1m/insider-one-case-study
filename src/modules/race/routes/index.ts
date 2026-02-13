import { type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Dashboard",
    component: () => import("@/modules/race/views/Dashboard.vue"),
  },
];

export default routes;

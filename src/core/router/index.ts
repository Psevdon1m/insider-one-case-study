import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [];

// since the app will grow, I propose to have routes per each module. Next line is for finding those routes and merge them with our main routes array.
const domainRoutes = import.meta.glob("@/modules/*/routes/index.ts", {
  eager: true,
  import: "default",
});

console.log({ domainRoutes });

// this will merge all the routes from the modules into the main routes array
Object.values(domainRoutes).forEach((module: unknown) => {
  if (Array.isArray(module)) {
    routes.push(...(module as RouteRecordRaw[]));
  }
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

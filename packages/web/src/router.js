import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/preview",
    name: "Preview",
    component: () =>
      import(/* webpackChunkName: "about" */ "./views/Preview.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

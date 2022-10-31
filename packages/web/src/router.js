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

export { routes }

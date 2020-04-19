import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import About from "../views/About.vue";
import Base from "../views/Base.vue";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Base",
    component: Base,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

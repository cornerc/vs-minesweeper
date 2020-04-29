import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import About from "../views/About.vue";
import Base from "../views/Base.vue";
import Home from "../views/Home.vue";
import Single from "../views/Single.vue";
import ComingSoon from "../views/ComingSoon.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Base",
    component: Base,
    children: [
      {
        path: "/single",
        component: Single,
      },
      {
        path: "/time-attack",
        redirect: "/coming-soon",
      },
      {
        path: "/turn",
        redirect: "/single",
      },
      {
        path: "/real-time",
        redirect: "/coming-soon",
      },

      {
        path: "/coming-soon",
        component: ComingSoon,
      },
    ],
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

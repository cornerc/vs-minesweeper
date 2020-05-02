import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import Base from "../views/Base.vue";
import Single from "../views/Single.vue";
import ComingSoon from "../views/ComingSoon.vue";
import Top from "../views/Top.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    component: Base,
    children: [
      {
        path: "/",
        component: Top,
      },
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
        redirect: "/coming-soon",
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import Base from "@/components/connect/Base";
import Single from "@/components/organisms/Single.vue";
import ComingSoon from "@/components/organisms/ComingSoon.vue";
import Top from "@/components/organisms/Top.vue";

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

import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import Base from "@/components/connect/Base";
import Single from "@/components/connect/Single";
import Turn from "@/components/connect/Turn";
import ComingSoon from "@/components/organisms/ComingSoon.vue";
import Top from "@/components/organisms/Top.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    component: Base,
    children: [
      {
        name: "top",
        path: "/top",
        component: Top,
      },
      {
        name: "single",
        path: "/single",
        component: Single,
      },
      {
        name: "turn",
        path: "/turn",
        component: Turn,
      },
      {
        name: "turnPlay",
        path: "/turn/:uuid",
        component: Turn,
      },
      {
        name: "timeAttack",
        path: "/time-attack",
        redirect: "/coming-soon",
      },
      {
        name: "realTime",
        path: "/real-time",
        redirect: "/coming-soon",
      },
      {
        path: "/coming-soon",
        component: ComingSoon,
      },
      {
        path: "*",
        redirect: {name: "top"},
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

import {connect} from "vuex-connect";
import router from "@/router/index";
import Base from "@/components/templates/Base.vue";
import {SideMenuItems} from "@/components/type";

export default connect({
  actionsToEvents: {
    initClearField: dispatch => {
      dispatch("initClearField");
    },
    saveConfig: (dispatch, config) => {
      dispatch("setConfig", config);
    },
  },
  gettersToProps: {
    config: "config",
    time: "time",
    remainMine: "remainMine",
  },
  stateToProps: {
    sideMenuItems: (): SideMenuItems[] => {
      return [
        {
          icon: "mdi-home",
          title: "top",
          text: "TOP",
          to: {name: "top"},
        },
        {
          icon: "mdi-account",
          title: "single",
          text: "Single",
          to: {name: "single"},
        },
        {
          icon: "mdi-timer-outline",
          title: "time attack",
          text: "Time Attack",
          to: {name: "timeAttack"},
        },
        {
          icon: "mdi-account-convert",
          title: "alternation",
          text: "Turn",
          to: {name: "turn"},
        },
        {
          icon: "mdi-timer",
          title: "real time",
          text: "Real Time Attack",
          to: {name: "realTime"},
        },
      ];
    },
  },
  lifecycle: {
    created: (store: any) => {
      store.dispatch("setConfig", store.getters.config);
    },
  },
})("Base", Base);

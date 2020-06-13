import {connect} from "vuex-connect";
import Base from "@/components/templates/Base.vue";
import {SideMenuItems} from "@/components/type";

export default connect({
  actionsToEvents: {
    initField: dispatch => {
      dispatch("initField");
    },
    saveConfig: (dispatch, config) => {
      dispatch("setSingleConfig", config);
    },
    setConfigFromPath: (dispatch, path) => {
      dispatch("setConfigFromPath", path);
    },
  },
  gettersToProps: {
    config: "config",
    singleConfig: "singleConfig",
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
          icon: "mdi-account-convert",
          title: "alternation",
          text: "Turn",
          to: {name: "turn"},
        },
        {
          icon: "mdi-timer-outline",
          title: "time attack",
          text: "Time Attack",
          to: {name: "timeAttack"},
        },
        {
          icon: "mdi-timer",
          title: "real time",
          text: "Real Time Attack",
          to: {name: "realTime"},
        },
      ];
    },
    path: state => {
      return state.route.name || "";
    },
  },
})("Base", Base);

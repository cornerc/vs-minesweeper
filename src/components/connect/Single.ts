import {connect} from "vuex-connect";
import {Config} from "@/store/type.ts";
import Single from "@/components/organisms/Single.vue";

export default connect({
  actionsToEvents: {
    openCell: (dispatch, {row, col}) => {
      dispatch("openCell", {row, col});
    },
    firstClick: (dispatch, {row, col}) => {
      dispatch("initFieldFromClick", {row, col});
      dispatch("startTimer");
    },
    toggleFlag: (dispatch, {row, col}) => {
      dispatch("toggleFlag", {row, col});
    },
    gameClear: dispatch => {
      dispatch("stopTimer");
      dispatch("openCellAll");
      dispatch("registerHistory");
    },
    gameOver: dispatch => {
      dispatch("stopTimer");
      dispatch("openCellAll");
    },
    stopTimer: dispatch => {
      dispatch("stopTimer");
    },
  },
  stateToProps: {
    field: (store: any) => store.field,
    config: (store: any): Config => store.config,
  },
  gettersToProps: {
    isStart: "isStart",
    isGameClear: "isGameClear",
    historys: "historys",
    BBBVs: "BBBVs",
  },
  lifecycle: {
    created: (store: any) => {
      store.dispatch("initClearField");
    },
  },
})("Single", Single);

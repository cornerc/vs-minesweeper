import {connect} from "vuex-connect";
import router from "@/router";
import {Config} from "@/store/type.ts";
import Turn from "@/components/organisms/Turn.vue";

export default connect({
  actionsToEvents: {
    openCell: async (dispatch, {row, col}) => {
      await dispatch("updateScore", {row, col});
      await dispatch("openCell", {row, col});
      await dispatch("updateMatchingTurn");
    },
    firstClick: async (dispatch, {row, col}) => {
      await dispatch("initFieldFromClick", {row, col});
    },
    matchingOver: async (dispatch, winner) => {
      await dispatch("judgeWinner", winner);
      await dispatch("updateMatchingTurn");
    },
    startMatching: async (dispatch, userName) => {
      await dispatch("matchingTurn", userName);
    },
    restartMatching: async dispatch => {
      await dispatch("initTurnField");
      await dispatch("clearMatchingInfo");
      router.push({name: "turn"});
    },
    stopTimer: dispatch => {
      dispatch("stopTimer");
    },
  },
  stateToProps: {
    field: (store: any) => store.field,
    config: (store: any): Config => store.config,
    matchingInfo: (store: any): any => {
      const matchingInfo = store.turn.matchingInfo;
      let player1 = matchingInfo.player1;
      let player2 = matchingInfo.player2;
      if (matchingInfo.player1.id !== store.userId) {
        player1 = matchingInfo.player2;
        player2 = matchingInfo.player1;
      }
      return {
        lastUpdated: matchingInfo.lastUpdated,
        player1: player1,
        player2: player2,
      };
    },
    uuid: (store: any) => store.route.params.uuid,
    winner: (store: any) => store.turn.matchingInfo.winner,
  },
  gettersToProps: {
    isStart: "isStart",
    isGameClear: "isGameClear",
    remainNotOpen: "remainNotOpen",
    time: "time",
  },
  lifecycle: {
    mounted: async (store: any) => {
      if (store.state.route.params.uuid) {
        await store.dispatch("checkUuid", store.state.route.params.uuid);
      }
      await store.dispatch("initTurnField");
    },
    beforeDestroy: async (store: any) => {
      await store.dispatch("clearMatchingInfo");
    },
  },
})("Turn", Turn);

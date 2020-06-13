import firebase from "firebase";
import Cookies from "js-cookie";
import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import vuetify from "@/plugins/vuetify/vuetify";
import {generateUuid} from "@/utils";
import router from "@/router/index";
import {Config, CountType} from "./type";

Vue.use(Vuex);

const options = {
  storage: {
    getItem: (key: string) => Cookies.get(key),
    setItem: (key: string, value: string) =>
      Cookies.set(key, value, {expires: 7}),
    removeItem: (key: string) => Cookies.remove(key),
  },
  paths: ["single", "historys", "userId"],
};

export default new Vuex.Store({
  state: {
    field: new Array(),
    openMap: new Array(),
    config: {
      darkTheme: false,
      mine: 40,
      row: 20,
      col: 18,
    },
    historys: new Array(),
    time: 0,
    timerId: 0,
    userId: "",
    single: {
      config: {
        mine: 40,
        row: 20,
        col: 18,
      },
    },
    turn: {
      config: {
        mine: 16,
        row: 10,
        col: 10,
      },
      matchingInfo: {
        sessionId: "",
        lastUpdated: "",
        winner: "",
        player1: {
          id: "",
          name: "",
          score: 0,
        },
        player2: {
          id: "",
          name: "",
          score: 0,
        },
      },
    },
  },
  getters: {
    field: state => state.field,
    openMap: state => state.openMap,
    config: state => state.config,
    singleConfig: state => {
      return {
        darkTheme: state.config.darkTheme,
        mine: state.single.config.mine,
        row: state.single.config.row,
        col: state.single.config.col,
      };
    },
    mine: state => state.config.mine,
    row: state => state.config.row,
    col: state => state.config.col,
    time: state => state.time,
    userId: state => state.userId,
    historys: state => state.historys,
    remainMine: (state, getters) =>
      getters.mine - state.field.flat().filter(cell => cell.isFlag).length,
    remainNotOpen: state =>
      state.field.flat().filter(cell => !cell.isOpen).length,
    emptyCell: state =>
      state.field.flat().filter(cell => cell.aroundMines === 0).length,
    aroundMineCell: (state, getters) => {
      const field = state.field;
      let count = 0;
      for (let i = 0; i < getters.row; i++) {
        for (let j = 0; j < getters.col; j++) {
          if (!field[i][j].isLandMine && field[i][j].aroundMines) {
            let check = false;
            for (let k = i - 1; k <= i + 1; k++) {
              if (k < 0 || k >= getters.row) {
                continue;
              }
              for (let l = j - 1; l <= j + 1; l++) {
                if (l < 0 || l >= getters.col) {
                  continue;
                }
                if (field[k][l].aroundMines === 0) {
                  check = true;
                }
              }
            }
            if (!check) {
              count++;
            }
          }
        }
      }
      return count;
    },
    isGameClear: (_, getters) => getters.mine === getters.remainNotOpen,
    isStart: (_, getters) =>
      getters.row * getters.col !== getters.remainNotOpen,
    openMapLength: (_, getters) =>
      getters.openMap
        .map((x: any) => x.group)
        .filter((x: any, i: number, self: any) => {
          return self.indexOf(x) === i;
        }).length,
    BBBV: (_, getters) => getters.openMapLength + getters.aroundMineCell,
    BBBVs: (_, getters) =>
      getters.time === 0 ? 0 : getters.BBBV / getters.time,
  },
  mutations: {
    setField(state, field): void {
      state.field = field;
    },
    setOpenMap(state, map): void {
      state.openMap = map;
    },
    setCell(state, {row, col, cell}): void {
      state.field[row].splice(col, 1, cell);
    },
    setTime(state, time): void {
      state.time = time;
    },
    setTimerId(state, timerId): void {
      state.timerId = timerId;
    },
    setSingleConfig(state, config): void {
      Object.assign(state.single.config, config);
    },
    setConfig(state, config): void {
      Object.assign(state.config, config);
    },
    setHistorys(state, history): void {
      state.historys = history;
    },
    initUserId(state): void {
      state.userId = generateUuid();
    },
    setMatchingInfo(state, {uuid, info}): void {
      state.turn.matchingInfo = {
        sessionId: uuid,
        lastUpdated: info.lastUpdated,
        winner: info.winner,
        player1: info.player1,
        player2: info.player2,
      };
    },
    clearMatchingInfo(state): void {
      state.turn.matchingInfo = {
        sessionId: "",
        lastUpdated: "",
        winner: "",
        player1: {
          id: "",
          name: "",
          score: 0,
        },
        player2: {
          id: "",
          name: "",
          score: 0,
        },
      };
    },
  },
  actions: {
    initField(ctx): void {
      ctx.dispatch("stopTimer");
      ctx.dispatch("setTime", 0);
      const initCell = {
        isOpen: false,
        isFlag: false,
        isLandMine: false,
        aroundMines: 0,
      };
      let field = new Array(ctx.getters.row)
        .fill("")
        .map(() => new Array(ctx.getters.col).fill(initCell));
      ctx.commit("setField", field);
    },
    initFieldFromClick(ctx, {row, col}): void {
      // initialize
      const initCell = {
        isOpen: false,
        isFlag: false,
        isLandMine: false,
        aroundMines: 0,
      };
      let field = new Array(ctx.getters.row)
        .fill("")
        .map(() => new Array(ctx.getters.col).fill(initCell));
      let mineList = new Array(ctx.getters.row * ctx.getters.col).fill(false);
      // set mine
      for (let i = 0; i < mineList.length; i++) {
        if (i < ctx.getters.mine) {
          mineList[i] = true;
        }
        const r = Math.floor(Math.random() * (i + 1));
        const tmp = mineList[i];
        mineList[i] = mineList[r];
        mineList[r] = tmp;
      }
      const clickCell: number = row * ctx.getters.col + col;
      // if first click is mine
      if (mineList[clickCell] === true) {
        for (let i = 0; i < mineList.length; i++) {
          if (mineList[i] === false) {
            mineList[i] = true;
            mineList[clickCell] = false;
            break;
          }
        }
      }
      let idx = 0;
      for (let i = 0; i < ctx.getters.row; i++) {
        for (let j = 0; j < ctx.getters.col; j++) {
          field[i][j] = {
            isOpen: field[i][j].isOpen,
            isFlag: field[i][j].isFlag,
            isLandMine: mineList[idx++],
            aroundMines: field[i][j].aroundMines,
          };
          // set around mine's number
          if (field[i][j].isLandMine) {
            for (let k = i - 1; k <= i + 1; k++) {
              if (k < 0 || k >= ctx.getters.row) {
                continue;
              }
              for (let l = j - 1; l <= j + 1; l++) {
                if (l < 0 || l >= ctx.getters.col) {
                  continue;
                }
                field[k][l] = {
                  isOpen: field[k][l].isOpen,
                  isFlag: field[k][l].isFlag,
                  isLandMine: field[k][l].isLandMine,
                  aroundMines: field[k][l].aroundMines + 1,
                };
              }
            }
          }
        }
      }
      // create open map
      let openMap = [];
      idx = 0;
      for (let i = 0; i < ctx.getters.row; i++) {
        for (let j = 0; j < ctx.getters.col; j++) {
          if (field[i][j].aroundMines === 0) {
            openMap.push({group: idx++, row: i, col: j});
          }
        }
      }
      for (let i = 0; i < openMap.length; i++) {
        const target = Object.assign({}, openMap[i]);
        for (let j = -1; j <= 1; j++) {
          const isAdjacentRow = openMap.findIndex(
            val => val.row === target.row + 1 && val.col === target.col + j
          );
          if (isAdjacentRow >= 0) {
            const updateTarget = Object.assign({}, openMap[isAdjacentRow]);
            openMap.map(val => {
              val.group =
                val.group === updateTarget.group ? target.group : val.group;
              return val;
            });
          }
          const isAdjacentCol = openMap.findIndex(
            val => val.row === target.row + j && val.col === target.col + 1
          );
          if (isAdjacentCol >= 0) {
            const updateTarget = Object.assign({}, openMap[isAdjacentCol]);
            openMap.map(val => {
              val.group =
                val.group === updateTarget.group ? target.group : val.group;
              return val;
            });
          }
        }
      }
      ctx.commit("setField", field);
      ctx.commit("setOpenMap", openMap);
    },
    setField(ctx, field): void {
      ctx.commit("setField", field);
    },
    openCell(ctx, {row, col}): void {
      const targetCell = ctx.getters.field[row][col];
      if (targetCell.aroundMines === 0) {
        ctx.dispatch("openCellFromOpenMap", {row, col});
      } else {
        const cell = {
          isOpen: true,
          isFlag: targetCell.isFlag,
          isLandMine: targetCell.isLandMine,
          aroundMines: targetCell.aroundMines,
        };
        ctx.commit("setCell", {row, col, cell});
      }
    },
    openCellFromOpenMap(ctx, {row, col}): void {
      const openMap = ctx.getters.openMap;
      const cellIndex = openMap.findIndex(
        (val: any) => val.row === row && val.col === col
      );
      const openCells = openMap.filter(
        (val: any) => val.group === openMap[cellIndex].group
      );
      const field = ctx.getters.field.concat();
      for (let i = 0; i < openCells.length; i++) {
        const targetRow = openCells[i].row;
        const targetCol = openCells[i].col;
        for (let k = targetRow - 1; k <= targetRow + 1; k++) {
          if (k < 0 || k >= ctx.getters.row) {
            continue;
          }
          for (let l = targetCol - 1; l <= targetCol + 1; l++) {
            if (l < 0 || l >= ctx.getters.col) {
              continue;
            }
            if (field[k][l].isOpen || field[k][l].isFlag) {
              continue;
            }
            field[k][l] = {
              isOpen: true,
              isFlag: field[k][l].isFlag,
              isLandMine: field[k][l].isLandMine,
              aroundMines: field[k][l].aroundMines,
            };
          }
        }
      }
      ctx.commit("setField", field);
    },
    openCellAll(ctx): void {
      let field = ctx.getters.field.concat();
      for (let i = 0; i < ctx.getters.row; i++) {
        for (let j = 0; j < ctx.getters.col; j++) {
          field[i][j] = {
            isOpen: true,
            isFlag: false,
            isLandMine: field[i][j].isLandMine,
            aroundMines: field[i][j].aroundMines,
          };
        }
      }
      ctx.commit("setField", field);
    },
    toggleFlag(ctx, {row, col}): void {
      const originCell = ctx.getters.field[row][col];
      const cell = {
        isOpen: originCell.isOpen,
        isFlag: !originCell.isFlag,
        isLandMine: originCell.isLandMine,
        aroundMines: originCell.aroundMines,
      };
      ctx.commit("setCell", {row, col, cell});
    },
    countUp(ctx): void {
      ctx.commit("setTime", ctx.getters.time + 1);
    },
    countDown(ctx): void {
      const currentTime = ctx.getters.time;
      ctx.commit("setTime", currentTime === 0 ? 0 : currentTime - 1);
    },
    startTimer(ctx, countType: CountType): void {
      const timerId = window.setInterval(() => {
        ctx.dispatch(countType);
      }, 1000);
      ctx.commit("setTimerId", timerId);
    },
    stopTimer(ctx): void {
      const timerId = ctx.state.timerId;
      window.clearInterval(timerId);
      ctx.commit("setTimerId", 0);
    },
    setTime(ctx, time: number): void {
      ctx.commit("setTime", time);
    },
    setSingleConfig(ctx, config: Config): void {
      vuetify.framework.theme.dark = config.darkTheme;
      ctx.commit("setSingleConfig", {
        mine: config.mine,
        row: config.row,
        col: config.col,
      });
      ctx.commit("setConfig", config);
      ctx.dispatch("initField");
    },
    setConfigFromPath(ctx, path: string): void {
      let config;
      switch (path) {
        case "single":
          config = {
            darkTheme: ctx.state.config.darkTheme,
            mine: ctx.state.single.config.mine,
            row: ctx.state.single.config.row,
            col: ctx.state.single.config.col,
          };
          break;
        case "turn":
        case "turnPlay":
          config = {
            darkTheme: ctx.state.config.darkTheme,
            mine: ctx.state.turn.config.mine,
            row: ctx.state.turn.config.row,
            col: ctx.state.turn.config.col,
          };
          break;
        default:
          config = {
            darkTheme: ctx.state.config.darkTheme,
            mine: ctx.state.single.config.mine,
            row: ctx.state.single.config.row,
            col: ctx.state.single.config.col,
          };
          break;
      }
      ctx.commit("setConfig", config);
    },
    registerHistory(ctx): void {
      let historys = ctx.getters.historys.concat();
      const history = {
        time: ctx.getters.time,
        date: new Date().toLocaleString("ja", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        BBBV: ctx.getters.BBBV,
        BBBVs: ctx.getters.BBBVs,
      };
      historys.push(history);
      ctx.commit(
        "setHistorys",
        historys.sort((a: any, b: any) => b.BBBVs - a.BBBVs).slice(0, 5)
      );
    },
    // TODO: split store(Turn)
    async matchingTurn(ctx, name): Promise<void> {
      const database = firebase.database();
      let userId = ctx.state.userId;
      if (userId === "") {
        ctx.commit("initUserId");
        userId = ctx.state.userId;
      }
      let uuid = generateUuid();
      // 待機ユーザーがいるか検索する
      let res = await database
        .ref("session/waiting")
        .once("value")
        .then(res => res.val());
      if (res === null) {
        // 待機室/対戦室の作成
        res = await database.ref("session/waiting").set({uuid});
        res = await database.ref("session/" + uuid).set({
          player1: {
            id: userId,
            name: name,
            score: 0,
          },
        });
        // 待機室の消滅を監視
        database.ref("session/waiting").once("child_removed", () => {
          ctx.dispatch("startMatchingTurn", uuid);
        });
      } else {
        uuid = res.uuid;
        res = await database.ref("session/" + uuid).update({
          lastUpdated: userId,
          player2: {
            id: userId,
            name: name,
            score: 0,
          },
        });
        res = await database.ref("session/waiting").remove();
        ctx.dispatch("startMatchingTurn", uuid);
      }
    },
    async startMatchingTurn(ctx, uuid): Promise<void> {
      const database = firebase.database();
      let info = await database
        .ref("session/" + uuid)
        .once("value")
        .then(res => res.val());
      ctx.commit("setMatchingInfo", {uuid, info});
      ctx.dispatch("startTimer", "countDown");

      database.ref("session/" + uuid + "/field").on("value", snapshot => {
        const field = snapshot.val();
        if (!field) {
          return;
        }
        let updateField = ctx.state.field.concat();
        for (let [key] of Object.entries(field)) {
          const row = Number(key.slice(1).split("-")[0]);
          const col = Number(key.slice(1).split("-")[1]);
          updateField[row][col] = {
            aroundMines: field[key].aroundMines,
            isLandMine: field[key].isLandMine,
            isOpen: field[key].isOpen,
            isFlag: updateField[row][col].isFlag,
          };
        }
        ctx.commit("setField", updateField);
        ctx.commit("setTime", 10);
      });
      database.ref("session/" + uuid).on("value", async _ => {
        let info = await database
          .ref("session/" + uuid)
          .once("value")
          .then(res => res.val());
        ctx.commit("setMatchingInfo", {uuid, info});
        if (info.winner && info.winner !== "") {
          ctx.dispatch("openCellAll");
        }
      });
      database.ref("session/" + uuid + "/openMap").on("value", snapshot => {
        ctx.commit("setOpenMap", snapshot.val());
      });
      router.push({name: "turnPlay", params: {uuid}}); // 対戦開始
    },
    initTurnField(ctx): void {
      const initCell = {
        isOpen: false,
        isFlag: false,
        isLandMine: false,
        aroundMines: 0,
      };
      let field = new Array(ctx.state.turn.config.row)
        .fill("")
        .map(() => new Array(ctx.state.turn.config.col).fill(initCell));
      ctx.commit("setField", field);
    },
    async checkUuid(ctx, uuid): Promise<void> {
      const database = firebase.database();
      let res = await database
        .ref("session/" + uuid)
        .once("value")
        .then(res => res.val());
      if (!res) {
        await ctx.dispatch("clearMatchingInfo");
        router.push({name: "turn"});
      }
    },
    async clearMatchingInfo(ctx): Promise<void> {
      firebase
        .database()
        .ref()
        .off();
      ctx.commit("clearMatchingInfo");
    },
    async updateScore(ctx, {row, col}): Promise<void> {
      const database = firebase.database();
      const matchingInfo = ctx.state.turn.matchingInfo;
      const uuid = matchingInfo.sessionId;
      const addScore = ctx.getters.field[row][col].aroundMines;
      if (ctx.state.turn.matchingInfo.player1.id === ctx.state.userId) {
        ctx.commit("setMatchingInfo", {
          uuid,
          info: {
            lastUpdated: matchingInfo.lastUpdated,
            player1: {
              id: matchingInfo.player1.id,
              name: matchingInfo.player1.name,
              score: matchingInfo.player1.score + addScore,
            },
            player2: matchingInfo.player2,
          },
        });
      } else {
        ctx.commit("setMatchingInfo", {
          uuid,
          info: {
            lastUpdated: matchingInfo.lastUpdated,
            player1: matchingInfo.player1,
            player2: {
              id: matchingInfo.player2.id,
              name: matchingInfo.player2.name,
              score: matchingInfo.player2.score + addScore,
            },
          },
        });
      }
      await database.ref("session/" + uuid).update({
        player1: ctx.state.turn.matchingInfo.player1,
        player2: ctx.state.turn.matchingInfo.player2,
      });
    },
    async updateMatchingTurn(ctx): Promise<void> {
      const database = firebase.database();
      const uuid = ctx.state.turn.matchingInfo.sessionId;
      const field = ctx.state.field;
      let updateField: {[key: string]: Object} = {};
      for (let i = 0; i < ctx.getters.row; i++) {
        for (let j = 0; j < ctx.getters.col; j++) {
          let id = "c" + i + "-" + j;
          let cell = field[i][j];
          updateField[id] = {
            isLandMine: cell.isLandMine,
            aroundMines: cell.aroundMines,
            isOpen: cell.isOpen,
          };
        }
      }
      let res = await database.ref("session/" + uuid).update({
        lastUpdated: ctx.state.userId,
        player1: ctx.state.turn.matchingInfo.player1,
        player2: ctx.state.turn.matchingInfo.player2,
        field: updateField,
      });

      // openMapがまだない場合は登録する
      res = await database
        .ref("session/" + uuid + "/openMap")
        .once("value")
        .then(res => res.val());
      if (!res) {
        res = await database.ref("session/" + uuid).update({
          openMap: ctx.getters.openMap,
        });
      }
    },
    async judgeWinner(ctx, winner): Promise<void> {
      const database = firebase.database();
      const matchingInfo = ctx.state.turn.matchingInfo;
      const uuid = matchingInfo.sessionId;
      switch (winner) {
        case "score":
          if (matchingInfo.player1.score > matchingInfo.player2.score) {
            await database
              .ref("session/" + uuid)
              .update({winner: matchingInfo.player1.id});
          } else {
            await database
              .ref("session/" + uuid)
              .update({winner: matchingInfo.player2.id});
          }
          break;
        case "time":
          await database
            .ref("session/" + uuid)
            .update({winner: matchingInfo.lastUpdated});
          break;
        default:
          await database.ref("session/" + uuid).update({winner});
          break;
      }
    },
  },
  modules: {},
  plugins: [createPersistedState(options)],
});

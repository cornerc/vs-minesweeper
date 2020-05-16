import Vue from "vue";
import Vuex from "vuex";
import {Config} from "./type";
import createPersistedState from "vuex-persistedstate";
import Cookies from "js-cookie";
import vuetify from "@/plugins/vuetify/vuetify";

Vue.use(Vuex);

const options = {
  storage: {
    getItem: (key: string) => Cookies.get(key),
    setItem: (key: string, value: string) =>
      Cookies.set(key, value, {expires: 7}),
    removeItem: (key: string) => Cookies.remove(key),
  },
  paths: ["config", "historys"],
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
  },
  getters: {
    field: state => state.field,
    openMap: state => state.openMap,
    config: state => state.config,
    mine: state => state.config.mine,
    row: state => state.config.row,
    col: state => state.config.col,
    time: state => state.time,
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
    setConfig(state, config): void {
      Object.assign(state.config, config);
    },
    setHistorys(state, history): void {
      state.historys = history;
    },
  },
  actions: {
    initClearField(ctx): void {
      ctx.dispatch("stopTimer");
      ctx.dispatch("initTime");
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
      ctx.dispatch("stopTimer");
      ctx.dispatch("initTime");
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
      ctx.dispatch("openCell", {row, col});
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
    tickTime(ctx): void {
      ctx.commit("setTime", ctx.getters.time + 1);
    },
    startTimer(ctx): void {
      const timerId = window.setInterval(() => {
        ctx.dispatch("tickTime");
      }, 1000);
      ctx.commit("setTimerId", timerId);
    },
    stopTimer(ctx): void {
      const timerId = ctx.state.timerId;
      window.clearInterval(timerId);
      ctx.commit("setTimerId", 0);
    },
    initTime(ctx): void {
      ctx.commit("setTime", 0);
    },
    setConfig(ctx, config: Config): void {
      vuetify.framework.theme.dark = config.darkTheme;
      ctx.commit("setConfig", config);
      ctx.dispatch("initClearField");
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
  },
  modules: {},
  plugins: [createPersistedState(options)],
});

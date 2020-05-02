import Vue from "vue";
import Vuex from "vuex";
import {Config} from "./type";
import createPersistedState from "vuex-persistedstate";
import Cookies from "js-cookie";

Vue.use(Vuex);

const options = {
  reducer: (state: any) => ({
    config: state.config,
  }),
  storage: {
    getItem: (key: string) => Cookies.get(key),
    setItem: (key: string, value: string) =>
      Cookies.set(key, value, {expires: 1}),
    removeItem: (key: string) => Cookies.remove(key),
  },
};

export default new Vuex.Store({
  state: {
    field: new Array(),
    config: {
      mine: 40,
      row: 20,
      col: 18,
    },
    time: 0,
    timerId: 0,
    disabled: false,
  },
  getters: {
    field: state => state.field,
    config: state => state.config,
    mine: state => state.config.mine,
    row: state => state.config.row,
    col: state => state.config.col,
    time: state => state.time,
    remainMine: (state, getters) =>
      getters.mine - state.field.flat().filter(cell => cell.isFlag).length,
    remainNotOpen: state =>
      state.field.flat().filter(cell => !cell.isOpen).length,
    isGameClear: (state, getters) => getters.mine === getters.remainNotOpen,
    isStart: (state, getters) =>
      getters.row * getters.col !==
      state.field.flat().filter(cell => !cell.isOpen).length,
  },
  mutations: {
    setField(state, field): void {
      state.field = field;
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
  },
  actions: {
    initField(ctx): void {
      // initialize
      ctx.dispatch("stopTimer");
      ctx.dispatch("initTime");
      let initCell = {
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
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = mineList[i];
        mineList[i] = mineList[r];
        mineList[r] = tmp;
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
      ctx.commit("setField", field);
    },
    setField(ctx, field): void {
      ctx.commit("setField", field);
    },
    openCell(ctx, {row, col}) {
      const originCell = ctx.state.field[row][col];
      const cell = {
        isOpen: true,
        isFlag: originCell.isFlag,
        isLandMine: originCell.isLandMine,
        aroundMines: originCell.aroundMines,
      };
      ctx.commit("setCell", {row, col, cell});
    },
    openCellAll(ctx) {
      let field = ctx.state.field;
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
    chainOpenCell(ctx, {row, col}) {
      const originalCell = ctx.getters.field[row][col];
      if (originalCell.aroundMines !== 0) {
        return;
      }
      for (let i = row - 1; i <= row + 1; i++) {
        if (i < 0 || i >= ctx.getters.row) {
          continue;
        }
        for (let j = col - 1; j <= col + 1; j++) {
          if (j < 0 || j >= ctx.getters.col || (i === row && j === col)) {
            continue;
          }
          let cell = ctx.getters.field[i][j];
          if (cell.isLandMine || cell.isFlag || cell.isOpen) {
            continue;
          }
          ctx.dispatch("openCell", {row: i, col: j});
          ctx.dispatch("chainOpenCell", {row: i, col: j});
        }
      }
      return;
    },
    toggleFlag(ctx, {row, col}) {
      const originCell = ctx.state.field[row][col];
      const cell = {
        isOpen: originCell.isOpen,
        isFlag: !originCell.isFlag,
        isLandMine: originCell.isLandMine,
        aroundMines: originCell.aroundMines,
      };
      ctx.commit("setCell", {row, col, cell});
    },
    tickTime(ctx) {
      ctx.commit("setTime", ctx.getters.time + 1);
    },
    startTimer(ctx) {
      const timerId = window.setInterval(() => {
        ctx.dispatch("tickTime");
      }, 1000);
      ctx.commit("setTimerId", timerId);
    },
    stopTimer(ctx) {
      const timerId = ctx.state.timerId;
      window.clearInterval(timerId);
      ctx.commit("setTimerId", 0);
    },
    initTime(ctx) {
      ctx.commit("setTime", 0);
    },
    setConfig(ctx, config: Config) {
      ctx.commit("setConfig", config);
      ctx.dispatch("initField");
    },
  },
  modules: {},
  plugins: [createPersistedState(options)],
});

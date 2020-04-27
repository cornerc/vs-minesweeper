import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    field: new Array(),
    mine: 40,
    row: 20,
    col: 18,
    disabled: false,
    time: 0,
  },
  getters: {
    field: state => {
      return state.field;
    },
    time: state => {
      return state.time;
    },
    remainMine: state => {
      return state.mine - state.field.flat().filter(cell => cell.isFlag).length;
    },
    remainNotOpen: state => {
      return state.field.flat().filter(cell => !cell.isOpen).length;
    },
    isGameClear: (state, getters) => {
      return state.mine === getters.remainNotOpen;
    },
    isStart: state => {
      return (
        state.row * state.col !==
        state.field.flat().filter(cell => !cell.isOpen).length
      );
    },
  },
  mutations: {
    setField(state, field): void {
      state.field = field;
    },
    updateCell(state, {row, col, cell}): void {
      state.field[row].splice(col, 1, cell);
    },
    setTime(state, time) {
      state.time = time;
    },
  },
  actions: {
    initField(ctx): void {
      // initialize
      let initCell = {
        isOpen: false,
        isFlag: false,
        isLandMine: false,
        aroundMines: 0,
      };
      let field = new Array(ctx.state.row)
        .fill("")
        .map(() => new Array(ctx.state.col).fill(initCell));
      let mineList = new Array(ctx.state.row * ctx.state.col).fill(false);
      // set mine
      for (let i = 0; i < mineList.length; i++) {
        if (i < ctx.state.mine) {
          mineList[i] = true;
        }
        let r = Math.floor(Math.random() * (i + 1));
        let tmp = mineList[i];
        mineList[i] = mineList[r];
        mineList[r] = tmp;
      }
      let idx = 0;
      for (let i = 0; i < ctx.state.row; i++) {
        for (let j = 0; j < ctx.state.col; j++) {
          field[i][j] = {
            isOpen: field[i][j].isOpen,
            isFlag: field[i][j].isFlag,
            isLandMine: mineList[idx++],
            aroundMines: field[i][j].aroundMines,
          };
          // set around mine's number
          if (field[i][j].isLandMine) {
            for (let k = i - 1; k <= i + 1; k++) {
              if (k < 0 || k >= ctx.state.row) {
                continue;
              }
              for (let l = j - 1; l <= j + 1; l++) {
                if (l < 0 || l >= ctx.state.col) {
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
      ctx.commit("updateCell", {row, col, cell});
    },
    openCellAll(ctx) {
      let field = ctx.state.field;
      for (let i = 0; i < ctx.state.row; i++) {
        for (let j = 0; j < ctx.state.col; j++) {
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
        if (i < 0 || i >= ctx.state.row) {
          continue;
        }
        for (let j = col - 1; j <= col + 1; j++) {
          if (j < 0 || j >= ctx.state.col || (i === row && j === col)) {
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
      ctx.commit("updateCell", {row, col, cell});
    },
    tickTime(ctx) {
      ctx.commit("setTime", ctx.getters.time + 1);
    },
    initTime(ctx) {
      ctx.commit("setTime", 0);
    },
  },
  modules: {},
});

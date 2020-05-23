<template>
  <div class="single">
    <v-snackbar v-model="toggles.snackbar" :timeout="5000" multi-line top>
      {{ snackbarText }}
      <v-btn color="red" text @click="toggleItem('snackbar')">
        閉じる
      </v-btn>
    </v-snackbar>
    <div v-for="(items, i) in field" :key="i">
      <span v-for="(item, j) in items" :key="i + '-' + j">
        <transition
          duration="300"
          @leave="cellAnimation ? breakCellAnimation(i, j) : ''"
        >
          <v-btn
            v-if="!item.isOpen"
            :id="fieldIdWrap(i, j)"
            :class="setFieldClassWrap(item, i + j)"
            absolute
            icon
            small
            tile
            @click.left.stop="open(i, j)"
            @click.right.stop.prevent="isStart ? toggleFlag(i, j) : {}"
          >
            <v-icon>{{ setFieldIconWrap(item) }}</v-icon>
          </v-btn>
        </transition>
        <v-btn
          :id="fieldId(i, j)"
          :class="setFieldClass(item, i + j)"
          icon
          small
          tile
          @click.right.stop.prevent
        >
          <v-icon>{{ setFieldIcon(item) }}</v-icon>
        </v-btn>
      </span>
    </div>
    <div class="score">
      <v-fab-transition origin="top right">
        <v-alert v-if="toggles.scoreAlert" dismissible>
          <template #close>
            <v-btn icon class="mx-1" @click.stop="toggleItem('scoreAlert')">
              <v-icon>mdi-crown</v-icon>
            </v-btn>
          </template>
          <span class="title">BEST 5 (3BV/s)</span>
          <br />
          <span v-for="(item, idx) in historys" :key="idx">
            <div class="my-1 body-1">
              {{ idx + 1 }}位
              {{ display3BVs(item.BBBVs) }}
              ({{ displayDate(item.date) }})
            </div>
            <hr />
          </span>
        </v-alert>
        <v-btn v-else icon @click.stop="toggleItem('scoreAlert')">
          <v-icon>mdi-crown</v-icon>
        </v-btn>
      </v-fab-transition>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Vue, Prop, Watch} from "vue-property-decorator";
import gsap from "gsap";
import {getSign} from "@/utils/index";
import {Config, SingleToggles} from "@/components/type";

@Component
export default class Single extends Vue {
  @Prop({type: Array, default: () => {}})
  private field: any[];
  @Prop({type: Object, default: () => {}})
  private config: Config;
  @Prop({type: Boolean, default: false})
  private isStart: boolean;
  @Prop({type: Boolean, default: false})
  private isGameClear: boolean;
  @Prop({type: Array, default: () => {}})
  private historys: any[];
  @Prop({type: Number, default: 0})
  private BBBVs: number;

  private snackbarText = "";
  private cellAnimation = false;
  private toggles = {
    scoreAlert: false,
    snackbar: false,
  };

  @Watch("isStart")
  setInit() {
    if (!this.isStart) {
      this.stopTimer();
    }
  }
  @Watch("isGameClear")
  judgeGameClear() {
    if (this.isGameClear) {
      this.cellAnimation = false;
      this.gameClear();
      this.showSnackbar("clear");
    }
  }

  toggleItem(item: SingleToggles) {
    this.toggles[item] = !this.toggles[item];
  }
  setFieldIcon(item: any) {
    if (item.isOpen) {
      if (item.isLandMine) {
        return "mdi-bomb";
      }
      if (item.aroundMines) {
        return "mdi-numeric-" + item.aroundMines.toString();
      }
    }
    return;
  }
  setFieldIconWrap(item: any) {
    if (item.isFlag) {
      return "mdi-flag-triangle";
    }
  }
  setFieldClass(item: any, totalIdx: number) {
    let open = item.isOpen ? "--open" : "";
    let even = totalIdx % 2 ? "--odd" : "";
    let theme = this.config.darkTheme ? "--dark" : "";

    return "cell" + open + even + theme;
  }
  setFieldClassWrap(item: any, totalIdx: number) {
    let even = totalIdx % 2 ? "--odd" : "";
    let theme = this.config.darkTheme ? "--dark" : "";
    return "cell" + even + theme + " wrapCell";
  }
  open(row: number, col: number) {
    let cell = this.field[row][col];
    if (cell.isFlag || cell.isOpen) {
      return;
    }
    // 初クリック判定
    if (!this.isStart) {
      this.firstClick(row, col);
      cell = this.field[row][col]; // フィールド情報を再取得
    }
    // アニメーションの設定
    this.cellAnimation =
      cell.isLandMine || cell.aroundMines === 0 ? false : true;
    // ゲームオーバー判定
    if (cell.isLandMine) {
      this.gameOver();
      this.showSnackbar("gameOver");
      return;
    }
    // セルのオープン
    this.openCell(row, col);
  }
  showSnackbar(type: string) {
    if (type === "clear") {
      this.snackbarText =
        "おめでとうございます。クリアしました！" +
        "スコア：" +
        this.display3BVs(this.BBBVs);
    } else {
      this.snackbarText = "あなたは戦死しました。";
    }
    this.toggleItem("snackbar");
  }
  displayDate(date: string) {
    return date;
  }
  display3BVs(BBBVs: number) {
    return Math.round(BBBVs * 1000) / 1000;
  }
  fieldId(i: number, j: number) {
    return "c" + i + "-" + j;
  }
  fieldIdWrap(i: number, j: number) {
    return "r" + i + "-" + j;
  }
  breakCellAnimation(i: number, j: number) {
    const id = "#" + this.fieldIdWrap(i, j);
    const signX = getSign();
    const midX = 50;
    const midY = gsap.utils.random(-400, -350);
    const endX = 75;
    const endY = 0;
    gsap.set(id, {
      backgroundColor: this.$vuetify.theme.themes.light.accent as string,
    });
    gsap.to(id, {
      rotation: "random(-720, 720)",
      scale: 0,
      duration: 0.4, // dirty hack
      motionPath: {
        path: [
          {x: 0, y: 0},
          {x: signX * midX, y: midY},
          {x: signX * endX, y: endY},
        ],
      },
    });
  }
  @Emit("openCell")
  openCell(row: number, col: number) {
    return {row, col};
  }
  @Emit("toggleFlag")
  toggleFlag(row: number, col: number) {
    return {row, col};
  }
  @Emit("gameClear")
  gameClear() {
    return;
  }
  @Emit("gameOver")
  gameOver() {
    return;
  }
  @Emit("stopTimer")
  stopTimer() {
    return;
  }
  @Emit("firstClick")
  firstClick(row: number, col: number) {
    return {row, col};
  }
}
</script>

<style scoped lang="scss">
.score {
  position: absolute;
  top: 12px;
  right: 10px;
}

.cell {
  &--open {
    &--odd {
      &--dark {
        background-color: var(--v-accent-darken2);
      }
      background-color: var(--v-accent-lighten2);
    }
    &--dark {
      background-color: var(--v-accent-darken3);
    }
    background-color: var(--v-accent-lighten3);
  }
  &--odd {
    &--dark {
      background-color: var(--v-primary-darken1);
    }
    background-color: var(--v-primary-lighten1);
  }
  &--dark {
    background-color: var(--v-primary-darken2);
  }
  background-color: var(--v-primary-lighten2);
}

.wrapCell {
  z-index: 1;
}

.open-cell-leave-active {
  background-color: var(--v-accent-base);
}
</style>

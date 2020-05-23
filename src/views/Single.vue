<template>
  <div class="single">
    <v-snackbar v-model="snackbar.isOpen" :timeout="5000" multi-line top>
      {{ snackbar.text }}
      <v-btn color="red" text @click="snackbar.isOpen = !snackbar.isOpen">
        閉じる
      </v-btn>
    </v-snackbar>
    <div v-for="(items, i) in $store.getters.field" :key="i">
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
            @click.left.stop="openCell(i, j)"
            @click.right.stop.prevent="toggleFlag(i, j)"
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
        <v-alert v-if="scoreAlert" dismissible>
          <template #close>
            <v-btn icon class="mx-1" @click.stop="toggleScoreAlert">
              <v-icon>mdi-crown</v-icon>
            </v-btn>
          </template>
          <span class="title">BEST 5 (3BV/s)</span>
          <br />
          <span v-for="(item, idx) in $store.getters.historys" :key="idx">
            <div class="my-1 body-1">
              {{ idx + 1 }}位
              {{ display3BVs(item.BBBVs) }}
              ({{ displayDate(item.date) }})
            </div>
            <hr />
          </span>
        </v-alert>
        <v-btn v-else icon @click.stop="toggleScoreAlert">
          <v-icon>mdi-crown</v-icon>
        </v-btn>
      </v-fab-transition>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from "vue-property-decorator";
import {getSign} from "@/utils/index";
import gsap from "gsap";

@Component
export default class Single extends Vue {
  private snackbar = {
    isOpen: false,
    text: "",
  };
  private timerId = 0;
  private scoreAlert = false;
  private cellAnimation = false;

  @Watch("$store.getters.isStart")
  setInit() {
    if (!this.$store.getters.isStart) {
      this.$store.dispatch("stopTimer");
    }
  }

  setFieldIcon(item: any) {
    if (item.isOpen) {
      if (item.isLandMine) {
        return "mdi-bomb";
      }
      if (item.aroundMines) {
        return "mdi-numeric-" + item.aroundMines.toString();
      }
      return;
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
    let theme = this.$store.getters.config.darkTheme ? "--dark" : "";

    return "cell" + open + even + theme;
  }
  setFieldClassWrap(item: any, totalIdx: number) {
    let even = totalIdx % 2 ? "--odd" : "";
    let theme = this.$store.getters.config.darkTheme ? "--dark" : "";
    return "cell" + even + theme + " wrapCell";
  }
  openCell(row: number, col: number) {
    let cell = this.$store.getters.field[row][col];
    if (cell.isFlag || cell.isOpen) {
      return;
    }
    // 初クリック判定
    if (!this.$store.getters.isStart) {
      this.$store.dispatch("initFieldFromClick", {row, col});
      this.$store.dispatch("startTimer");
      cell = this.$store.getters.field[row][col]; // フィールド情報を再取得
    }
    // アニメーションの設定
    this.cellAnimation =
      cell.isLandMine || cell.aroundMines === 0 ? false : true;
    // ゲームオーバー判定
    if (cell.isLandMine) {
      this.$store.dispatch("stopTimer");
      this.$store.dispatch("openCellAll");
      this.showSnackbar("gameOver");
      return;
    }
    // セルのオープン
    this.$store.dispatch("openCell", {row, col});
    // クリア判定
    if (this.$store.getters.isGameClear) {
      this.cellAnimation = false;
      this.$store.dispatch("stopTimer");
      this.$store.dispatch("openCellAll");
      this.$store.dispatch("registerHistory");
      this.showSnackbar("clear");
    }
  }
  toggleFlag(row: number, col: number) {
    const cell = this.$store.getters.field[row][col];
    // すでに開かれている時は旗を立てない
    if (cell.isOpen) {
      return;
    }
    this.$store.dispatch("toggleFlag", {row, col});
  }
  showSnackbar(type: string) {
    if (type === "clear") {
      this.snackbar.text =
        "おめでとうございます。クリアしました！" +
        "スコア：" +
        this.display3BVs(this.$store.getters.BBBVs);
    } else {
      this.snackbar.text = "あなたは戦死しました。";
    }

    this.snackbar.isOpen = true;
  }
  toggleScoreAlert() {
    this.scoreAlert = !this.scoreAlert;
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
  created() {
    this.$store.dispatch("initClearField");
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

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
        <transition :name="setTransitionName()">
          <v-btn
            v-if="!item.isOpen"
            :id="'r' + i + '-' + j"
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
          :id="'c' + i + '-' + j"
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

@Component
export default class Single extends Vue {
  private snackbar = {
    isOpen: false,
    text: "",
  };
  private timerId = 0;
  private scoreAlert = false;

  // クリア判定
  @Watch("$store.getters.isGameClear")
  showClearDisplay() {
    if (this.$store.getters.isGameClear) {
      this.$store.dispatch("stopTimer");
      this.$store.dispatch("openCellAll");
      this.$store.dispatch("registerHistory");
      this.showSnackbar("clear");
    }
  }

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
  setTransitionName() {
    return Math.random() < 0.5 ? "open-cell-r" : "open-cell-l";
  }
  openCell(row: number, col: number) {
    const cell = this.$store.getters.field[row][col];
    if (cell.isFlag || cell.isOpen) {
      return;
    }
    // 初クリック判定
    if (!this.$store.getters.isStart) {
      this.$store.dispatch("initFieldFromClick", {row, col});
      this.$store.dispatch("startTimer");
      return;
    }
    // ゲームオーバー判定
    if (cell.isLandMine) {
      this.$store.dispatch("stopTimer");
      this.$store.dispatch("openCellAll");
      this.showSnackbar("gameOver");
      return;
    }
    this.$store.dispatch("openCell", {row, col});
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

.open-cell-r-leave-active {
  background-color: var(--v-accent-base);
  animation: break-cell-r 0.5s;
}

.open-cell-l-leave-active {
  background-color: var(--v-accent-base);
  animation: break-cell-l 0.5s;
}

@function getPoint($t, $x1, $x2, $sign) {
  $x: $t * $t * $x2 + 2 * $t * (1 - $t) * $x1;
  @return $sign * $x + unquote("%");
}

@mixin set-transform($ctrlX, $ctrlY, $end, $signX) {
  @for $i from 0 through 100 {
    #{$i}% {
      transform: translateX(getPoint($i * 0.01, $ctrlX, $end, $signX))
        translateY(getPoint($i * 0.01, $ctrlY, $end, -1))
        rotate(($i * 7.2) + unquote("deg"))
        scale(1 - ($i * 0.01));
    }
  }
}

@keyframes break-cell-r {
  $base: 150;
  @include set-transform($base * 0.2, $base * 0.8, $base, 1);
}

@keyframes break-cell-l {
  $base: 150;
  @include set-transform($base * 0.2, $base * 0.8, $base, -1);
}
</style>

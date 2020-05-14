<template>
  <div class="single">
    <v-snackbar v-model="snackbar.isOpen" :timeout="5000" multi-line top>
      {{ snackbar.text }}
      <v-btn color="red" text @click="snackbar.isOpen = !snackbar.isOpen">
        閉じる
      </v-btn>
    </v-snackbar>
    <div v-for="(items, itemsIdx) in $store.getters.field" :key="itemsIdx">
      <span v-for="(item, itemIdx) in items" :key="itemsIdx + '_' + itemIdx">
        <v-btn
          icon
          tile
          outlined
          small
          @click.left.stop="openCell(itemsIdx, itemIdx)"
          @click.right.stop.prevent="toggleFlag(itemsIdx, itemIdx)"
        >
          <v-icon>{{ setFieldIcon(item) }}</v-icon>
        </v-btn>
      </span>
    </div>
    <div class="score">
      <v-alert v-if="scoreAlert" dismissible>
        <template #close>
          <v-btn icon class="mx-1" @click.stop="toggleScoreAlert">
            <v-icon>mdi-crown</v-icon>
          </v-btn>
        </template>
        <span class="title">マイスコア</span>
        <br />
        <span v-for="(item, idx) in $store.getters.scoreRanking" :key="idx">
          <div class="my-1 body-1">
            {{ idx + 1 }}位｜3BV/s：
            {{ display3BVs(item.BBBVs) }}
            ({{ displayDate(item.date) }})
          </div>
          <hr />
        </span>
      </v-alert>
      <v-btn v-else icon @click.stop="toggleScoreAlert">
        <v-icon>mdi-crown</v-icon>
      </v-btn>
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
      return "mdi-crop-free";
    }
    if (item.isFlag) {
      return "mdi-flag-triangle";
    }
    return;
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
    return date.slice(5, 14);
  }
  display3BVs(BBBVs: number) {
    return Math.round(BBBVs * 1000) / 1000;
  }
  created() {
    this.$store.dispatch("initClearField");
  }
}
</script>

<style scoped>
.score {
  position: absolute;
  top: 12px;
  right: 16px;
}
</style>

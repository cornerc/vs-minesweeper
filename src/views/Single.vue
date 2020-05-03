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

  // クリア判定
  @Watch("$store.getters.isGameClear")
  showClearDisplay() {
    if (this.$store.getters.isGameClear) {
      this.$store.dispatch("stopTimer");
      this.$store.dispatch("openCellAll");
      this.showSnackbar("おめでとうございます。クリアしました。");
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
    // ゲームオーバー判定
    if (cell.isLandMine) {
      this.$store.dispatch("stopTimer");
      this.$store.dispatch("openCellAll");
      this.showSnackbar("あなたは戦死しました。");
      return;
    }
    if (!this.$store.getters.isStart) {
      // TODO:初期クリックでは、空白を選択するようにする。
      this.$store.dispatch("startTimer");
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
  showSnackbar(text: string) {
    this.snackbar.text = text;
    this.snackbar.isOpen = true;
  }
  created() {
    this.$store.dispatch("initField");
  }
}
</script>

<style scoped></style>

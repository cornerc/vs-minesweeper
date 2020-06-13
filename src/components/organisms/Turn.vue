<template>
  <div class="single">
    <v-overlay :value="toggles.waitingDialog" />
    <waiting-dialog
      :value="toggles.waitingDialog"
      @startMatching="startMatching"
    />
    <v-sheet class="px-3 py-2 mb-5" color="background">
      <v-chip label large :color="chipColor(matchingInfo.player1.id)">
        <v-avatar left>
          <v-icon>{{ yourIcon }}</v-icon>
        </v-avatar>
        {{ matchingInfo.player1.name }}[あなた]：
        {{ matchingInfo.player1.score }}
      </v-chip>
      <span class="mx-3">
        VS
      </span>
      <v-chip label large :color="chipColor(matchingInfo.player2.id)">
        <v-avatar left>
          <v-icon>{{ opponentIcon }}</v-icon>
        </v-avatar>
        {{ matchingInfo.player2.name }}[相手]：{{ matchingInfo.player2.score }}
      </v-chip>
      <v-btn
        v-show="winner !== undefined"
        icon
        class="mx-2"
        @click="restartMatching"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-sheet>
    <div v-for="(items, i) in field" :key="i">
      <span v-for="(item, j) in items" :key="i + '-' + j">
        <v-btn
          :class="setFieldClass(item, i + j)"
          icon
          small
          tile
          @click.left.stop="open(i, j)"
          @click.right.stop.prevent
        >
          <v-icon>{{ setFieldIcon(item) }}</v-icon>
        </v-btn>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Vue, Prop, Watch} from "vue-property-decorator";
import gsap from "gsap";
import {getSign} from "@/utils/index";
import WaitingDialog from "@/components/molecules/WaitingDialog.vue";
import {Config, TurnToggles} from "@/components/type";

@Component({
  components: {
    WaitingDialog,
  },
})
export default class Turn extends Vue {
  @Prop({type: Array, default: () => {}})
  private field: any[];
  @Prop({type: Object, default: () => {}})
  private config: Config;
  @Prop({type: Object, default: () => {}})
  private matchingInfo: any;
  @Prop({type: String, default: ""})
  private uuid: string;
  @Prop({type: String, default: undefined})
  private winner: string;
  @Prop({type: Boolean, default: false})
  private isStart: boolean;
  @Prop({type: Boolean, default: false})
  private isGameClear: boolean;
  @Prop({type: Number, default: 100})
  private remainNotOpen: number;
  @Prop({type: Number, default: 0})
  private time: number;

  private toggles = {
    waitingDialog: false,
  };
  private yourIcon = "mdi-account-circle";
  private opponentIcon = "mdi-account-circle";
  private isMatchingOver = false;

  get isYourTurn() {
    return this.matchingInfo.lastUpdated !== this.matchingInfo.player1.id;
  }

  @Watch("isGameClear")
  judgeGameOver() {
    if (this.winner !== undefined || this.isMatchingOver) {
      return;
    }
    if (this.isGameClear) {
      this.isMatchingOver = true;
      this.matchingOver("score");
      return;
    }
  }
  @Watch("remainNotOpen")
  judgeGameOver2() {
    if (this.winner !== undefined || this.isMatchingOver) {
      return;
    }
    if (this.remainNotOpen === 0) {
      this.isMatchingOver = true;
      this.matchingOver("score");
    }
  }
  @Watch("time")
  judgeGameOver3() {
    if (this.winner !== undefined || this.isMatchingOver) {
      return;
    }
    if (this.time === 0) {
      this.isMatchingOver = true;
      this.matchingOver("time");
    }
  }
  @Watch("uuid", {immediate: true})
  checkUuid() {
    if (this.uuid === "") {
      this.toggles.waitingDialog = true;
    } else {
      this.toggles.waitingDialog = false;
    }
  }
  @Watch("winner")
  checkWinner() {
    if (this.winner === undefined) {
      this.yourIcon = "mdi-account-circle";
      this.opponentIcon = "mdi-account-circle";
      return;
    }
    if (this.winner === this.matchingInfo.player1.id) {
      this.yourIcon = "mdi-crown";
    }
    if (this.winner === this.matchingInfo.player2.id) {
      this.opponentIcon = "mdi-crown";
    }
    this.stopTimer();
  }

  toggleItem(item: TurnToggles) {
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
  chipColor(id: string) {
    return id !== this.matchingInfo.lastUpdated ? "secondary" : "";
  }
  open(row: number, col: number) {
    let cell = this.field[row][col];
    if (cell.isOpen || !this.isYourTurn) {
      return;
    }
    // 初クリック判定
    if (!this.isStart) {
      this.firstClick(row, col);
      cell = this.field[row][col]; // フィールド情報を再取得
    }
    // ゲームオーバー判定
    if (cell.isLandMine) {
      this.isMatchingOver = true;
      this.matchingOver(this.matchingInfo.player2.id);
      return;
    }
    // セルのオープン
    this.openCell(row, col);
  }

  @Emit("openCell")
  openCell(row: number, col: number) {
    return {row, col};
  }
  @Emit("matchingOver")
  matchingOver(winner: string) {
    return winner;
  }
  @Emit("firstClick")
  firstClick(row: number, col: number) {
    return {row, col};
  }
  @Emit("startMatching")
  startMatching(userName: string) {
    return userName;
  }
  @Emit("restartMatching")
  restartMatching() {
    this.isMatchingOver = false;
    return;
  }
  @Emit("stopTimer")
  stopTimer() {
    return;
  }
}
</script>

<style scoped lang="scss">
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
</style>

<template>
  <v-dialog
    :value="dialog"
    max-width="70%"
    @click:outside.stop="toggleDialog"
    @keydown.esc.stop="toggleDialog"
  >
    <v-card>
      <v-card-title class="headline">
        操作方法
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-chip label>
              マウス操作
              <v-icon right>mdi-mouse</v-icon>
            </v-chip>
            <v-col cols="12" sm="12">
              左クリック・・・選択したセルを開くことができます
            </v-col>
            <v-col cols="12" sm="12">
              右クリック・・・選択したセルに旗を立てることができます
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-title class="headline">
        スコアについて
      </v-card-title>
      <v-card-text>
        <v-container>
          スコア算出には3BV(Bechtel's Board Benchmark Value)
          という、クリアに必要な最小クリック数を表す指標を使用しています。
          <div class="ma-2">
            <var>3BV/s</var> =
            <var>クリアに必要な最小クリック数／クリアタイム(秒)</var>
          </div>
          盤面の大きさが異なってもスコアの比較ができる指標になっています。
          (ただし盤面が大きいほど高いスコアになりやすい傾向があります)<br />
          スコアは、最後にプレイしてから約7日間保存されます。
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn text block large outlined @click.stop="toggleDialog">
          閉じる
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from "vue-property-decorator";

@Component
export default class InfoDialog extends Vue {
  @Prop({type: Boolean, default: false})
  dialog: boolean;

  @Emit("toggleDialog")
  toggleDialog() {
    return;
  }
}
</script>

<style scoped></style>

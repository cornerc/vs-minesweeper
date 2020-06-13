<template>
  <v-dialog
    :value="value"
    :transition="transition"
    max-width="50%"
    @click:outside.stop="toggle"
    @keydown.esc.stop="toggle"
  >
    <v-card>
      <v-card-title class="headline">
        設定
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form v-model="valid">
            <v-row>
              <v-col cols="12" sm="12">
                <div>テーマ</div>
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="innerConfig.darkTheme"
                  label="Dark"
                  dense
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12">
                <div>フィールド</div>
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field
                  v-model.number="innerConfig.row"
                  :rules="rowRules"
                  label="たて"
                  type="number"
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2" align-self="center">
                <v-icon>mdi-close-thick</v-icon>
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field
                  v-model.number="innerConfig.col"
                  :rules="colRules"
                  validate-on-blur
                  label="よこ"
                  type="number"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="innerConfig.mine"
                  :rules="mineRules"
                  label="マイン"
                  :hint="calcHint"
                  persistent-hint
                  dense
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6"></v-col>
            </v-row>
            <v-row>
              <v-col>
                <span class="error--text">
                  設定を保存するとプレイ中のフィールドは初期化されます
                </span>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click.stop="toggle">
          キャンセル
        </v-btn>
        <v-btn text :disabled="!valid" @click.stop="saveConfig">
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from "vue-property-decorator";
import {Config} from "@/components/type";

@Component
export default class ConfigDialog extends Vue {
  @Prop({type: Boolean, default: false})
  private value: boolean;
  @Prop({type: Object, default: {}})
  private config: Config;
  @Prop({type: [String, Boolean], default: "dialog-transition"})
  private transition: string | boolean;
  @Prop({type: Function, default: () => {}})
  private toggle: () => {};

  private innerConfig: Config = Object.assign({}, this.config);
  private valid = true;
  private rowRules = [
    (v: number) => Number.isInteger(v) || "整数を入力してください",
    (v: number) => v >= 10 || "10以上の整数を入力してください",
    (v: number) => v <= 50 || "50以下の整数を入力してください",
  ];
  private colRules = [
    (v: number) => Number.isInteger(v) || "整数を入力してください",
    (v: number) => v >= 10 || "10以上の整数を入力してください",
    (v: number) => v <= 50 || "50以下の整数を入力してください",
  ];
  private mineRules = [
    (v: number) => Number.isInteger(v) || "整数を入力してください",
    (v: number) => v >= 1 || "1以上の整数を入力してください",
    (v: number) =>
      v < this.cellAmount || "総セル数より小さい整数を入力してください",
  ];

  get calcHint() {
    return (
      "推奨は総セル数の" +
      this.adviseMineMin +
      "~" +
      this.adviseMineMax +
      "個です"
    );
  }
  get cellAmount() {
    return this.innerConfig.row * this.innerConfig.col;
  }
  get adviseMineMin() {
    return Math.round(this.cellAmount * (12 / 100));
  }
  get adviseMineMax() {
    return Math.round(this.cellAmount * (20 / 100));
  }

  @Emit("saveConfig")
  saveConfig() {
    this.toggle();
    return this.innerConfig;
  }
}
</script>

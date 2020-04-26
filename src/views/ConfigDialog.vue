<template>
  <v-dialog
    :value="dialog"
    max-width="500px"
    @click:outside.stop="toggleDialog"
    @keydown.esc.stop="toggleDialog"
  >
    <v-card>
      <v-card-title class="headline">
        設定
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12">
              <div>テーマ</div>
            </v-col>
            <v-col cols="12" sm="6">
              <v-checkbox
                v-model="theme"
                label="Light"
                value="Light"
                dense
              ></v-checkbox>
            </v-col>
            <v-col cols="12" sm="6">
              <v-checkbox
                v-model="theme"
                label="Dark"
                value="Dark"
                dense
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="12">
              <div>フィールド</div>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field label="たて" type="number" dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="2" align-self="center">
              <v-icon>mdi-close-thick</v-icon>
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field label="よこ" type="number" dense></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="マイン"
                hint="推奨は総セル数の12~20%です"
                persistent-hint
                dense
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6"> </v-col>
          </v-row>

          <v-row>
            <v-col>
              <span>設定を保存するとプレイ中のフィールドは初期化されます</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click.stop="toggleDialog">
          キャンセル
        </v-btn>
        <v-btn text @click.stop="saveConfig">
          保存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from "vue-property-decorator";

@Component
export default class ConfigDialog extends Vue {
  @Prop({type: Boolean, default: false})
  dialog: boolean;

  theme = "Light";

  saveConfig() {
    // 保存アクション
    this.toggleDialog();
  }

  @Emit("toggleDialog")
  toggleDialog() {
    return;
  }
}
</script>

<style scoped></style>

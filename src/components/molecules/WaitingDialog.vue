<template>
  <v-dialog
    v-model="value"
    max-width="50%"
    persistent
    no-click-animation
    hide-overlay
    @update:return-value="initForm"
  >
    <v-card>
      <v-card-title class="headline">
        待機画面
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="userName"
            :disabled="disabledUserName"
            :rules="userNameRules"
            label="ユーザー名"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          block
          large
          :loading="loading"
          :disabled="!valid"
          @click.stop="startMatching"
        >
          対戦相手を探す
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from "vue-property-decorator";

@Component
export default class WaitingDialog extends Vue {
  @Prop({type: Boolean, default: false})
  private value: boolean;

  private loading = false;
  private disabledUserName = false;
  private userName = "";
  private valid = true;
  private userNameRules = [
    (v: string) => v.length > 0 || "ユーザー名を入力してください",
  ];

  initForm(e: Event) {
    this.disabledUserName = false;
    this.loading = false;
  }

  @Emit("startMatching")
  startMatching() {
    this.disabledUserName = true;
    this.loading = true;
    return this.userName;
  }
}
</script>

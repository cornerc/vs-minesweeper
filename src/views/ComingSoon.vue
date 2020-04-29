<template>
  <div class="coming-soon">
    <v-overlay :value="true" class="overlay">
      <div justify="center">
        <div class="display-2">COMING SOON</div>
        <div class="display-1">{{ displayComment }}</div>
      </div>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class ComingSoon extends Vue {
  private comment = [
    "次期バージョンの公開まで待ってね！",
    "実装中だから別のモードで遊んでね！",
    "寝る間も惜しんで実装中だよ！",
    "工事中です！迂回して別のモードで遊んでね！",
    "お金をくれたらすぐ作るよ！",
  ];
  private displayComment = "";

  mounted() {
    const index = Math.floor(Math.random() * this.comment.length);
    console.log(index);
    this.displayComment = this.comment[index];
  }
}
</script>

<style scoped>
.overlay {
  padding-left: 66px; /* 56(sidebar) + 10 */
  padding-right: 10px;
}
</style>

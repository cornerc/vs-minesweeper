<template>
  <div class="top">
    <p class="headline font-weight-bold text-center my-6">
      VSマインスイーパーとは
    </p>
    <p class="body-1 font-italic text-center">
      ウェブサイトを通じてマインスイーパーを楽しむことができます。
      一人で研鑽に励むもよし、二人で対戦することもできます。
    </p>
    <p class="title font-weight-bold text-center my-6">個人プレイ</p>
    <p class="body-1 font-italic text-center">
      従来のマインスイーパーが体験できます。
    </p>
    <p class="title font-weight-bold text-center my-6">
      タイムアタック制（近日公開）
    </p>
    <p class="body-1 font-italic text-center">
      クリアタイムを他者と競うことができます。
    </p>
    <p class="title font-weight-bold text-center my-6">ターン制（近日公開）</p>
    <p class="body-1 font-italic text-center">
      交互にクリックして先に地雷を踏んだ方が負けです。
    </p>
    <p class="title font-weight-bold text-center my-6">
      リアルタイム制（近日公開）
    </p>
    <p class="body-1 font-italic text-center">
      より多くのセルを開けた方が勝ちです。
    </p>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class Single extends Vue {}
</script>

<style scoped></style>

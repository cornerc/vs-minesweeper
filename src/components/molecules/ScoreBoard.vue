<template>
  <div class="score">
    <v-fab-transition origin="top right">
      <v-alert v-if="scoreBoard" dismissible>
        <template #close>
          <v-btn icon class="mx-1" @click.stop="toggle">
            <v-icon>mdi-crown</v-icon>
          </v-btn>
        </template>
        <span class="title">BEST 5 (3BV/s)</span>
        <br />
        <span v-for="(item, idx) in historys" :key="idx">
          <div class="my-1 body-1">
            {{ idx + 1 }}位
            {{ display3BVs(item.BBBVs) }}
            ({{ item.date }})
          </div>
          <hr />
        </span>
      </v-alert>
      <v-btn v-else icon @click.stop="toggle">
        <v-icon>mdi-crown</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from "vue-property-decorator";
import {display3BVs} from "@/utils/index";

@Component
export default class ScoreBoard extends Vue {
  @Prop({type: Boolean, default: false})
  private scoreBoard: boolean;
  @Prop({type: Array, default: () => {}})
  private historys: any[];

  get display3BVs() {
    return display3BVs;
  }

  @Emit("toggle")
  toggle() {
    return;
  }
}
</script>

<style scoped lang="scss">
.score {
  position: absolute;
  top: 12px;
  right: 10px;
}
</style>

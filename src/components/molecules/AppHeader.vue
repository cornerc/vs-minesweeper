<template>
  <v-toolbar dense flat :tile="false">
    <v-toolbar-title title="vs-minesweeper">
      VSマインスイーパー
    </v-toolbar-title>
    <v-spacer />
    <template v-for="item in headerCenterItems">
      <span :key="item.title">
        <v-icon>{{ item.icon }}</v-icon>
        <v-chip class="ma-2" :title="item.title" label @click.stop="item.click">
          {{ item.content() }}
        </v-chip>
      </span>
      <v-spacer :key="item.title + '-spacer'" />
    </template>
    <template v-for="item in headerRightItems">
      <v-btn
        :key="item.title"
        :title="item.title"
        icon
        @click.stop="item.click"
      >
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>
  </v-toolbar>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {HeaderCenterItems, HeaderRightItems} from "@/components/type";

@Component
export default class AppHeader extends Vue {
  @Prop({type: Array, default: () => []})
  private headerCenterItems: HeaderCenterItems[];
  @Prop({type: Array, default: () => []})
  private headerRightItems: HeaderRightItems[];
}
</script>

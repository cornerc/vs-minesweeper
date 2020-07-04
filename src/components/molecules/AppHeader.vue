<template>
  <v-toolbar dense flat color="primary">
    <v-toolbar-title title="vs-minesweeper">
      VSマインスイーパー
    </v-toolbar-title>
    <v-spacer />
    <template v-for="item in headerCenterItems">
      <span :key="item.title">
        <v-icon>{{ item.icon }}</v-icon>
        <v-chip
          class="ma-2"
          :title="item.title"
          label
          :disabled="disabled"
          @click.stop="clickChip(item.title)"
        >
          {{ item.content }}
        </v-chip>
      </span>
      <v-spacer :key="item.title + '-spacer'" />
    </template>
    <template v-for="item in headerRightItems">
      <v-btn
        :key="item.title"
        :title="item.title"
        :disabled="disabled && item.title !== 'information'"
        icon
        @click.stop="clickIcon(item.title)"
      >
        <v-icon>{{ item.icon }}</v-icon>
      </v-btn>
    </template>
  </v-toolbar>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from "vue-property-decorator";
import {HeaderCenterItems, HeaderRightItems} from "@/components/type";

@Component
export default class AppHeader extends Vue {
  @Prop({type: Array, default: () => []})
  private headerCenterItems: HeaderCenterItems[];
  @Prop({type: Array, default: () => []})
  private headerRightItems: HeaderRightItems[];
  @Prop({type: Boolean, default: false})
  private disabled: boolean;

  @Emit("clickCenterContent")
  clickChip(value: string) {
    return value;
  }
  @Emit("clickRightContent")
  clickIcon(value: string) {
    return value;
  }
}
</script>

<template>
  <v-navigation-drawer
    class="navigation-drawer"
    :mini-variant="!value"
    app
    permanent
  >
    <v-list>
      <v-list-item @click.stop="toggle">
        <v-icon v-if="value" title="close-sidebar">
          mdi-chevron-triple-left
        </v-icon>
        <v-icon v-else title="open-sidebar">
          mdi-chevron-triple-right
        </v-icon>
      </v-list-item>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="item in sideMenuItems"
          :key="item.title"
          :to="item.to"
        >
          <v-list-item-action>
            <v-icon :title="item.title">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content :class="item.class">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {SideMenuItems} from "@/components/type";

@Component
export default class SideMenu extends Vue {
  @Prop({type: Boolean, default: false})
  private value: boolean;
  @Prop({
    type: Array,
    default: () => [
      {
        icon: "mdi-home",
        title: "top",
        text: "TOP",
        click: () => {},
      },
    ],
  })
  private sideMenuItems: SideMenuItems[];
  @Prop({type: Function, default: () => {}})
  private toggle: () => {};
}
</script>

<style scoped>
.navigation-drawer {
  margin-top: 48px;
}
</style>

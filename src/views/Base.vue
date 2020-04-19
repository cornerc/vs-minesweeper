<template>
  <div class="base">
    <v-card color="green lighten-4" flat>
      <v-toolbar dense flat :tile="false">
        <v-toolbar-title>VSマインスイーパー</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon>mdi-table</v-icon>
        <v-chip class="ma-2" label>Label</v-chip>
        <v-spacer></v-spacer>
        <v-icon>mdi-av-timer</v-icon>
        <v-chip class="ma-2" label>Label</v-chip>
        <v-spacer></v-spacer>
        <v-icon>mdi-emoticon-cool-outline</v-icon>
        <v-chip class="ma-2" label>Label</v-chip>
        <v-spacer></v-spacer>
        <template v-for="item in headerRightItems">
          <v-btn icon :key="item.icon" @click.stop="item.action">
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-navigation-drawer
        class="navigation-drawer"
        v-model="drawer"
        :mini-variant="mini"
        app
        permanent
      >
        <v-list>
          <v-list-item link @click.stop="toggleDrawer">
            <v-list-item-action>
              <v-icon v-show="drawer">mdi-chevron-triple-right</v-icon>
              <v-icon v-show="!drawer">mdi-chevron-triple-left</v-icon>
            </v-list-item-action>
          </v-list-item>
          <template v-for="item in sideMenuItems">
            <v-list-item link @click.stop="item.action" :key="item.icon">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content :class="item.class">
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Base extends Vue {
  headerRightItems = [
    {
      icon: "mdi-information",
      class: "",
      action: new Function()
    },
    {
      icon: "mdi-refresh",
      class: "",
      action: new Function()
    },
    {
      icon: "mdi-cog",
      class: "",
      action: new Function()
    }
  ];
  sideMenuItems = [
    {
      icon: "mdi-home",
      text: "TOP",
      class: "sidebar-content",
      action: new Function()
    },
    {
      icon: "mdi-account",
      text: "Single",
      class: "sidebar-content",
      action: new Function()
    },
    {
      icon: "mdi-timer-outline",
      text: "Time Attack",
      class: "sidebar-content",
      action: new Function()
    },
    {
      icon: "mdi-account-convert",
      text: "Turn",
      class: "sidebar-content",
      action: new Function()
    },
    {
      icon: "mdi-timer",
      text: "Real Time Attack",
      class: "sidebar-content",
      action: new Function()
    }
  ];
  drawer = false;
  group = null;
  mini = true;

  toggleDrawer() {
    this.drawer = !this.drawer;
    this.mini = !this.mini;
  }
}
</script>

<style scoped>
.navigation-drawer {
  margin-top: 48px;
}

.sidebar-content {
  margin-left: 10px;
}
</style>

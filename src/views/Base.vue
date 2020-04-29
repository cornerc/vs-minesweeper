<template>
  <div class="base">
    <v-card tile flat class="common">
      <v-toolbar dense flat :tile="false">
        <v-toolbar-title title="vs-minesweeper">
          VSマインスイーパー
        </v-toolbar-title>
        <v-spacer />
        <v-icon>mdi-table</v-icon>
        <v-chip
          class="ma-2"
          title="table"
          label
          @click.stop="toggleConfigDialog"
        >
          {{ $store.getters.row }}&nbsp;×&nbsp;{{ $store.getters.col }}
        </v-chip>
        <v-spacer />
        <v-icon>mdi-av-timer</v-icon>
        <v-chip class="ma-2" title="time" label>
          {{ displayTime($store.getters.time) }}
        </v-chip>
        <v-spacer />
        <v-icon>mdi-emoticon-cool-outline</v-icon>
        <v-chip
          class="ma-2"
          title="mine"
          label
          @click.stop="toggleConfigDialog"
        >
          {{ $store.getters.remainMine }} / {{ $store.getters.mine }}
        </v-chip>
        <v-spacer />
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
      <v-navigation-drawer
        v-model="drawer"
        class="navigation-drawer"
        :mini-variant="mini"
        app
        permanent
      >
        <v-list>
          <v-list-item @click.stop="toggleDrawer">
            <v-list-item-action>
              <v-icon v-show="drawer" title="open-sidebar">
                mdi-chevron-triple-right
              </v-icon>
              <v-icon v-show="!drawer" title="close-sidebar">
                mdi-chevron-triple-left
              </v-icon>
            </v-list-item-action>
          </v-list-item>
          <template v-for="item in sideMenuItems">
            <v-list-item :key="item.title" link @click.stop="item.click">
              <v-list-item-action>
                <v-icon :title="item.title">{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content :class="item.class">
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>
    </v-card>
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
    <configDialog
      :dialog="configDialog"
      :config="$store.getters.config"
      @toggleDialog="toggleConfigDialog"
    />
    <infoDialog :dialog="infoDialog" @toggleDialog="toggleInfoDialog" />
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from "vue-property-decorator";
import router from "@/router/index";
import ConfigDialog from "@/views/ConfigDialog.vue";
import InfoDialog from "@/views/InfoDialog.vue";

@Component({
  components: {
    ConfigDialog,
    InfoDialog,
  },
})
export default class Base extends Vue {
  headerRightItems = [
    {
      icon: "mdi-information",
      title: "information",
      class: "",
      click: this.toggleInfoDialog,
    },
    {
      icon: "mdi-refresh",
      title: "reload",
      class: "",
      click: this.refreshField,
    },
    {
      icon: "mdi-cog",
      title: "setting",
      class: "",
      click: this.toggleConfigDialog,
    },
  ];
  sideMenuItems = [
    {
      icon: "mdi-home",
      title: "top",
      text: "TOP",
      class: "sidebar-content",
      click: () => router.push("/", () => {}),
    },
    {
      icon: "mdi-account",
      title: "single",
      text: "Single",
      class: "sidebar-content",
      click: () => router.push("single", () => {}),
    },
    {
      icon: "mdi-timer-outline",
      title: "time attack",
      text: "Time Attack",
      class: "sidebar-content",
      click: () => router.push("time-attack", () => {}),
    },
    {
      icon: "mdi-account-convert",
      title: "alternation",
      text: "Turn",
      class: "sidebar-content",
      click: () => router.push("turn", () => {}),
    },
    {
      icon: "mdi-timer",
      title: "real time",
      text: "Real Time Attack",
      class: "sidebar-content",
      click: () => router.push("real-time", () => {}),
    },
  ];
  private timerId = 0;
  private drawer = false;
  private mini = true;
  private configDialog = false;
  private infoDialog = false;

  toggleDrawer() {
    this.drawer = !this.drawer;
    this.mini = !this.mini;
  }
  toggleConfigDialog() {
    this.configDialog = !this.configDialog;
  }
  toggleInfoDialog() {
    this.infoDialog = !this.infoDialog;
  }
  displayTime(time: number) {
    const minute = Math.floor(time / 60);
    const second = time % 60;
    return ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2);
  }
  refreshField() {
    this.$store.dispatch("initField");
  }
}
</script>

<style scoped>
.common {
  z-index: 6;
}

.navigation-drawer {
  margin-top: 48px;
}

.sidebar-content {
  margin-left: 10px;
}
</style>

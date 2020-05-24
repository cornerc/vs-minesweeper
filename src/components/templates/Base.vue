<template>
  <div class="base">
    <v-card tile flat class="common">
      <app-header
        :header-right-items="headerRightItems"
        :header-center-items="headerCenterItems"
      />
      <v-navigation-drawer
        class="navigation-drawer"
        :mini-variant="!toggles.drawer"
        app
        permanent
      >
        <v-list>
          <v-list-item @click.stop="toggleItem('drawer')">
            <v-icon v-if="toggles.drawer" title="close-sidebar">
              mdi-chevron-triple-left
            </v-icon>
            <v-icon v-else title="open-sidebar">
              mdi-chevron-triple-right
            </v-icon>
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
      <infoDialog
        :value="toggles.infoDialog"
        :toggle="() => toggleItem('infoDialog')"
      />
      <configDialog
        :value="toggles.configDialog"
        :config="config"
        :toggle="() => toggleItem('configDialog')"
        @saveConfig="saveConfig"
      />
    </v-content>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch, Emit} from "vue-property-decorator";
import {displayMmss} from "@/utils/index";
import AppHeader from "@/components/molecules/AppHeader.vue";
import ConfigDialog from "@/components/molecules/ConfigDialog.vue";
import InfoDialog from "@/components/molecules/InfoDialog.vue";
import {
  BaseToggles,
  Config,
  SideMenuItems,
  HeaderCenterItems,
  HeaderRightItems,
} from "@/components/type";

@Component({
  components: {
    AppHeader,
    ConfigDialog,
    InfoDialog,
  },
})
export default class Base extends Vue {
  @Prop({type: Object, default: () => {}})
  private config: Config;
  @Prop({type: Number, default: 0})
  private time: number;
  @Prop({type: Number, default: 0})
  private remainMine: number;
  @Prop({type: Array, default: () => []})
  private sideMenuItems: SideMenuItems[];

  private headerCenterItems: HeaderCenterItems[] = [
    {
      icon: "mdi-table",
      title: "table",
      click: () => this.toggleItem("configDialog"),
      content: () => this.displayTable,
    },
    {
      icon: "mdi-av-timer",
      title: "time",
      click: () => {},
      content: () => this.displayMmss(this.time),
    },
    {
      icon: "mdi-emoticon-cool-outline",
      title: "mine",
      click: () => this.toggleItem("configDialog"),
      content: () => this.displayMine,
    },
  ];
  private headerRightItems: HeaderRightItems[] = [
    {
      icon: "mdi-information",
      title: "information",
      click: () => this.toggleItem("infoDialog"),
    },
    {
      icon: "mdi-refresh",
      title: "reload",
      click: this.refreshField,
    },
    {
      icon: "mdi-cog",
      title: "setting",
      click: () => this.toggleItem("configDialog"),
    },
  ];
  private toggles = {
    drawer: false,
    configDialog: false,
    infoDialog: false,
  };

  get displayTable() {
    return this.config.row + " × " + this.config.col;
  }
  get displayMmss() {
    return displayMmss;
  }
  get displayMine() {
    return this.remainMine + " / " + this.config.mine;
  }

  toggleItem(item: BaseToggles) {
    this.toggles[item] = !this.toggles[item];
  }

  @Emit("initClearField")
  refreshField() {
    return;
  }
  @Emit("saveConfig")
  saveConfig(config: Config) {
    return;
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
</style>

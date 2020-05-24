<template>
  <div class="base">
    <v-card tile flat class="common">
      <app-header
        :header-right-items="headerRightItems"
        :header-center-items="headerCenterItems"
      />
      <side-menu
        :side-menu-items="sideMenuItems"
        :value="toggles.drawer"
        :toggle="() => toggleItem('drawer')"
      />
    </v-card>
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
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
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Emit} from "vue-property-decorator";
import {displayMmss} from "@/utils/index";
import AppHeader from "@/components/molecules/AppHeader.vue";
import ConfigDialog from "@/components/molecules/ConfigDialog.vue";
import InfoDialog from "@/components/molecules/InfoDialog.vue";
import SideMenu from "@/components/molecules/SideMenu.vue";
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
    SideMenu,
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
</style>

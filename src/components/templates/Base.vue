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
          @click.stop="toggleItem('configDialog')"
        >
          {{ config.row }} × {{ config.col }}
        </v-chip>
        <v-spacer />
        <v-icon>mdi-av-timer</v-icon>
        <v-chip class="ma-2" title="time" label>
          {{ displayMmss(time) }}
        </v-chip>
        <v-spacer />
        <v-icon>mdi-emoticon-cool-outline</v-icon>
        <v-chip
          class="ma-2"
          title="mine"
          label
          @click.stop="toggleItem('configDialog')"
        >
          {{ remainMine }} / {{ config.mine }}
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
import ConfigDialog from "@/components/molecules/ConfigDialog.vue";
import InfoDialog from "@/components/molecules/InfoDialog.vue";
import {
  BaseToggles,
  Config,
  SideMenuItems,
  HeaderRightItems,
} from "@/components/type";

@Component({
  components: {
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

  get displayMmss() {
    return displayMmss;
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

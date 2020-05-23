import Vue from "vue";
import Vuetify from "vuetify/lib";

import {light, dark} from "./theme";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdiSvg",
  },
  theme: {
    themes: {
      light: light,
      dark: dark,
    },
    options: {
      customProperties: true,
    },
  },
});

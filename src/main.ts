import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  render: h => h(App),
}).$mount("#app");

import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

// https://www.tutorialfor.com/questions-135624.htm
const app = document.createElement("div");
app.setAttribute("data-app", "true");
document.body.append(app);

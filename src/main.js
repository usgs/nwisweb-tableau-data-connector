import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import uswds from "uswds";
import router from "./router";
import VTooltip from "v-tooltip";
import Datetime from "vue-datetime";

Vue.config.productionTip = false;
Vue.config.productionTip = false;
Vue.use(uswds);
Vue.use(VTooltip);
Vue.use(Datetime);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");

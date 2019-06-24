import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import uswds from "uswds";

Vue.config.productionTip = false;

Vue.config.productionTip = false;
Vue.use(uswds);

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");

import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import uswds from "uswds";
import router from "./router";
import Notifications from "vue-notification";

Vue.config.productionTip = false;

Vue.config.productionTip = false;
Vue.use(uswds);
Vue.use(Notifications);

global.alert = message => {
  Vue.notify({
    group: "Error",
    title: "Error",
    text: message
  });
};

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");

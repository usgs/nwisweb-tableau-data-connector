import Vue from "vue";
import Notifications from "vue-notification";

Vue.use(Notifications);

const notify = message => {
  Vue.notify({
    group: "Error",
    title: "Error",
    text: message
  });
};

export { notify };

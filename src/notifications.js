import Vue from "vue";

const notify = message => {
  Vue.notify({
    group: "Error",
    title: "Error",
    text: message
  });
};

export { notify };

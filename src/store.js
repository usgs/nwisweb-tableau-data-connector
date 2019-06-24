import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    state: "Michigan"
  },
  mutations: {
    changeUSStateName: (state, USStateName) => {
      state.state = USStateName;
    }
  },
  actions: {},
  getters: {
    USStateName: state => {
      return state.state;
    }
  }
});

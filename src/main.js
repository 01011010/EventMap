// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import * as VueGoogleMaps from "vue2-google-maps";
// register the plugin on vue
import Toasted from "vue-toasted";
Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyABDVGHY8L63R40QZDmuermLHtyd4GgEYk",
    libraries: "places" //necessary for places input
  }
});
Vue.use(Toasted, {
  position: "bottom-right",
  type: "success",
  theme: "bubble",
  closeOnSwipe: true
});
// options to the toast
let options = {
  type: "error",
  icon: "error_outline"
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>"
});

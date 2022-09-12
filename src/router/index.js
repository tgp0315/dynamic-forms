import Vue from "vue";
import VueRouter from "vue-router";
import basic from "../components/demo/basic.vue";
import description from "../components/demo/description.vue";
import injectCostom from "../components/demo/inject-costom.vue";
import formLinkage from "../components/demo/form-linkage.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/basic",
    component: basic,
  },
  {
    path: "/description",
    component: description,
  },
  {
    path: "/inject-costom",
    component: injectCostom,
  },
  {
    path: "/form-linkage",
    component: formLinkage,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

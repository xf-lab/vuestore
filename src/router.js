import Vue from 'vue'
import Router from 'vue-router'
//import Home from './views/Home.vue'
//import Categoria from './components/Categoria.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // base: "/dynamic-menu-vue/",
  routes: [
    {
      path: "/",
      redirect: { path: "/home" },
      meta: {
        visible: false
      }
    },
    {
      path: "/home",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "home" */ "./views/Home.vue"),
      meta: {
        visible: true
      },
    },
    {
      path: "/categorias",
      name: "categorias",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Categoria.vue"),
      meta: {
        visible: true
      }
    }
  ]
})

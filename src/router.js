import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './components/Login.vue'
//import Home from './views/Home.vue'
//import Categoria from './components/Categoria.vue'

Vue.use(Router)

var router = new Router({
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
        import("./views/Home.vue"),
      meta: {
        visible: true,
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: "/categorias",
      name: "categorías",
      component: () =>
        import("./views/Categoria.vue"),
      meta: {
        libre: true,
        visible: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        libre: true,
        administrador: true,
        almacenero: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)){
    next();
  } else if ( store.state.usuario && store.state.usuario.rol == 'Administrador'){
    if (to.matched.some(record => record.meta.administrador)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Vendedor'){
    if (to.matched.some(record => record.meta.vendedor)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Almacenero'){
    if (to.matched.some(record => record.meta.almacenero)){
      next();
    }
  } else{
    //next({name: 'login'});
    router.push('/login' )
      .catch(error => {
        console.info(error.message)
      });
  }
})
export default router;
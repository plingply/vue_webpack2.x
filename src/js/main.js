import vue from 'vue'
import vueRouter from 'vue-router'
import App from '../vue/app.vue'
import axios from 'axios'

import '../css/index.less'

vue.use(vueRouter)

vue.prototype.$http = axios;

import routes from './router/router'
//实例化VueRouter
var router = new vueRouter({
    routes // （缩写）相当于 routes: routes
})

new vue({
    router,
    render: h => h(App)
}).$mount('#app')
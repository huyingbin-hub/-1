import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
Vue.use(uView);
import drawer from '@/components/p-drawer/drawer/drawer.vue'
Vue.component('drawer',drawer)
/* import videoPlayer from '@/pages/one/lookDetails/cmms/player.vue'
 Vue.component('videoPlayer',videoPlayer) */
Vue.config.productionTip = false
App.mpType = 'app'
//配置接口
import './lib'
import api from '@/common/vmeitime-http/'
Vue.prototype.$api = api
const app = new Vue({
    ...App
})
app.$mount()

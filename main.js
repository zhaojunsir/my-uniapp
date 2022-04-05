
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
//导入网络请求包   按需导入$http
import {$http} from '@escook/request-miniprogram'
// 在uni-app项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
//配置根路径
$http.baseUrl = "https://api-hmugo-web.itheima.net"
//请求拦截器  请求开始之前做一些事情
$http.beforeRequest = function(){
	uni.showLoading({
		title:'加载中...'
	})
}
//响应拦截器  请求完成之后做一些事情
$http.afterRequest = function(){
	uni.hideLoading();
}

//uni对象挂载自定义方法
uni.$showMsg = function(title='数据加载失败!',duration=1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */
// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	//获取用户登录状态
	getOpenId(data){
		return http.request({
		    url: '/ZxtWxLogin/getOpenId',
		    method: 'POST', 
		    data,
		})
	
	},
	PlayAutha(data){
			  return http.request({
			      url:'/video/getStsInfo',
			      method: 'POST', 
			      data,
			  })
	},
	//获取用户手机号
	getPhone(data){
		return http.request({
		    url: '/ZxtWxLogin/bindMobile',
		    method: 'POST', 
		    data,
		})
	
	},
	//用户登录
	login(data){
		return http.request({
		    url: '/ZxtWxLogin/getUserInfo',
		    method: 'POST', 
		    data,
		})
	
	},
	//支付
	pay(data){
		return http.request({
		    url: '/ZxtWxPay/pay',
		    method: 'POST', 
		    data,
		})
	
	},
	//退出登录
	loginOut(data){
		return http.request({
		    url: '/ZxtWxLogin/logOut',
		    method: 'POST', 
		    data,
		})
	
	},
	//项目列表
	xmList(data){
		return http.request({
		    url: '/ZxtWxInfo/getAllXm',
		    method: 'POST', 
		    data,
		})
	
	},
	
	one:{
		kmList(data){
			return http.request({
			    url: '/ZxtWxInfo/getAllKm',
			    method: 'POST', 
			    data,
			})
		
		},
		//首页课程列表
		classList(data){
			return http.request({
			    url: '/ZxtWxInfo/classList',
			    method: 'POST', 
			    data,
			})
		
		},
		//课程详情
		kcDtails(data){
			return http.request({
			    url: '/ZxtWxInfo/kcmlList',
			    method: 'POST', 
			    data,
			})
		
		},
		update_play_history(data){
			return http.request({
			    url: '/ZxtWxInfo/addVideoJl',
			    method: 'POST', 
			    data,
			})
		
		},
		
		
	},
	two:{
		//我的课程列表
		myclassList(data){
			return http.request({
			    url: '/ZxtWxInfo/myVod',
			    method: 'POST', 
			    data,
			})
		
		},
		
	},
	three:{
		//我的课程列表
		historyClass(data){
			return http.request({
			    url: '/ZxtWxInfo/kcPlayJl',
			    method: 'POST', 
			    data,
			})
		
		},
		//看课时长
		time(data){
			return http.request({
			    url: '/ZxtWxInfo/myScDay',
			    method: 'POST', 
			    data,
			})
		
		},
	}
}
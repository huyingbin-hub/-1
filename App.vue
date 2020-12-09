<template>
	<view class="chose-xm">
		
	</view>
</template>
<script>
	export default {
		data(){
			return{
				getcode:''
			}
		},
		onLaunch: function() {
			
		},
		onShow: function() {
			// var _this=this;
			
			// uni.login({
			//   provider: 'weixin',
			//   success: function (res) {
			// 	_this.getcode=res.code;
			// 	 // uni.setStorageSync('getcode', _this.getcode);
			// 	 // 验证用户是否登录
			// 	_this.id()
			//    /* uni.navigateTo({
			//        url: '/pages/one/choseXm'
			//    }); */
			//   }
			// });
			
		},
		methods:{
			user(){
				uni.getUserInfo({
				  provider: 'weixin',
				  success: function (infoRes) {
					  console.log(infoRes.userInfo,'----')
					  //存取userifo
					  /* uni.setStorageSync('userInfo', infoRes.userInfo);
					   const value = uni.getStorageSync('userInfo'); */
					   const user={
						   avatar:infoRes.userInfo.avatarUrl
					   };
					   console.log(user,'---user')
					 uni.setStorageSync('userInfoAll', user);
				    console.log('用户昵称为：' + infoRes.userInfo.nickName);
					console.log('用户头像为：' + infoRes.userInfo.avatarUrl);
					console.log('用户头像为：' + infoRes.userInfo.openId);
				  }
				});
			},
			id(){
				this.$api.getOpenId({
					code:this.getcode
				}).then(res=>{
					//需绑定手机号码
					if(res.data.event=='106'){
						wx.getSetting({
						  success: res => {
						    console.log(res,'-----res')
							},
							})
						return false;
					}
					//已绑定过手机号码
					if(res.data.event=='100'){
						//获取用户信息
						 uni.setStorageSync('userInfoAll', res.data.data.userInfo);
						//相当于token  唯一标识
						/*uni.setStorageSync('userKey', res.data.data.cache_key); */
					}
				})
			}
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>

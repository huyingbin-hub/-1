<template>
	<view class="three">
		<!--登录前页面-->
		<view class="no-login" v-if="userKey==''">
			<view class="nav">我的</view>
			<view class="login">
				<view class="login-avatar">
					<image style='width: 66px;height: 66px;' src="../../static/touxiang.png"></image>
				</view>
				<view class="login-now">
					<!-- @click="gologin" -->
					<!-- <view v-if="userInfoAll!='undefined'">{{userInfoAll.nickname}}</view> -->
					<button v-if="phone!=''" style="font-size: 12px;border: none;background-color: #FFFFFF;width: 118px;" class=""
					 open-type="getUserInfo" @getuserinfo="wxGetUserInfo" withCredentials="true">立即登录</button>
					<button style="font-size: 12px;border: none;background-color: #FFFFFF;width: 118px;" open-type="getPhoneNumber"
					 v-if="phone==''" @getphonenumber="getPhoneNumber" withCredentials="true">立即注册</button>
					<text>学习·遇见更美好的自己</text>
				</view>
			</view>
		</view>
		<!--登录后页面-->
		<view class="login-after" v-if="userKey!=''">
			<view class="nav-after">
				<text style="z-index: 100;line-height: 120px;">我的</text>
			</view>
			<view class="user-info">
				<view class="user-img">
					<image style='width: 66px;height: 66px;' :src="userInfoAll.avatar"></image>
					<text>{{userInfoAll.nickname}}</text>
				</view>
				<view class="user-study">
					<view class="time">
						<view class="dat" v-if="timeData.scData==null">0</view>
						<view class="dat" v-else>{{timeData.scData}}</view>
						<view>今日看课时长(小时)</view>
					</view>
					<view class="days">
						<view class="dat">{{timeData.xxData}}</view>
						<view>总学习天数</view>
					</view>
				</view>
			</view>

		</view>
		<view class="my-list" @click="goRecord">
			<view class="details">
				<u-icon name='order' color='#333' size='28'></u-icon>
				<text>学习记录</text>
			</view>
			<view class="click-details">
				<image style="width: 15px;height: 15px;vertical-align: middle;" src="../../static/right.png"></image>
				<!-- <u-icon style='vertical-align: middle;' name='arrow-right' color='#999999' size='30'></u-icon> -->
			</view>
		</view>
		<view class="sign-out" v-if="userKey!=''">
			<button @click="loginNo">退出登陆</button>
		</view>
		<!-- <view @click="goHdpage">
			<image style="width: 100%;height: 105px;" src="../../static/huodong2.png"></image>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabList: '',
				userInfo: {}, //通过微信获取的信息
				userInfoAll: {}, //通过接口获取的用户详细信息
				code: '',
				userKey: '',
				phone: '',
				timeData: {},
				type: '4'
			}
		},
		onLoad() {},
		onShow() {
			//如果用户登陆过
			const userinfoAll = uni.getStorageSync('userInfoAll');
			//获取用户唯一标识
			this.userInfoAll = userinfoAll;
			console.log(this.userInfoAll, 'user00000')
			this.phone = this.userInfoAll.mobile
			//userKey
			this.userKey = uni.getStorageSync('userKey');
			//用户登录前数据
			this.userInfo = uni.getStorageSync('userInfo');
			this.time()
			//获取用户信息
			/* uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(loginRes);
					// 获取用户信息
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							console.log('用户昵称为：' + infoRes.userInfo.nickName);
						}
					});
				}
			}); */


		},
		methods: {
			/* goHdpage(){
				if(this.phone==''){
					uni.showToast({
						title: "请先注册~",
						icon: "none"
					});
				}
				uni.navigateTo({
				    url: '/pages/one/hdPage?phone='+this.phone+'&type='+this.type
				});
			}, */
			//获取看课时长
			time() {
				this.$api.three.time({
					cache_key: this.userKey,

				}).then(res => {
					if (res.data.event == '100') {
						this.timeData = res.data
					}

				})
			},
			//退出登录
			loginNo() {
				this.$api.loginOut({
					cache_key: this.userKey,
				}).then(res => {
					if (res.data.event != '100') {

						return false;
					}
					if (res.data.event == '100') {
						uni.showToast({
							title: '退出成功',
							duration: 2000
						});
						// uni.setStorageSync('userInfoAll','')
						uni.setStorageSync('userKey', '')
						this.userKey = '';

					}
				})
			},
			wxGetUserInfo: function(res) {
				if (!res.detail.iv) {
					uni.showToast({
						title: "您取消了授权,登录失败",
						icon: "none"
					});
					return false;
				}

				this.nowLogin(res);
			},
			getPhoneNumber(e) {
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					console.log('用户点击了接受', e);

					this.getPhone(e);

				} else {
					console.log('用户点击了拒绝');
				}
			},
			//获取手机号
			getPhone(e) {
				console.log(e.detail, '-----')
				var _this = this;
				uni.login({
					provider: 'weixin',
					success: function(res) {
						_this.code = res.code;
						_this.$api.getPhone({
							code: _this.code,
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
						}).then(res => {
							if (res.data.event != '100') {
								uni.showToast({
									title: '信息出错',
									duration: 2000
								});
								return false;
							}
							if (res.data.event == '100') {
								/* uni.setStorageSync('phone',  res.data.data);
								_this.phone= uni.getStorageSync('phone'); */
								_this.phone = res.data.data
								uni.setStorage({
									key: "userInfoAll",
									data: {
										mobile: res.data.data
									}
								})
								// _this.phone = res.data.data;
								console.log('获取手机号的信息', _this.phone)
							}
						})
					}
				})
			},
			// 登录 发请求  存数据
			nowLogin(e) {
				console.log(this.phone, '9999')
				var _this = this;
				uni.login({
					provider: 'weixin',
					success: function(res) {
						console.log(res, '----kkk')
						_this.code = res.code;

						_this.$api.login({
							code: _this.code,
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							user_phone: _this.phone
						}).then(res => {
							if (res.data.event != '100') {
								return false
							}

							if (res.data.event == '100') {
								console.log('登录的信息', res.data)
								//获取用户信息
								uni.setStorageSync('userInfoAll', res.data.data.userInfo);
								const userinfoAll = uni.getStorageSync('userInfoAll');
								//获取用户唯一标识
								if (userinfoAll) {
									_this.userInfoAll = userinfoAll;
									_this.phone = _this.userInfoAll.mobile
								}
								//相当于token  唯一标识
								uni.setStorageSync('userKey', res.data.data.cache_key);
								const key = uni.getStorageSync('userKey');
								_this.userKey = key;
								_this.time()
							}
						})
					}
				})

			},
			// 跳转登录页
			// gologin() {
			// 	uni.navigateTo({
			// 		url: '/pages/three/login'
			// 	});
			// },
			goRecord() {
				if (this.userKey == '') {
					uni.showToast({
						title: '请先登陆~',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				if (this.phone == '') {
					uni.showToast({
						title: '请先注册,登陆~',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				uni.navigateTo({
					url: '/pages/three/classRecord'
				});
			}
		}
	}
</script>

<style lang="scss">
	.three {
		.my-list {
			// margin-top: 10px;
			line-height: 30px;
			display: flex;
			justify-content: space-between;

			.details {
				text {
					vertical-align: middle;
					margin-left: 5px;
					font-size: 12px;
				}
			}

			.click-details {}
		}

		color: #333333;
		padding: 0 16px;

		.sign-out {
			margin: 20px 0;

			button {
				width: 100%;
				font-size: 14px;
				height: 35px;
				line-height: 35px;
			}
		}

		.no-login {
			.nav {
				height: 60px;
				font-size: 14px;
				line-height: 86px;
				text-align: center
			}

			.login {
				margin-top: 20px;
				display: flex;
				height: 80px;
				align-items: center;

				.login-avatar {
					image {
						border-radius: 50%;
					}
				}

				.login-now {
					margin-left: 20px;

					view {
						font-size: 14px;
					}

					text {
						color: #999999;
						font-size: 12px;
					}
				}
			}

		}

		.login-after {
			.nav-after {
				color: #FFFFFF;
				margin: -16px;
				background-image: url(../../static/bg_my.png);
				background-size: 100%;
				height: 173px;
				text-align: center;
			}

			.user-info {
				position: relative;
				top: -30px;
				width: 100%;
				height: 133px;
				background: #FFFFFF;
				box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);
				border-radius: 10px;

				.user-img {
					position: absolute;
					width: 100%;
					/* padding: 0 132px; */
					display: flex;
					align-items: center;
					justify-content: center;
					flex-wrap: wrap;
					top: -30px;

					image {
						border-radius: 50%;
						display: block;
						margin: 0 4px;
					}

					text {
						width: 100%;
						text-align: center;
						font-size: 12px;
						margin-top: 5px;
					}
				}

				.user-study {
					display: flex;
					padding: 10px;

					.dat {
						font-size: 16px !important;
						line-height: 27px;
					}

					.time {
						position: absolute;
						bottom: 15px;
						left: 20px;

						view {
							text-align: center;
							font-size: 12px;
						}
					}

					.days {
						position: absolute;
						bottom: 15px;
						right: 20px;

						view {
							text-align: center;
							font-size: 12px;
						}
					}
				}
			}
		}
	}
</style>

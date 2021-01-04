<template>
	<view class="three">
		<!--登录前页面-->
		<view class="no-login" v-if="userKey == '' || phone == ''">
			<view class="nav">我的</view>
			<view class="login">
				<view class="login-avatar"><image style="width: 66px;height: 66px;" src="../../static/touxiang.png"></image></view>
				<view class="login-now">
					<button
						style="font-size: 12px;border: none;background-color: #FFFFFF;width: 118px;"
						open-type="getPhoneNumber"
						v-if="phone == '' && userKey !== ''"
						@getphonenumber="getPhoneNumber"
						withCredentials="true"
					>
						<!-- #ifdef MP-WEIXIN -->
						立即注册
						<!-- #endif -->
						<!-- #ifdef MP-TOUTIAO -->
						手机号一键登录
						<!-- #endif -->
					</button>

					<!-- #ifdef MP-WEIXIN -->
					<button
						style="font-size: 12px;border: none;background-color: #FFFFFF;width: 118px;"
						open-type="getUserInfo"
						v-else
						@getuserinfo="wxGetUserInfo"
						withCredentials="true"
					>
						立即登录
					</button>
					<!-- #endif -->
					<!-- #ifdef MP-TOUTIAO -->
					<button
						style="font-size: 12px;border: none;background-color: #FFFFFF;width: 118px;"
						open-type="getUserInfo"
						v-if="userKey == ''"
						@click="ttGetUserInfo"
						withCredentials="true"
					>
						立即登录
					</button>
					<!-- #endif -->
					<text>学习·遇见更美好的自己</text>
				</view>
			</view>
		</view>

		<!--登录后页面-->
		<view class="login-after" v-if="userKey !== '' && phone !== ''">
			<view class="nav-after"><text style="z-index: 100;line-height: 120px;">我的</text></view>
			<view class="user-info">
				<view class="user-img">
					<image style="width: 66px;height: 66px;" :src="userInfoAll.user_pic"></image>
					<text>{{ userInfoAll.user_nickname }}</text>
				</view>
				<view class="user-study">
					<view class="time">
						<view class="dat" v-if="timeData.scData == null">0</view>
						<view class="dat" v-else>{{ timeData.scData }}</view>
						<view>今日看课时长(小时)</view>
					</view>
					<view class="days">
						<view class="dat">{{ timeData.xxData }}</view>
						<view>总学习天数</view>
					</view>
				</view>
			</view>
		</view>
		<view class="my-list" @click="goRecord">
			<view class="details">
				<u-icon name="order" color="#333" size="28"></u-icon>
				<text>学习记录</text>
			</view>
			<view class="click-details"><image style="width: 15px;height: 15px;vertical-align: middle;" src="../../static/right.png"></image></view>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="my-list" @click="goInstall">
			<view class="details">
				<u-icon name="order" color="#333" size="28"></u-icon>
				<text>设置</text>
			</view>
			<view class="click-details"><image style="width: 15px;height: 15px;vertical-align: middle;" src="../../static/right.png"></image></view>
		</view>
		<!-- #endif -->
		<view class="sign-out" v-if="userKey !== '' && phone !== ''"><button @click="loginNo">退出登陆</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabList: '',
			userInfoAll: {}, //通过接口获取的用户详细信息
			code: '',
			userKey: '',
			phone: '',
			timeData: {},
			type: '4',
			userId:''
		};
	},
	onLoad() {},
	onShow() {
		this.getJudgeStorage();
		this.time(); //获取看课时长
	},
	methods: {
		getJudgeStorage() {
			let that = this;
			uni.getStorage({
				key: 'userInfoAll',
				success: function(res) {
					console.log('userInfoAll成功');
					that.userInfoAll = res.data;
					that.phone = res.data.user_phone;
					that.userId=res.data.user_id
				},
				fail: function(err) {
					that.userInfoAll = '';
					that.phone = '';
				}
			});
			uni.getStorage({
				key: 'userKey',
				success: function(res) {
					console.log('userKey成功');
					that.userKey = res.data;
				},
				fail: function(err) {
					that.userKey = '';
				}
			});
		},
		//获取看课时长
		time() {
			this.$api.three
				.time({
					cache_key: this.userKey
				})
				.then(res => {
					if (res.data.event == '100') {
						this.timeData = res.data;
					}
				});
		},

		//退出登录
		loginNo() {
			this.$api.loginOut({
					cache_key: this.userKey
				})
				.then(res => {
					console.log({res},'退出登录')
					if (res.data.event != '100') {
						return false;
					}
					if (res.data.event == '100') {
						uni.showToast({
							title: '退出成功',
							duration: 2000
						});
						try {
							uni.removeStorageSync('userInfoAll');
							uni.removeStorageSync('userKey');
						} catch (e) {
							// error
						}
						this.getJudgeStorage();
						// #ifdef APP-PLUS
						uni.reLaunch({
							url: '../login/userLogin'
						});
						// #endif
					}
				});
		},

		// 微信登录
		wxGetUserInfo(res) {
			console.log(res, '点击登录');
			if (!res.detail.iv) {
				uni.showToast({
					title: '您取消了授权,登录失败',
					icon: 'none'
				});
				return false;
			}
			this.nowLogin(res);
		},

		// 头条登录
		ttGetUserInfo() {
			let that = this;
			uni.login({
				success: function(res) {
					console.log(res, 'uni.login');
					let code = res.code;
					uni.getUserInfo({
						withCredentials: true,
						success: function(res) {
							console.log(res, 'uni.getUserInfo');
							that.xcxGetgetUserInfo(code, res.userInfo); //后台登录
						}
					});
				}
			});
		},

		// 微信 获取手机号弹窗状态
		getPhoneNumber(e) {
			console.log({ e });
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				console.log('用户点击了接受', e);
				this.getPhone(e);//获取手机号
			} else {
				console.log('用户点击了拒绝');
			}
		},

		//获取手机号
		getPhone(e) {
			console.log(e.detail, '-----');
			var _this = this;
			uni.login({
				success: function(res) {
					console.log({ res }, 'code');
					_this.$api
						.getPhone({
							code: res.code,
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv,
							'info[user_id]': _this.userId,
							// #ifdef MP-WEIXIN
							'info[type]': 'weixin',
							// #endif
							// #ifdef MP-TOUTIAO
							'info[type]': 'zijie',
							// #endif
							'info[xcx]': 'zkt'
						})
						.then(res => {
							if (res.data.event != '100') {
								uni.showToast({
									title: '信息出错',
									duration: 2000
								});
								return false;
							}
							if (res.data.event == '100') {
								_this.phone = res.data.data;
								uni.setStorage({
									key: 'userInfoAll',
									data: res.data.data
								});
								// _this.phone = res.data.data;
								console.log('获取手机号的信息', _this.phone);
							}
						});
				},
				fail(err) {
					console.log({ err }, 'errrrrr');
				}
			});
		},

		// 微信登录 发请求  存数据
		nowLogin(e) {
			var _this = this;
			uni.login({
				// #ifdef APP-PLUS
				provider: 'weixin',
				// #endif
				success: function(res) {
					let code = res.code;
					uni.getUserInfo({
						withCredentials: true,
						success: function(res) {
							console.log(res, '登录');
							// _this.getUserKey(e.detail, code, '15136298700'); // 获取用户标识
							_this.xcxGetgetUserInfo(code, res.userInfo); // 小程序getUserInfo 综合
						}
					});
				}
			});
		},

		// 小程序getUserInfo 综合
		xcxGetgetUserInfo(code, userInfo) {
			let _this = this;
			let datas = {
				// #ifdef MP-WEIXIN
				'info[type]': 'weixin',
				// #endif
				// #ifdef MP-TOUTIAO
				'info[type]': 'zijie',
				// #endif
				'info[xcx]': 'zkt',
				'info[code]': code
			};
			this.$api.xcxLogin(datas).then(res => {
				if (res.data.event == 100) {
					uni.setStorageSync('userKey', res.data.data.cache_key);
					console.log(res, 'xcxLogin');
					let userList = res.data.data.userInfo;
					_this.userId = userList.user_id;
					userList.user_pic = userInfo.avatarUrl; //头像
					userList.user_nickname = userInfo.nickName; //名称
					userList.user_gender = userInfo.gender; //性别
					userList.country = userInfo.country; //国家
					userList.city = userInfo.city; //城市
					userList.province = userInfo.province; //地区
					if(userList.user_phone==""&&userList.user_nickname==''){
						_this.reserveUserInfo(userList); //存储用户信息
					}else{
						uni.setStorage({
							key: 'userInfoAll',
							data: userList
						});
					}
					// 唯一标识
					if (userList) {
						_this.userInfoAll = userList;
						_this.phone = userList.user_phone;
					}
					_this.userKey = res.data.data.cache_key;
					_this.time();
				} else {
					uni.showToast({
						title: '请重试~',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
			});
		},

		// 获取用户标识
		getUserKey(detail, code, phone) {
			let _this = this;
			_this.$api
				.login({
					code: code,
					encryptedData: detail.encryptedData,
					iv: detail.iv,
					user_phone: phone
				})
				.then(res => {
					if (res.data.event != '100') {
						return false;
					}
					if (res.data.event == '100') {
						console.log('登录的信息', res.data);
					}
				});
		},

		// 存储小程序用户信息
		reserveUserInfo(data) {
			let _this = this;
			console.log(data, '存储信息');
			let dataLists = {
				// #ifdef MP-TOUTIAO
				'info[type]': 'zijie',
				// #endif
				// #ifdef MP-WEIXIN
				'info[type]': 'weixin',
				// #endif
				'info[user_id]': data.user_id,
				'info[user_nickname]': data.user_nickname,
				'info[user_pic]': data.user_pic,
				'info[user_gender]': data.user_gender,
				'info[city]': data.city,
				'info[province]': data.province,
				'info[country]': data.country
			};
			let jiamiData = dataLists;
			_this.$api.xcx_userxx(dataLists).then(res => {
				console.log('xcx_userxx', res);
			});
		},

		// 判断是否登录 是否存储手机号 学习记录
		goRecord() {
			let userInfoAll = uni.getStorageSync('userInfoAll');
			let userKey = uni.getStorageSync('userKey');
			if (userKey == '') {
				uni.showToast({
					title: '请先登陆~',
					duration: 2000,
					icon: 'none'
				});
				return false;
			}
			if (userInfoAll == '') {
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
		},
		// 判断是否登录 是否存储手机号 设置  app端显示
		goInstall() {
			let userInfoAll = uni.getStorageSync('userInfoAll');
			let userKey = uni.getStorageSync('userKey');
			if (userKey == '') {
				uni.showToast({
					title: '请先登陆~',
					duration: 2000,
					icon: 'none'
				});
				return false;
			}
			if (userInfoAll == '') {
				uni.showToast({
					title: '请先注册,登陆~',
					duration: 2000,
					icon: 'none'
				});
				return false;
			}
			uni.navigateTo({
				url: '/pages/install/install'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
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

		.click-details {
		}
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
			text-align: center;
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
			color: #ffffff;
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
			background: #ffffff;
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

<template>
	<view class="login-container">
		<view class="loginBg">
			<image src="../../static/images/loginbg.png" mode=""></image>
		</view>
		<view class="login-content">
			<view>
				<u-icon name="close" color="#616466" size="34"></u-icon>
			</view>
			<view class="login-title">
				账号密码登录
			</view>
			<view>
				<u-form class="uview_from" ref="uForm">
					<u-form-item :border-bottom="true" label-width="0" class="uview_from-item">
						<view class="uview_fromInput">
							<image class="uview_fromInput_icom" src="../../static/images/icon_zhanghao.png" mode=""></image>
							<u-input @input="phoneInput" v-model="phone" :clearable="false" type="number" placeholder="请输入账号" :password-icon="true"
							 style="width: 100%;" />
						</view>
					</u-form-item>
					<u-form-item :border-bottom="true" label-width="0" class="uview_from-item">
						<view class="uview_fromInput">
							<image class="uview_fromInput_icom" src="../../static/images/icon_mima.png" mode=""></image>
							<u-input @input="phoneInput" v-model="password" :clearable="false" type="password" placeholder="请输入密码"
							 :password-icon="true" style="width: 100%;" />
						</view>
					</u-form-item>
				</u-form>
			</view>
			<view class="login-chick">
				<u-checkbox @change="checkboxChange" shape="circle" label-size="24" v-model="checked">记住账号</u-checkbox>
			</view>
			<view class="login-botton">
				<view class="login-btn">
					<view class="login-btnBg" v-if="isClearable">
						<image src="../../static/images/login/button_mwz.png" mode=""></image>
					</view>
					<view class="login-btnBg" v-else>
						<image @click="loginClick" src="../../static/images/login/button_ywz.png" mode=""></image>
					</view>
					<view class="login-text">
						登录
					</view>
				</view>
			</view>
			<view class="register">
				<view class="">
					还没有账号？<text class="textColorBlue" @click="gotoRegister">马上注册</text>
				</view>
				<view class="textColorBlue" @click="gotoForget">
					忘记密码？
				</view>
			</view>
			<view>
				<u-divider color="#CCCCCC" half-width="75" fontSize="24" border-color="#CCCCCC">其他方式登录</u-divider>
			</view>
			<view class="sanFang-icon">
				<image @click="waiLian" class="sanFang" src="../../static/images/login/wx.png" mode=""></image>
			</view>
		</view>

		<!--协议同意弹窗-->
		<u-modal v-model="dealShow" :title-style="{color: '#000'}" title="隐私协议政策提示" show-cancel-button confirm-text="同意"
		 cancel-text="不同意" :confirm-style="consentStyle" @confirm="consentClick" @cancel="noConsentClick">
			<view class="slot-content">
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		_methods
	} from '../../utils/public.js'
	export default {
		data() {
			return {
				phone: "",
				password: "",
				checked: false,
				isClearable: true, //控制按钮是否可以点击
				dealShow: false, //控制协议弹窗
				consentStyle: {

				}
			};
		},
		onShow() {
			
			// 判断隐私协议/用户协议用户是否确认
			let protocol=uni.getStorageSync('protocol');
			protocol?(this.dealShow=false):(this.dealShow=true)
			
			// 判断是否记住账号登录
			let phone=uni.setStorageSync('phone');
			phone?(this.phone=phone):(this.phone='')
		},
		methods: {
			..._methods,
			
			//监听输入框是否有值，来控制按钮是否可以点击
			phoneInput() {
				if (this.phone != "" || this.password != "") {
					this.isClearable = false
				} else {
					this.isClearable = true
				}
			},

			//记住账号
			checkboxChange(e) {
				this.checked = e.value
				console.log("checked", e.value)
			},

			//登录事件
			loginClick() {
				if (!this.phone) {
					this.show_toast("手机号不能为空")
					return
				}
				if (!this.checkPhone(this.phone)) {
					this.show_toast("手机号格式不正确")
					return
				}
				if (!this.password) {
					this.show_toast("密码不能为空")
					return
				}
				// 点击记住账号  存储手机号
				if(this.checked){
					uni.setStorageSync('phone', this.phone);
				}
				console.log("ok")
			},

			waiLian() {
				// uni.navigateTo({
				// 	url: "/pages/ceshiWai/ceshiWai"
				// })
			},

			//协议弹窗同意事件
			consentClick() {
				uni.setStorageSync('protocol', true);
				this.dealShow = false
			},

			//协议弹窗拒绝事件  退出程序
			noConsentClick() {
				if (uni.getSystemInfoSync().platform == 'ios') {
					plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
				} else if (uni.getSystemInfoSync().platform == 'android') {
					plus.runtime.quit();
				}
			},

			//跳转注册页面
			gotoRegister() {
				uni.navigateTo({
					url: "./register"
				})
			},

			//跳转修改密码页面
			gotoForget() {
				uni.navigateTo({
					url: "./forgetPassword"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login-container {
		width: 100%;
		height: 100%;
		position: relative;
	}

	image {
		width: 100%;
		height: 100%;
	}

	.loginBg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		min-height: 100vh;
		z-index: 1;
	}

	/*主要内容*/
	.login-content {
		position: absolute;
		z-index: 2;
		padding: 120rpx 0 0 70rpx;

		.login-title {
			margin-top: 80rpx;
			font-size: 34rpx;
			font-weight: 800;
			color: #000000;
		}

		.uview_from {
			.u-border-bottom:after {
				border-bottom: 1px solid #F4F4F4;
			}

			.uview_from-item {
				margin-top: 60rpx;
				display: flex;
			}
		}

		.uview_fromInput {
			width: 600rpx;
			display: flex;
			align-items: center;
			flex-wrap: nowrap;

			.uview_fromInput_icom {
				width: 46rpx;
				height: 46rpx;
				display: block;
				// display: flex;
				// justify-content: center;
				margin-right: 10rpx;
			}
		}

		.login-chick {
			margin-top: 40rpx;
		}

		.login-botton {
			margin-top: 50rpx;
		}

		.login-btn {
			width: 600rpx;
			height: 100rpx;
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;

			.login-btnBg {
				width: 100%;
				height: 100%;
				position: absolute;
				z-index: 2;
			}
		}

		.login-text {
			position: absolute;
			z-index: 3;
			font-size: 34rpx;
			font-weight: bold;
			color: #FFFFFF;

		}

		.register {
			margin: 50rpx 0 80rpx 0;
			padding: 0 38rpx;
			font-size: 24rpx;
			font-weight: bold;
			color: #000000;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.textColorBlue {
				color: #309BFF;
			}
		}

		.sanFang {
			margin-top: 40rpx;
			width: 78rpx;
			height: 78rpx;
		}

		.sanFang-icon {
			width: 100%;
			display: flex;
			justify-content: center;
		}
	}
</style>

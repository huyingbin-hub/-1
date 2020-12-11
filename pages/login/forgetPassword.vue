<template>
	<view>
		<view class="register">
			<view @click="goBack">
				<u-icon name="arrow-left" color="#616466" size="34"></u-icon>
			</view>
			<view class="login-title">
				忘记密码
			</view>
			<view class="register-form">
				<u-form class="uview_from" ref="uForm">
					<u-form-item :border-bottom="true" label-width="0">
						<view class="uview_fromInput">
							<image class="uview_fromInput_icom" src="../../static/images/login/haoma.png" mode=""></image>
							<u-input @input="phoneInput" v-model="phone" :clearable="false" placeholder="请输入手机号" type="number" style="width: 100%;" />
						</view>
					</u-form-item>

					<u-form-item class="auth_code_style" :border-bottom="true" label-width="0">
						<view class="icon_code_input">
							<image class="uview_fromInput_icom" src="../../static/images/login/yanzhengma.png" mode=""></image>
							<u-input @input="phoneInput" v-model="authCode" placeholder="请输入验证码" type="number" :clearable="false" />
						</view>
						<u-button hover-class="none" shape="circle" slot="right" :custom-style="codeBtnStyle" type="default" @click="sendCode"
						 :disabled="smsFlag">{{sendTime}}</u-button>
					</u-form-item>

					<u-form-item :border-bottom="true" label-width="0">
						<view class="uview_fromInput">
							<image class="uview_fromInput_icom" src="../../static/images/login/mima.png" mode=""></image>
							<u-input @input="phoneInput" v-model="password" type="password" placeholder="请输入新密码(6-20位数字字母组合）" :clearable="false"
							 :password-icon="true" style="width: 100%;" />
						</view>
					</u-form-item>

					<u-form-item :border-bottom="true" label-width="0">
						<view class="uview_fromInput">
							<image class="uview_fromInput_icom" src="../../static/images/login/mima.png" mode=""></image>
							<u-input @input="phoneInput" v-model="affirmPassword" type="password" placeholder="请确定新密码" :clearable="false"
							 :password-icon="true" style="width: 100%;" />
						</view>
					</u-form-item>

				</u-form>
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
						修改
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="register-explain">
			<view class="" style="width:24rpx;margin-right: 10rpx;">
				<u-checkbox active-color="#FF6900" @change="checkboxChange" shape="circle" size="24" label-size="24" v-model="checked"></u-checkbox>
			</view>
			<view>
				注册登录即视为同意<text class="textColorBlue">《用户服务协议》</text><text class="textColorBlue">《用户隐私政策》</text>
			</view>
		</view> -->
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
				authCode: "",
				password: "",
				affirmPassword: "",
				checked: false,
				isClearable: true, //控制按钮是否可以点击
				//获取验证码属性
				smsFlag: false,
				sendTime: "获取验证码",
				snsMsgWait: 60,

				//发送验证码按钮样式
				codeBtnStyle: {
					width: '200rpx',
					height: "70rpx",
					lineHeight: '70rpx',
					fontSize: '12px',
					color: "#FF6A03",
				}
			};
		},
		methods: {
			..._methods,

			//勾选协议事件
			checkboxChange(e) {
				this.checked = e.value
				console.log("checked", e.value)
			},

			//监听输入框是否有值，来控制按钮是否可以点击
			phoneInput() {
				if (this.phone != "" || this.authCode != "" || this.password != "") {
					this.isClearable = false
				} else {
					this.isClearable = true
				}
			},

			// 返回
			goBack() {
				uni.navigateBack({
					delta: 1
				});
			},

			//获取验证码
			sendCode() {
				if (!this.phone) {
					this.show_toast("手机号不能为空")
					return
				}
				if (!this.checkPhone(this.phone)) {
					this.show_toast("手机号格式不正确")
					return
				}
				this.smsFlag = true;

				let postObj = {
					type: "reg",
					mphone: this.phone
				};
				// Services.getSendCode(postObj).then(res => {
				// 	console.log(res)
				// 	if (res.Flag) {
				// 		this.verify_id = res.verify_id
				// 		this.show_toast("发送成功")
				// 	} else {
				// 		this.show_toast(res.Message)
				// 	}
				// })
				this.show_toast("发送成功")
				var inter = setInterval(
					function() {
						this.sendTime = this.snsMsgWait + "秒后重发";
						this.snsMsgWait = this.snsMsgWait - 1;
						if (this.snsMsgWait < 0) {
							clearInterval(inter);
							this.sendTime = "获取验证码";
							this.snsMsgWait = 60;
							this.smsFlag = false;
						}
					}.bind(this),
					1000
				);
				console.log(66666);
			},

			//修改
			loginClick() {
				if (!this.phone) {
					this.show_toast("手机号不能为空")
					return
				}
				if (!this.checkPhone(this.phone)) {
					this.show_toast("手机号格式不正确")
					return
				}
				if (!this.authCode) {
					this.show_toast("验证码不能为空")
					return
				}
				if (!this.password) {
					this.show_toast("密码不能为空")
					return
				}
				if (!this.affirmPassword) {
					this.show_toast("确认密码不能为空")
					return
				}
				if (this.affirmPassword != this.password) {
					this.show_toast("两次密码不一致")
					return
				}

				console.log("注册", this.phone, this.authCode, this.password, this.affirmPassword)

				let postObj = {
					mphone: this.phone,
					password: this.password,
					yzm: this.authCode,
					verify_id: this.verify_id
				};
				uni.showLoading({
					title: '注册中...',
					icon: "none"
				});

				Services.userRegister(postObj).then(res => {
					if (res.Flag) {
						console.log('res', res)
						this.show_toast("注册成功")
						setTimeout(function() {
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}, 500)
					} else {
						this.show_toast(res.Content)
					}
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	image {
		width: 100%;
		height: 100%;
	}

	.register {
		/* #ifdef APP-PLUS */
		width: 80%;
		/* #endif */
		/* #ifndef APP-PLUS */
		width: 100%;
		/* #endif */
		height: 100%;
		padding: 120rpx 60rpx 0 60rpx;

		.login-title {
			margin-top: 80rpx;
			font-size: 34rpx;
			font-weight: 800;
			color: #000000;
		}

		.register-form {
			margin-top: 90rpx;
		}

		.uview_from {
			/deep/ .u-border-bottom:after {
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

		.auth_code_style {
			display: flex;
			justify-content: space-between;

			.icon_code_input {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 30rpx;
			}

			.uview_fromInput_icom {
				width: 46rpx;
				height: 46rpx;
				display: flex;
				margin-right: 10rpx;
			}

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
	}

	.register-explain {
		margin: 50rpx 0 0 0;
		font-size: 24rpx;
		font-weight: 500;
		color: #9B9B9B;
		display: flex;
		justify-content: center;
		align-items: center;

		.textColorBlue {
			color: #FF6A01;
		}
	}
</style>

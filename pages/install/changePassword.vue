<template>
	<view>
		<u-form :model="form" ref="uForm" class="uFrom" :label-style="labelStyle">
			<u-form-item label="旧密码" prop="password">
				<u-input :custom-style="customStyle" :clearable="false" placeholder="请输入旧密码"  type="password" v-model="form.password" />
			</u-form-item>
			<u-form-item label="新密码" prop="newPassword">
				<u-input
					:custom-style="customStyle"
					:clearable="false"
					placeholder="请输入新密码(6-20位数字字母组合）"
					v-model="form.newPassword"
					type="password"
				/>
			</u-form-item>
			<u-form-item label="新密码" prop="againNewPassword">
				<u-input
					:custom-style="customStyle"
					type="password"
					:clearable="false"
					placeholder="请再次输入新密码"
					v-model="form.againNewPassword"
				/>
			</u-form-item>
			<button type="primary" @click="submit">提交</button>
		</u-form>
	</view>
</template>

<script>
import { _methods } from '../../utils/public.js';
export default {
	data() {
		return {
			form: {
				password: '',
				newPassword: '',
				againNewPassword: ''
			},
			// form样式
			labelStyle: {
				width: '696rpx',
				marginLeft: '30rpx',
				height: '83rpx',
				fontSize: '30rpx',
				fontFamily: 'PingFang SC',
				fontWeight: 'bold',
				color: '#333333'
			},
			// u-input样式
			customStyle: {
				marginLeft: '56rpx'
			}
		};
	},
	onShow() {
		// uni.getStorage({
		// 	key: 'userInfoData',
		// 	success(res) {
		// 		that.userInfoData = res.data;
		// 		that.user_pic = res.data.user_pic;
		// 		that.user_nickname = res.data.user_nickname;
		// 	}
		// });
	},
	methods: {
		..._methods,
		// 提交
		submit() {
			if (!this.form.password) {
				this.show_toast('旧密码不能为空');
				return;
			}
			if (!this.form.newPassword) {
				this.show_toast('新密码不能为空');
				return;
			}
			if (!this.form.againNewPassword) {
				this.show_toast('新密码不能为空');
				return;
			}
			if (!this.checkPassword(this.form.newPassword)) {
				this.show_toast('请输入新密码(6-20位数字字母组合');
				return;
			}
			if (this.form.newPassword != this.form.againNewPassword) {
				this.show_toast('两次密码不一致');
				return;
			}
			let postObj = {
				user_id: uni.getStorageSync('userInfoData').user_id,
				old_pwd: this.form.password,
				new_pwd: this.form.newPassword
			};
			this.$api.editpwd(postObj).then(res => {
				console.log(res, 'res修改成');
				if(res.event==100){
					this.$u.toast('修改成功！');
					// this.loginOut(postObj,'修改成功')//退出登录
					this.loginNo()
				}
			});
		},
		//退出登录
		loginNo() {
			this.$api.loginOut({
					cache_key: uni.getStorageSync('user_key')
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
	}
};
</script>

<style scoped lang="scss">
.uFrom {
	width: 696rpx;
	margin-left: 30rpx;
	height: 83rpx;
}
button {
	width: 537rpx;
	height: 80rpx;
	border-radius: 40rpx;
	line-height: 80rpx;
	margin-top: 134rpx;
	margin-left: 107rpx;
	background: #368ef3;
}
button::after {
	border: none;
}
</style>

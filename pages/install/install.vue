<template>
	<view>
		<u-cell-group :border="false">
			<u-cell-item title="修改密码" @click="changePassword"></u-cell-item>
			<u-cell-item title="检验新版本"></u-cell-item>
			<u-cell-item title="隐私协议" @click="privacyAgreement"></u-cell-item>
		</u-cell-group>
		<view class="bottoms">
			<view class="versions">中课帮v1.0</view>
			<view class="install-versions">中课帮版权所有</view>
			<!-- <button type="default" class="custom-style" @click="logOut">退出登录</button> -->
		</view>
	</view>
</template>

<script>
	import { _methods } from '../../utils/public.js';
export default {
	data() {
		return {};
	},
	methods: {
		privacyAgreement() {
			uni.navigateTo({
				url: './privacyAgreement'
			});
		},
		changePassword() {
			uni.navigateTo({
				url: './changePassword'
			});
		},
		// logOut(){
		// 	let postObj={
		// 		cache_key:uni.getStorageSync('userKey')
		// 	}
		// 	console.log(postObj,'postObjpostObj')
		// 	_methods.loginOut(postObj,'退出成功！')//退出登录
		// }
	}
};
</script>

<style lang="scss" scoped>
.bottoms {
	position: fixed;
	bottom: 180rpx;
	left: 50%;
	transform: translateX(-50%);
}
.versions {
	width: 100%;
	text-align: center;
	font-size: 24rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #c7c7c7;
}
.install-versions {
	margin-top: 20rpx;
	margin-bottom: 54rpx;
	width: 100%;
	text-align: center;
	font-size: 24rpx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #c7c7c7;
}
.custom-style {
	width: 670rpx;
	height: 100rpx;
	background: #e8e8e8;
	border-radius: 50rpx;
	line-height: 100rpx;
	font-size: 34rpx;
	font-family: PingFang SC;
	font-weight: bold;
	color: #7c7c7c;
}
.custom-style::after{
	border: none;
}
</style>

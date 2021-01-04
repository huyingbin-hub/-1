<template>
	<view>
		<u-cell-group :border="false">
			<u-cell-item title="隐私协议" @click="isProtocol(1)"></u-cell-item>
			<u-cell-item title="服务协议" @click="isProtocol(0)"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
		// 协议
		isProtocol(type) {
			uni.navigateTo({
				url: '/pages/protocol/protocol?type=' + type
			});
		},
		}
	}
</script>

<style>
</style>

<template>
	<view class="chose-xm">
		<view class="all">
			<view class="left">
				<view @click="choseXm(index,item)" :class="{active:xmIndex==index}" v-for="(item,index) in xmList" :key='index'>
					{{item.lb}}
				</view>
			</view>
			<view class="right">
				<view @click="choseXmchild(index,i)" :class="{active:xmChildactive==index}" v-for="(i,index) in xmList[xmIndex].child"
				 :key='index'>
					{{i.lb}}
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	export default {
		data() {
			return {

				xmIndex: 0,
				xmChildactive: 0,
				xmlist1: [],
				xmList: [

				],
				userKey: ''

			}
		},
		onShow() {
			//userKey//获取用户唯一标识
			this.userKey = uni.getStorageSync('userKey');
			this.list()
			var _this = this;
		},
		methods: {
			// 查询数据
			list() {
				this.$api.xmList().then(res => {
					console.log(res.data)

					if (res.data.event == '100') {
						this.xmList = res.data.data;
						console.log(res.data.data)
						uni.setStorageSync('xmData', this.xmList[0]);
						uni.setStorageSync('kmData', this.xmList[0].child[0])
					}
				})
			},
			
			//选择项目
			choseXm(index, xm) {
				uni.setStorageSync('xmData', xm);
				this.xmChildactive = 0;
				this.xmIndex = index;
			},
			
			//选择ke目
			choseXmchild(index, i) {
				this.xmChildactive = index;
				uni.setStorageSync('kmData', i);
				uni.switchTab({
					url: '/pages/one/index'
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}

	.chose-xm {
		height: 100%;

		.all {
			overflow: hidden;
			height: 100%;
			font-size: 12px;

			.left {
				float: left;
				margin-left: 5px;
				width: 120px;
				padding: 5px 20px 5px 0;
				font-weight: bold;
				height: 100%;
				position: relative;

				border-right: 1px solid #EEEEEE;

				view {
					padding-left: 20px !important;
					max-height: 20px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					margin: 10px 0;
					margin-bottom: 29px !important;

					&.active {
						color: #FF6900;
						border-left: 2px solid #FF6900;
					}
				}
			}

			.right {
				overflow: hidden;
				margin-left: 20px;
				padding-left: 20px;
				margin: 10px;

				view {
					margin: 10px 0;
					margin-bottom: 16px !important;

					&.active {
						color: #FF6900;
					}
				}
			}
		}
	}
</style>

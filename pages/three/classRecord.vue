<template>
	<view class="jl">
		<view class="dat-show">
			<view style="margin-top: 10px;">
				<scroll-view class="scroll-view_H" scroll-x="true" :scroll-with-animation="true" @scroll="scroll" scroll-left="0">
					<view @click="choseNow(index,item)" v-bind:class="{active:isactive==index}" class="scroll-view-item" v-for="(item,index) in recommendArr"
					 :key="index">
						<view class="title_level1">{{item.lb}}</view>
						<div class="line"></div>
					</view>
				</scroll-view>
			</view>
			<view class="list-all" v-if="list.length!=0">
				<!-- <view class="list-time">2020-04-01</view> -->
				<view class="list" @click="golook(i)" v-for="(i,index) in list" :key='index'>
					<view class="left">
						<text style="margin-right: 5px;color: #333333;">({{index+1}})</text>
						{{i.bt}}
					</view>
					<view class="right">
						<image style="width: 13px;height: 13px;vertical-align: middle;" src="../../static/right.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="no-data" v-if="list.length==0">
			<view style="width: 100%;text-align: center;">
				<image src="../../static/pic_blank.png"></image>
			</view>

			<text>您还没有听过过课程哟,赶快去听课吧～</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataShow: false,
				userKey: '',
				xmData: {},
				km_id: "",
				list: [],
				isactive: 0,
				recommendArr: [ // 推荐的商品

				]
			}
		},
		onShow() {
			//userKey
			const key = uni.getStorageSync('userKey');
			console.log(key, '---key')
			if (key) {
				this.userKey = key;

			}
			const xm = uni.getStorageSync('xmData');
			if (xm) {
				this.xmData = xm;
			}
			// 
			this.getKmlist();

		},
		methods: {
			golook(data) {
				uni.navigateTo({
					url: '/pages/one/lookDetails/index?id=' + data.kc_id + '&key=' + this.userKey
				});
			},
			//获取科目课程类型列表
			getKmlist() {
				this.$api.one.kmList({
					lb_id: this.xmData.id
				}).then(res => {
					if (res.data.event == '100') {
						this.recommendArr = res.data.list;
						this.km_id = res.data.list[0].id
						console.log(this.km_id, '----')
						this.listAll();
					}
				})
			},

			listAll() {
				// historyClass
				this.$api.three.historyClass({
					cache_key: this.userKey,
					lb_id: this.xmData.id,
					km_id: this.km_id,
					page: 1,
				}).then(res => {

					if (res.data.event != '100') {
						this.list = [];
					}
					if (res.data.event == '100') {
						this.list = res.data.list;
					}
				})
			},
			choseNow(index, data) {
				this.isactive = index;
				this.km_id = data.id;
				this.listAll()
			},
			// 横向滚动条滚动的距离
			scroll: function(e) {
				console.log(e)
				this.scrollTop = e.detail.scrollTop
			},
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.jl {
		.no-data {
			height: 100%;
			display: flex;
			flex-wrap: wrap;
			margin-top: 110px;
			justify-content: center;
			align-items: center;

			image {
				width: 99px;
				height: 106px;
			}

			text {
				font-size: 12px;
				color: #999999;
				margin-top: 10px;
			}
		}

		scroll-view ::-webkit-scrollbar {
			width: 0;
			height: 0;
			background-color: transparent;
		}

		.scroll-view_H {
			white-space: nowrap;
			overflow: hidden;
		}

		.scroll-view-item {
			max-width: 150rpx;
			overflow: hidden;
			// margin: 0 10px;
			padding: 4px 10px;
			height: 45rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			display: inline-block;
			/*text-overflow: ellipsis;
			  display: -webkit-box;
			  -webkit-line-clamp: 1;
			  -webkit-box-orient: vertical; */
			border-bottom: 1px solid #F8F8F8;

			.line {
				height: 1px;
			}

			&.active {
				color: #FF6900;

				.line {
					background-color: #FF6900;
					margin: 0 6px;
					margin-top: 7px;
				}
			}
		}

		.scroll-view-item:last-child {
			margin-right: 0;
		}

		.scroll-view-item image {
			width: 100%;
			height: 120rpx;
			border-radius: 10rpx;
		}

		.title_level1 {
			font-size: 12px;
		}

		.title_level2 {
			font-size: 24rpx;
			color: #C8C7CC;
		}

		.list-all {
			padding: 10px 16px;

			.list-time {
				font-size: 12px;
				color: #333333;
				margin: 10px 0;
			}

			.list {
				font-size: 12px;
				display: flex;
				justify-content: space-between;
				line-height: 35px;
				color: #999999;

				.left {
					width: 220px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.right {}
			}
		}
	}
</style>

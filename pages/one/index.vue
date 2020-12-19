<template>
	<view class="content">
		<view class="bg" @click="drawerNo" v-if="drawerShow"></view>
		
		<!--选项目弹框 属性 direction：left(默认右往左滑动) right(左往右滑动)-->
		<view class="xm-chose">
			<drawer :show="drawerShow" direction="right">
				<view class="all" v-if="drawerShow">
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
			</drawer>
		</view>

		<!--返回顶部-->
		<view class="wrap">
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>

		<!--内容-->
		<view class="chose-content">
			<view @tap="shownow">
				<text class="xm" style="vertical-align: middle;">{{xmData.lb}}
				</text>
				<text style="font-size: 20px;
					vertical-align: middle;
					margin-left: 5px;
					color: #999999;">></text>
			</view>
			<view class="chose">
				<text>{{kmChose}}</text>
			</view>
		</view>
		<view style="">
			<scroll-view id="scrollBody" class="scroll-view_H" scroll-x="true" :scroll-with-animation="true" lower-threshold='60'
			 @scroll="scroll" scroll-left="0">
				<view @click="choseNow(index,item)" v-bind:class="[{active:isactive==index},{active1:isactive2}]" class="scroll-view-item"
				 v-for="(item,index) in kcList" :key="index">
					<view class="title_level1">{{item.lb}}</view>
					<div class="line"></div>
				</view>
			</scroll-view>
		</view>

		<!--课程内容-->
		<view class="box" v-bind:class="{active:isactive1}">
			<view @click="godetails(i)" class="class-details" v-for="(i,index) in classList" :key='index'>
				<view class="class-img">
					<image :src="i.pic"></image>
				</view>
				<view class="class-info">
					<view class="title">{{i.bt}}</view>
					<view class="info">
						<text>共{{i.kcmlNum}}个章节</text>
						<text>主讲：{{i.teacher}}</text>
					</view>
					<view class="number">
						<view class="people-num">
							<image src="../../static/tab03.png"></image>
							<text>{{i.xx_rs}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="no-login" v-if="classList.length==0&&userKey!=''">
			<view>
				<view style="width: 100%;text-align: center;">
					<image src="../../static/pic_blank.png"></image>
				</view>
				<text>暂时无课程哦~</text>
			</view>
		</view>

		<!-- 付款弹窗 -->
		<view class="buy">
			<uni-popup class="model-km" ref="popupBuy" type="bottom">
				<view class="km-content" style="background-color: #FFFFFF;width: 100%;">
					<view class="buy-content">
						<view style="color: red;font-size: 16px;width: 100%;text-align: center;">￥{{buyData.price}}</view>
						<view style="width: 100%;text-align: center;font-size: 14px;margin: 10px 0;white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;">订单信息：
							<text style="color: #999999;">{{buyData.bt}}</text>
						</view>

					</view>
					<button class='config-buy' @click="configBuy" style="font-size: 16px;">立即支付</button>
				</view>
			</uni-popup>
		</view>
		<view v-if='showLoad' style="width: 100%;text-align: center;">
			<image style="width: 40px;height: 40px;margin: 10px 0;" src="../../static/loading.gif"></image>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		data() {
			return {
				index: 0,
				// showHd:true,
				showLoad: false,
				buyData: {},
				isactive1: false,
				isactive2: false,
				code: '',
				phone: '',
				userInfoAll: {},
				userKey: '',
				xmData: {
					lb: ''
				}, //项目信息
				kmData: [], //科目信息
				kmList: [], //科目信息
				kmChosedata: {},
				kmChose: '', //选择的科目
				kcList: [], //课程类别信息
				kcChosedata: {}, //选择课程类别信息
				classData: {
					lb_id: '',
					km_id: '',
					kclx: '',
					page: 1
				}, //课程参数
				classList: [], //课程列表
				dateShow: false,
				drawerShow: false,
				scrollTop: 0,
				title: 'Hello',
				isactive: '',
				kmactive: '',
				xmDetails: ['备考导学课', '备考导学课', ],
				xmIndex: 0,
				xmChildactive: 0,
				phone: "",
				xmList: [],
				system: '',
				total: 10, //通过total来判断是否加载完成
				loading: false, //正在加载中
				loadingok: false, //加载完成
				page: 1,
				type: '4',
			}
		},
		/*
		监听用户下拉到底
		 */
		async onReachBottom() {
			this.showLoad = true;
			this.page++;
			this.classData = {
					lb_id: this.xmData.id,
					km_id: this.kmChosedata.id,
					kclx: this.kcChosedata.id,
					page: this.page
				}, //课程参数
				this.$api.one.classList(this.classData).then(res => {
					if (res.data.event == '100') {
						this.classList = this.classList.concat(res.data.data);
						this.showLoad = false;
					}
				})
		},
		/* asynconPageScroll(){
			console.log('滚动---')
		}, */
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数

		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
			// console.log('滚动---')
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog,
		},

		onShow() {
			this.isactive = '';
			//如果用户登陆过
			const userinfoAll = uni.getStorageSync('userInfoAll');
			this.userInfoAll = userinfoAll;
			this.phone = this.userInfoAll.user_phone
			//userKey//获取用户唯一标识
			this.userKey = uni.getStorageSync('userKey');
			this.oneData();
			var _this = this;
			//获取设备信息
			uni.getSystemInfo({
				success: function(res) {
					_this.system = res.platform
				}
			});
		},
		onReady() {

		},
		methods: {

			// 立即支付
			configBuy() {
				this.$api.pay({
					kc_id: this.buyData.id,
					total_fee: this.buyData.price,
					openid: this.userInfoAll.openid,
					cache_key: this.userKey
				}).then(res => {
					if (res.data.event == '100') {
						this.payData = res.data.data;
						this.goPay(this.payData)
					}
				})
			},

			// 支付数据加流程
			goPay(data) {
				var _this = this;
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: data.timeStamp,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType,
					paySign: data.paySign,
					success: function(res) {
						console.log('success:' + JSON.stringify(res));
						_this.$refs.popupBuy.close();
						uni.showToast({
							title: '支付成功',
							duration: 2000
						});
						uni.switchTab({
							url: '/pages/two/index?index=' + _this.isactive
						});
					},
					fail: function(err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			},

			//获取选择的科目
			oneData() {
				const km = uni.getStorageSync('kmData');
				if (km) {
					this.kmData = km;
				}
				this.kmChose = this.kmData.lb;
				this.kmChosedata = this.kmData;
				//获取选择的项目
				const xm = uni.getStorageSync('xmData');
				if (xm) {
					this.xmData = xm;
				}
				this.getKmlist();
			},

			//获取项目列表
			list() {
				this.$api.xmList().then(res => {
					if (res.data.event == '100') {
						this.xmList = res.data.data;
					}
				})
			},

			//获取科目课程类型列表
			getKmlist() {
				this.$api.one.kmList({
					lb_id: this.xmData.id
				}).then(res => {
					if (res.data.event == '100') {
						this.kmList = res.data.list;

						this.kcList = res.data.kclx;
						this.kcChosedata = this.kcList[0];
						this.classlist()

					}
				})
			},

			// 获取课程数据
			classlist() {
				this.page = 1;
				this.classData = {
						lb_id: this.xmData.id,
						km_id: this.kmChosedata.id,
						kclx: this.kcChosedata.id,
						page: this.page
					}, 
					this.$api.one.classList(this.classData).then(res => {
						if (res.data.event == '100') {
							this.classList = res.data.data;
						}
					})
			},

			//去详情页
			godetails(data) {
				if (this.userKey == '') {
					uni.showToast({
						title: '请去“我”页面登录~',
						duration: 2000,
						icon: 'none'
					});
					return false;
				}
				if (data.is_sy != '2' && this.system != 'ios') {
					this.buyData = data;
					this.$refs.popupBuy.open();
					return false;
				}
				let url='/pages/one/lookDetails/index?id=' + data.id + '&key=' + this.userKey + '&phone=' + this.phone
				console.log({url},'url')
				uni.navigateTo({
					url: url
				});
			},

			//选择项目
			choseXm(index, data) {
				this.xmChildactive = 0;
				this.isactive = 0;
				this.xmIndex = index;
			},

			//选择科目
			choseXmchild(index, i) {
				this.xmData = this.xmList[this.xmIndex];
				uni.setStorageSync('xmData', this.xmData);
				this.xmChildactive = index;
				uni.setStorageSync('kmData', i);
				this.isactive = 0;
				this.drawerShow = false;
				this.oneData()
			},

			// 显示选择科目弹窗
			drawerNo() {
				this.drawerShow = false;
			},

			//显示抽屉     
			shownow() {
				this.drawerShow = true;
				this.list()
			},
	
			// 横轴滑动科目点击事件
			choseNow(index, data) {
				this.kcChosedata = data;
				this.isactive = index;
				this.classlist()
			},
			
			// 横向滚动条滚动的距离
			scroll(e) {
				console.log(e)
				this.scrollTop = e.detail.scrollTop
			},
			scrolltoupper(e) {
				console.log(e, '滚动----')
				// this.scrollTop = e.detail.scrollTop
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {}

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
		display: inline-block;
		// margin-right: 20rpx;
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

	page {
		height: 100%;
	}

	.content {
		.hd {
			button {
				background-color: #FFFFFF;
				color: #000;
				position: fixed;
				height: 240px;
				width: 65%;
				// height: 40%;
				top: 25%;
				left: 0px;
				right: 0px;
				margin-left: auto;
				margin-right: auto;
				z-index: 200;
				opacity: 0;
			}

			image {
				position: fixed;
				width: 70%;
				top: 27%;
				left: 0px;
				right: 0px;
				margin-left: auto;
				margin-right: auto;

			}

			text {
				position: fixed;
				/* bottom: 57px; */
				color: #999999;
				background: #fff;
				width: 24px;
				height: 24px;
				line-height: 20px;
				border-radius: 50%;
				text-align: center;
				font-size: 16px;
				/* right: 5%; */
				margin-left: -20px;
				opacity: 0.5;
				z-index: 20000;
				top: 27%;
				right: 73px;
			}
		}

		color: #333333;
		position: relative;
		height: 100%;

		.buy {
			.buy-content {
				padding: 20px 20px 0 20px;
				height: 40px;
			}

			.config-buy {
				margin-top: 30px;
				color: #FFFFFF;
				width: 90%;
				height: 30px;
				line-height: 30px;
				background-color: #FF6900;
				border-radius: 22px;
			}
		}

		.bg {
			height: 100%;
			position: absolute;
			top: 0;
			bottom: 0;
			width: 100%;
			background-color: #000;
			opacity: 0.6;
			z-index: 10;

		}

		.no-login {
			display: flex;
			margin-top: 100px;
			width: 100%;
			justify-content: center;

			image {
				width: 99px;
				height: 106px;
			}

			text {
				margin-top: 10px;
				font-size: 12px;
				color: #999999;
			}

			button {
				width: 115px;
				height: 30px;
				line-height: 30px;
				font-size: 14px;
				background: #FF6900;
				border-radius: 2px;
				margin-top: 10px;
				color: #FFFFFF;
			}
		}

		.model-km {
			.km-content {
				padding-bottom: 10px;

				.title {
					font-size: 14px;
					margin-left: 16px;
					padding-top: 10px;
				}

				.km-list {
					display: flex;
					width: 100%;
					flex-wrap: wrap;
					padding: 10px 18px;
					margin: 0 -10px;

					.km-text {
						font-size: 12px;
						width: 20%;
						line-height: 26px;
						margin: 5px 6px;
						text-align: center;
						display: inline-block;
						border: 1px solid #EEEEEE;

						&.activekm {
							color: #FFFFFF;
							background-color: #FF6900;
						}
					}
				}

				.config-km {
					margin: 10px 18px;
					color: #FFFFFF;
					width: 90%;
					background-color: #FF6900;
					border-radius: 22px;

				}
			}
		}

		.xm-chose {
			.all {
				overflow: hidden;
				height: 100%;
				font-size: 14px;

				.left {
					float: left;
					width: 120px;
					padding: 5px 20px 5px 0;
					margin-left: 5px;
					height: 100%;
					position: relative;
					border-right: 1px solid #EEEEEE;

					view {
						padding-left: 20px !important;
						height: 20px;
						overflow: hidden;
						margin-bottom: 29px !important;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
						font-weight: bold;
						margin: 10px 0;

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

		.chose-content {
			padding: 15px;
			display: flex;
			justify-content: space-between;

			.xm {
				font-size: 18px;
			}

			.chose {
				font-size: 12px;

				width: 140px;
				height: 20px;
				line-height: 20px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
				text-align: right;

				text {
					margin-right: 5px;
				}

				image {
					width: 12px;
					height: 12px;
					vertical-align: middle;
					display: inline-block;
				}
			}
		}

		.box {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 20px;

			&.active {
				opacity: 0;
			}
		}

		.class-details {
			background-color: #FFFFFF;
			width: 45.5%;
			margin-left: 3%;
			margin-top: 20px;
			border-radius: 5px;
			box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.15);

			.class-img {

				image {
					width: 100%;
					border-radius: 5px;
					height: 95px;
				}
			}

			.class-info {
				padding: 10px;

				.title {
					font-size: 12px;
					width: 100%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.info {
					display: flex;
					justify-content: space-between;

					text {
						font-size: 8px;
						color: #999999;
						line-height: 25px;
					}
				}

				.number {
					display: flex;
					justify-content: space-between;

					.people-num {
						image {
							width: 14px;
							height: 14px;
							margin-right: 5px;
							vertical-align: middle;
						}

						text {
							font-size: 8px;
							color: #999999;
						}
					}

					.state {
						color: #F54130;
						font-size: 10px;
						line-height: 25px;
					}
				}
			}
		}
	}
</style>

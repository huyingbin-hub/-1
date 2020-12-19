<template>
	<view class=" two">
		<!--顶部部分-->
		<!--  -->
		<view class="bg" @click="drawerClick" v-if="drawerShow"></view>
		<view class="content">
			<!--顶部选科目弹框-->
			<uni-popup class="model-km" ref="popup" type="top">
				<view class="km-content" style="background-color: #FFFFFF;width: 100%;">
					<view class="title">科目</view>
					<view class="km-list">
						<view v-bind:class="{ activekm: kmactive == index }" @click="choseKm(index, item)" v-for="(item, index) in kmList" :key="index" class="km-text">
							{{ item.lb }}
						</view>
					</view>
					<button class="config-km" @click="config">确定</button>
				</view>
			</uni-popup>
			<!--选项目弹框-->
			<view class="xm-chose">
				<!--属性 direction：left(默认右往左滑动) right(左往右滑动)-->
				<drawer :show="drawerShow" direction="right">
					<view class="all" v-if="drawerShow">
						<view class="left">
							<view @click="choseXm(index, item)" :class="{ active: xmIndex == index }" v-for="(item, index) in xmList" :key="index">{{ item.lb }}</view>
						</view>
						<view class="right">
							<view @click="choseXmchild(index, i)" :class="{ active: xmChildactive == index }" v-for="(i, index) in xmList[xmIndex].child" :key="index">
								{{ i.lb }}
							</view>
						</view>
					</view>
				</drawer>
			</view>
			<!--返回顶部-->
			<view class="wrap"><u-back-top :scroll-top="scrollTop"></u-back-top></view>

			<!--内容-->
			<view class="chose-content">
				<view @tap="show">
					<text class="xm" style="vertical-align: middle;">{{ xmData.lb }}</text>

					<text
						style="font-size: 20px;
					vertical-align: middle;
					margin-left: 5px;
					color: #999999;"
					>
						>
					</text>
				</view>
				<view class="chose">
					<text>{{ kmChose }}</text>
				</view>
			</view>
			<view style="">
				<scroll-view class="scroll-view_H" scroll-x="true" :scroll-with-animation="true" @scroll="scroll" scroll-left="0">
					<view @click="choseNow(index, item)" v-bind:class="{ active: isactive == index }" class="scroll-view-item" v-for="(item, index) in kcList" :key="index">
						<view class="title_level1">{{ item.lb }}</view>
						<div class="line"></div>
					</view>
				</scroll-view>
			</view>
		</view>

		<!--返回顶部-->
		<view class="wrap"><u-back-top :scroll-top="scrollTop1"></u-back-top></view>

		<!-- 提示用户登录注册 -->
		<view class="no-data" v-if="myclassList.length == 0 && userKey.length > 0">
			<image src="../../static/pic_blank.png"></image>
			<text>您还没有购买过课程哟～</text>
		</view>
		<!--没登录时-->
		<view class="no-login" v-if="userKey == null || userKey == undefined || userKey.length <= 0">
			<view>
				<view style="width: 100%;text-align: center;"><image src="../../static/pic_blank.png"></image></view>
				<text>注册,登陆后才能学习课程哦~</text>
				<!-- #ifdef MP-WEIXIN -->
				<button
					style="background-color: #FFFFFF;color: #000;"
					open-type="getPhoneNumber"
					v-if="phone == null || phone == undefined || phone.length <= 0"
					@getphonenumber="getPhoneNumber"
					withCredentials="true"
				>
					立即注册
				</button>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="getUserInfo" v-else @getuserinfo="wxGetUserInfo" withCredentials="true">立即登录</button>
				<!-- #endif -->
				<!-- #ifdef MP-TOUTIAO -->
				<button open-type="getUserInfo" v-if="phone == null || phone == undefined || phone.length <= 0" @click="ttGetUserInfo" withCredentials="true">立即登录</button>
				<!-- #endif -->
			</view>
		</view>

		<view class="content1" v-if="userKey.length > 0 && myclassList.length != 0">
			<view class="content-list" v-for="(i, index) in myclassList" :key="index">
				<view class="content-img">
					<image :src="i.pic"></image>
					<view>{{ i.teacher }}</view>
				</view>
				<view class="content-text">
					<view class="title">{{ i.bt }}</view>
					<text class="content">{{ i.lb }}</text>
					<text style="font-size: 10px;color: #999999;margin-left: 10px;">已学章节：{{ i.xx_num }}</text>

					<view class="info">
						<view class="left">
							<image src="../../static/icon_course_people.png"></image>
							<text>观看人数： {{ i.xx_rs }}</text>
						</view>

						<button @click="look(i)">立即观看</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
export default {
	data() {
		return {
			xmData: {
				lb: ''
			},
			kmData: {},
			userInfoAll: '',
			scrollTop1: 0,
			userKey: '',
			kmList: [], //科目信息
			kmChose: '',
			kmChosedata: {},
			kcList: [], //课程类别信息
			kcChosedata: {},
			myclassData: {
				cache_key: '',
				lb_id: '',
				km_id: '',
				page: ''
			},
			phone: '',
			myclassList: [],
			nodataShow: false,
			drawerShow: false,
			scrollTop: 0,
			title: 'Hello',
			isactive: '',
			kmactive: '',
			xmDetails: ['备考导学课', '备考导学课'],
			xmIndex: 0,
			xmChildactive: 0,
			xmList: [
				{
					title: '建筑工程',
					list: [
						{
							content: '一级建造师'
						},
						{
							content: '二级建造师'
						}
					]
				},
				{
					title: '建筑工程1',
					list: [
						{
							content: '一级建造师2'
						},
						{
							content: '二级建造师2'
						}
					]
				},
				{
					title: '消防安全',
					list: [
						{
							content: '一级建造师1'
						},
						{
							content: '二级建造师1'
						}
					]
				}
			]
		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	components: {
		uniPopup,
		uniPopupMessage,
		uniPopupDialog
	},

	onShow() {
		console.log('onShow');
		this.isactive = '';
		//如果用户登陆过
		const userinfoAll = uni.getStorageSync('userInfoAll');
		//获取用户唯一标识
		this.userInfoAll = userinfoAll;
		this.phone = this.userInfoAll.user_phone || '';
		console.log(this.phone);
		//userKey
		this.userKey = uni.getStorageSync('userKey');
		this.oneData();
	},

	onLoad: function(option) {
		//option为object类型，会序列化上个页面传递的参数
		console.log(option, 'canshu----');
		this.isactive = option.index;
	},

	methods: {
		// 立即观看 跳转视频界面
		look(data) {
			uni.navigateTo({
				url: '/pages/one/lookDetails/index?id=' + data.id + '&key=' + this.userKey
			});
		},

		getPhoneNumber(e) {
			console.log({ e });
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				console.log('用户点击了接受', e);

				this.getPhone(e);
			} else {
				console.log('用户点击了拒绝');
			}
		},

		//获取手机号
		getPhone(e) {
			var _this = this;
			uni.login({
				provider: 'weixin',
				success: function(res) {
					_this.code = res.code;
					_this.$api
						.getPhone({
							code: _this.code,
							encryptedData: e.detail.encryptedData,
							iv: e.detail.iv
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
								/* uni.setStorageSync('phone',  res.data.data);
								_this.phone= uni.getStorageSync('phone'); */
								_this.phone = res.data.data;
								uni.setStorage({
									key: 'userInfoAll',
									data: {
										user_phone: res.data.data
									}
								});
								console.log('获取手机号的信息', _this.phone);
							}
						});
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
							that.xcxGetgetUserInfo(code, res.userInfo); //小程序getUserInfo 综合
						}
					});
				}
			});
		},

		// 微信登录发请求  存数据
		nowLogin(e) {
			console.log(this.phone, '9999');
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
							_this.getUserKey(e.detail, code, '15136298700'); // 获取用户标识
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
					userList.user_pic = userInfo.avatarUrl; //头像
					userList.user_nickname = userInfo.nickName; //名称
					userList.user_phone = '15136298700'; //手机号
					userList.user_gender = userInfo.gender; //性别
					userList.country = userInfo.country; //国家
					userList.city = userInfo.city; //城市
					userList.province = userInfo.province; //地区
					uni.setStorageSync('userInfoAll', userList);
					if (userList) {
						_this.userInfoAll = userList;
						_this.phone = userList.user_phone;
					}
					_this.reserveUserInfo(userList); //存储用户信息
					_this.userKey = res.data.data.cache_key;
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

		// 存储小程序用户信息
		reserveUserInfo(data) {
			console.log(data, '存储信息');
			let dataLists = {
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
				console.log(res.data);

				if (res.data.event == '100') {
					this.xmList = res.data.data;
					// uni.setStorageSync('xmData',this.xmList[0]);
				}
			});
		},

		//获取科目课程类型列表
		getKmlist() {
			this.$api.one
				.kmList({
					lb_id: this.xmData.id
				})
				.then(res => {
					console.log(res.data);
					if (res.data.event == '100') {
						this.kmList = res.data.list;
						this.kcList = res.data.kclx;
						this.kcChosedata = this.kcList[0];
						this.getMyclass();
					}
				});
		},

		//获取我的课程列表
		getMyclass() {
			this.myclassData = {
				cache_key: this.userKey,
				lb_id: this.xmData.id,
				km_id: this.kmData.id,
				kclx: this.kcChosedata.id,
				page: 1
			};
			this.$api.two.myclassList(this.myclassData).then(res => {
				console.log(res.data);
				if (res.data.event == '100') {
					this.myclassList = res.data.data;
				} else {
					this.myclassList = [];
				}
			});
		},

		drawerClick() {
			this.drawerShow = false;
		},

		//选择项目
		choseXm(index, data) {
			uni.setStorageSync('xmData', data);
			this.xmChildactive = 0;
			this.xmIndex = index;
		},

		//选择子项目
		choseXmchild(index, i) {
			this.xmChildactive = index;
			uni.setStorageSync('kmData', i);
			this.isactive = 0;
			this.drawerShow = false;
			this.oneData();
		},

		//显示抽屉
		show() {
			this.list();
			this.drawerShow = true;
		},

		choseKm(index, data) {
			this.kmChosedata = data;
			this.kmactive = index;
		},

		choseNow(index, data) {
			this.kcChosedata = data;
			this.isactive = index;
			this.getMyclass();
		},
		// 横向滚动条滚动的距离
		scroll: function(e) {
			console.log(e);
			this.scrollTop = e.detail.scrollTop;
		},

		config() {
			this.kmChose = this.kmChosedata.lb;
			this.getMyclass();
			this.$refs.popup.close();
		},
		open() {
			this.$refs.popup.open();
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	height: 100%;
}

page {
	height: 100%;
}

.wrap {
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
	display: inline-block;
	// margin-right: 20rpx;
	border-bottom: 1px solid #f8f8f8;

	.line {
		height: 1px;
	}

	&.active {
		color: #ff6900;

		.line {
			background-color: #ff6900;
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
	color: #c8c7cc;
}

.content {
	color: #333333;

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
					border: 1px solid #eeeeee;

					&.activekm {
						color: #ffffff;
						background-color: #ff6900;
					}
				}
			}

			.config-km {
				margin: 10px 18px;
				color: #ffffff;
				width: 90%;
				background-color: #ff6900;
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
				border-right: 1px solid #eeeeee;

				view {
					padding-left: 20px !important;
					font-weight: bold;
					margin: 10px 0;
					margin-bottom: 29px !important;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;

					&.active {
						color: #ff6900;
						border-left: 2px solid #ff6900;
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
						color: #ff6900;
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
			height: 30px;
			text-align: right;
			width: 140px;
			height: 20px;
			line-height: 20px;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;

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
}

.two {
	color: #000;
	position: relative;
	height: 100%;

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
			background: #ff6900;
			border-radius: 2px;
			margin-top: 10px;
			color: #ffffff;
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

	.no-data {
		display: flex;
		flex-wrap: wrap;

		margin-top: 50px;
		justify-content: center;

		/*align-items: center; */
		image {
			width: 100px;
			height: 106px;
			display: block;
		}

		text {
			font-size: 14px;
			color: #999999;
			margin-top: 10px;
			width: 100%;
			text-align: center;
		}
	}

	.content1 {
		padding: 10px 16px;

		.content-list {
			box-shadow: 0px 4px 8px 4px rgba(0, 0, 0, 0.16);
			margin-bottom: 20px;
			padding: 12px 14px 12px 10px;
			border-radius: 5px;
			overflow: hidden;

			.content-img {
				align-items: center;
				vertical-align: middle;
				float: left;
				height: 100%;
				width: 15%;
				text-align: center;

				image {
					width: 35px;
					height: 35px;
					border-radius: 50%;
					margin-top: 5px;
				}

				view {
					font-size: 10px;
					margin-top: 5px;
				}
			}

			.content-text {
				padding-left: 10px;
				overflow: hidden;

				.title {
					font-size: 12px;
					font-weight: bold;
					max-width: 90%;
					height: 16px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.content {
					font-size: 12px;
					color: #999999;
					line-height: 30px;
				}

				.info {
					.left {
						display: inline-block;

						image {
							width: 12px;
							height: 12px;
						}

						text {
							font-size: 10px;
							color: #999999;
							margin-left: 5px;
						}
					}

					button {
						float: right;
						background-color: #ff6900;
						color: #ffffff;
						width: 80px;
						height: 24px;
						line-height: 23px;
						font-size: 12px;
					}
				}
			}
		}
	}
}
</style>

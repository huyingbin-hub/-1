<template>
	<view>
		<web-view style="height: 100vh;width: 100%;" :src="url"></web-view>
		<!-- <web-view :src="url">
		 <cover-view class="tool-bar">
		 <cover-view>我的</cover-view>
		 <cover-view>订单</cover-view>
		 </cover-view>
	 </web-view> -->

		<!--  <cover-view class="tool-bar">
	                <cover-image src="../../common/imgs/nav-bg.png" class="nav-bg"></cover-image> -->
		<!-- <cover-view class="tool-btn">
	                   <cover-view>我的</cover-view>
	                   <cover-view>订单</cover-view>
	               </cover-view>
	           </cover-view> -->

		<!-- <view class="look-details"> -->
		<!--无解锁时出现弹框-->
		<!-- <u-modal style='text-align: center;' class='model' v-model="show" width='500' :title-style="{color: '#fff'}">
			<image style="width: 227px;height: 135px;" src="../../../static/tanchuang.png"></image>
		</u-modal> -->
		<!--播放课程部分-->
		<!-- <view class="video" style="width: 100%;">
			<image :src="detailsKc.pic"></image>
			
			
			
		</view>
		 -->
		<!-- <view class="class-name"> 
			<view>{{detailsKc.bt}}</view>
			<view class="class-info">
				<text>科目类别：{{detailsKc.kmlb}}</text>
				<text>视频时长：{{detailsKc.ks_sj}}</text>
				<text>讲师：{{detailsKc.teacher}}</text>
			</view>
		</view>
		<view class="class-all">
			<view class="class-tab">
				<view class="mu" @click="choseTab(index)" :class="{active:isactive==index}" v-for="(item,index) in tabList" :key='index'>
					<text>{{item}}</text>
					<view class="line">
	
					</view>
				</view>
			</view>
			<view v-if="isactive=='0'">
			<view class="class-list"   v-for="(i,index) in kcMululist" :key='index'>
				<view class="list" @click="on_period_change(item)" v-for="(item,indet) in i.child" :key='indet'>
					<view class="name"  @click="choseClass(item,i,index)">
					<u-icon style='vertical-align: middle;' color='#FF6900' size='32' name='pause-circle'></u-icon>
					
						
						{{item.bt}}
						
					</view>
					<u-icon v-if='item.is_pay=="0"'  @click="lookClass" color='#999999' name='lock'></u-icon>
				</view>
				
				
			</view>
			</view>
			<view class="class-teacher" v-if="isactive=='1'">
				<view class="login">
					
					<view class="login-avatar">
						<image style='width: 50px;height: 50px;' :src="detailsKc.teacher_pic"></image>
					</view>
					
						<view class="login-now">
							<view>{{detailsKc.teacher}}</view>
							<text>资深授课老师</text>
						</view>
				</view>
				<view class="jianjie">{{detailsKc.ls_jj}}</view>
			</view>
		</view>
		<view class="class-button">
			<view class="zx">
				<image src="../../../static/question.png"></image>
				<text>咨询</text>
			</view>
			<view class="buy">
				立即购买
			</view>
		</view>
	</view> -->
	</view>
</template>

<script>
//  import child from './cmms/pt_player.js'
export default {
	data() {
		return {
			s: 'chuandezhi',
			tabList: ['课程目录', '主讲老师'],
			src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
			isactive: 0,
			show: false,
			kcId: '',
			userKey: '',
			detailsKc: '', //课程信息
			kcMululist: '', //课程目录列表
			video_info: {},
			choseClassTop: {},
			course_list: null,
			course_auth: false, //默认false false不可以播放 true可以播放
			course_auth_status: '', // a 免费课,需加入  b 收费课,需购买
			url: ''
		};
	},
	onLoad: function(option) {
		//option为object类型，会序列化上个页面传递的参数
		this.url = encodeURI(`https://caigua.zhongjianedu.com/zhongxuetangs/#/?kc_id=${option.id}&user_id=${option.key}&phone=${option.phone}`);
		//this.url = `http://localhost:8082/#/?kc_id=${option.id}&user_id=${option.key}&phone=${option.phone}`
		// this.url = `https://www.zjtaoke.cn/zhongxuetangs/index.html#/?kc_id=${option.id}&user_id=${option.key}&phone=${option.phone}`
		this.kcId = option.id;
		console.log(this.url, '-----');
		//http://localhost:8081/#/
		//获取到课程id

		//https://www.taoke4.com/zhongxuetang/#/
		//https://www.taoke4.com/zhongxuetang/#/
		// this.url=`http://localhost:8080/#/?id=${option.id}&user_id=${this.userKey}`
	},

	onShow() {
		//userKey
		const key = uni.getStorageSync('userKey');
		if (key) {
			this.userKey = key;
		}
		this.getKcdetails();
	},
	methods: {
		upvideo() {
			var aliOssParams = util.aliOssParams(); //主要是获取上传阿里云的加密策略policy和签名signature;以及上传自己要上传到阿里云的地址,当然还有自己阿里云accessid。
			//上传视频到阿里云
			var that = this;
			uni.chooseVideo({
				maxDuration: 10,
				success: function(res) {
					var tempFilePath = res.tempFilePath;
					var stringFilePath = String(tempFilePath);
					var indexType = stringFilePath.lastIndexOf('.');
					var type = stringFilePath.substring(indexType);
					var alikey = 'video/' + new Date().getTime() + Math.floor(Math.random() * 1000) + type; //随机1000内的数加上时间戳作为你存放在阿里云video目录下名字和类型。
					wx.uploadFile({
						url: aliOssParams.host,
						filePath: tempFilePath,
						name: 'file',
						formData: {
							name: tempFilePath,
							key: alikey, //这个是关键它是定义存放在阿里云那个目录下
							policy: aliOssParams.policy, //上传阿里云的加密策略
							OSSAccessKeyId: aliOssParams.aid, //自己阿里云的aid
							success_action_status: '200',
							signature: aliOssParams.signature //上传阿里云的签名
						},
						success: function(res) {
							var videoUrl = aliOssParams.host + '/' + alikey; //这就是
							//刚上传阿里云后的存放的地址链接，通过它打开你刚上传视频。
							that.videoUrl = videoUrl;
							console.log('that', that, videoUrl);
							wx.showToast({
								title: '上传成功',
								icon: 'success',
								duration: 1000
							});
						},
						fail: function({ errMsg }) {
							uni.showToast({
								title: '上传失败',
								duration: 1000
							});
						}
					});
				}
			});
		},
		getKcdetails() {
			this.$api.one
				.kcDtails({
					cache_key: this.userKey,
					kc_id: this.kcId
				})
				.then(res => {
					if (res.data.event == '105') {
						uni.showToast({
							title: '登录过期,请登录',
							icon: 'none'
						});
						try {
							uni.removeStorageSync('userInfoAll');
							uni.removeStorageSync('userKey');
						} catch (e) {
							// error
						}
						setTimeout(() => {
							uni.navigateBack({
							    delta: 1
							});
						},1000);
					}
					if (res.data.event == '100') {
						this.detailsKc = res.data.kcInfo;
						console.log(res.data.data);
						this.kcMululist = res.data.data;
						this.video_info = this.kcMululist[0].child[0];
					}
				});
		},
		choseClass(data, dataTop, index) {
			uni.navigateTo({
				url: '/pages/one/lookDetails/video?id=' + data.id + '&key=' + this.userKey + '&index=' + index
			});
			this.choseClassdata = data;
			this.choseClassTop = dataTop;
		},
		on_period_change(period) {
			console.log(period);
			this.video_info = period;
			if (this.course_auth_status == 'b' && period.free === '0') {
				return this.$toast('请购买后观看');
			}
			if (this.course_auth == false) {
				this.course_auth = true;
			}
			this.kcMululist.map((v, k) => {
				v.child.map((v, i) => {
					v.onplaying = false;
				});
			});
			period.onplaying = true;
		},
		//看课
		lookClass() {
			this.show = true;
		},

		choseTab(index) {
			this.isactive = index;
		}
	}
};
</script>

<style lang="scss" scoped>
.tool-bar {
	color: #fff;
	position: fixed;
	bottom: 13%;
	right: 0rpx;
	width: 136rpx;
	height: 236rpx;
	border-radius: 8rpx;
	z-index: 999999;
	/*box-shadow: 0px 0px 15px 4px  rgba(0,0,0,0.15);*/

	.nav-bg {
		width: 136rpx;
		height: 236rpx;
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		border-radius: 8rpx;
	}

	.tool-btn {
		width: 100rpx;
		height: 200rpx;
		position: absolute;
		top: 18rpx;
		left: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}
}
.look-details {
	.class-teacher {
		.jianjie {
			margin-top: 5px;
			font-size: 12px;
			line-height: 20px;
			white-space: 4px;
			padding-bottom: 46px;
		}
		.login {
			display: flex;
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

	.video {
		image {
			width: 100%;
			height: 211px;
		}
	}
	.class-name {
		padding: 10px 16px;
		color: #333333;
		font-size: 12px;
		line-height: 20px;
		.class-info {
			text {
				color: #999999;
				font-size: 10px;
				margin-right: 15px;
			}
		}
	}
	.class-all {
		.mu.active text {
			color: #ff6900 !important;
		}
		.mu.active .line {
			height: 2px;
			background-color: #ff6900;
			width: 10%;
			text-align: center;
			margin: 10px 45%;
		}
		padding: 10px 16px;
		.class-tab {
			display: flex;
			.mu {
				flex: 1;
				text-align: center;
				justify-content: center;
				align-items: center;
				text {
					color: #333333;
					font-size: 16px;
				}
				.line {
				}
			}
		}
		.class-list {
			padding-bottom: 46px;
			.list {
				display: flex;
				justify-content: space-between;
				.name {
					font-size: 12px;
					line-height: 30px;
					text {
						margin-right: 4px;
					}
				}
			}
		}
	}
	.class-button {
		position: fixed;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		.zx.active text {
			color: #ffffff !important;
		}
		.zx {
			width: 40%;
			float: left;
			height: 44px;
			text-align: center;
			background-color: #ffffff;
			border: 1px solid #eeeeee;
			image {
				width: 16px;
				height: 16px;
				margin-top: 5px;
			}
			text {
				font-size: 12px;
				color: #999999;
				display: block;
			}
		}
		.buy.active text {
			color: #ffffff !important;
		}
		.buy {
			height: 44px;
			line-height: 44px;
			overflow: hidden;
			width: 59%;
			border: 1px solid #ff6900;
			border-left: none !important;

			font-size: 16px;
			color: #ffffff;
			background-color: #ff6900;
			text-align: center;
		}
	}
}
</style>

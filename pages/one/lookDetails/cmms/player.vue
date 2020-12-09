<template>
	<div class="video-player">

		<div class="vidlogo" v-show="logo">
		</div>
		<!-- <div class="prism-player" id="player-pt" ref="player" v-if="pt_end"></div>-->
		<div class="prism-player" id="player-con" ref="player" ></div>
	</div>
</template>

<script>
	import './pt_player'
	export default {
		props: {
			//片头信息
			course_info: {
				type: Object,
				require: true,
				default:{}
			},
			//视频信息
			video_info: {
				type: Object,
				require: true,
				default:{}
			},
			//视频状态
			course_auth_status: {
				type: String,
				require: true,
				default:''
			},
		},
		data() {
			return {
				user: null,
				loading: false,
				player_ended: false,
				player_mask_timer: null,
				buy_timer: null,
				AccessKeyId: null,
				AccessKeySecret: null,
				SecurityToken: null,
				player: null,
				start_sj: null, //视频开始时间
				end_sj: null, //视频结束时间
				kj_jd: null, //课件进度
				setVolume: null,
				mediaType: 'video',
				yinpin: false,
				zyinpin: false,
				pt_player: null,
				pt_url: null,
				type_num: '1',
				logo: false,
				pt_end: false,
			};
		},
		methods: {
			//创建片头视频
			create_pt_player() {
				//改变下this指向
				let that = this
				that.pt_player = new Aliplayer({
					id: "player-pt",
					width: "100%",
					height: "11.3rem",
					autoplay: false,
					isLive: false,
					rePlay: false,
					playsinline: true,
					preload: true,
					controlBarVisibility: "hover",
					useH5Prism: true,
					cover: that.course_info.pic,
					vid: that.course_info.pt_url,
					accessKeyId: that.AccessKeyId,
					securityToken: that.SecurityToken,
					accessKeySecret: that.AccessKeySecret,
					region: 'cn-shanghai', //eu-central-1,ap-southeast-1
					skinLayout: [{
							"name": "bigPlayButton",
							"align": "blabs",
							"x": 30,
							"y": 80
						},
						{
							"name": "H5Loading",
							"align": "cc"
						},
						{
							"name": "errorDisplay",
							"align": "tlabs",
							"x": 0,
							"y": 0
						},
						{
							"name": "infoDisplay"
						},
						{
							"name": "tooltip",
							"align": "blabs",
							"x": 0,
							"y": 56
						},
						{
							"name": "thumbnail"
						},
						{
							"name": "controlBar",
							"align": "blabs",
							"x": 0,
							"y": 0,
							"children": []
						}
					]
				}, function(player) {
					player.on('ended', (e) => {
						player.dispose()
						that.pt_end = false
						that.get_video();
					});
				});
			},
			//创建视频
			create_player() {
				//改变下this指向
				let that = this
				that.loading = true;
				that.player_ended = false;
				that.player = new Aliplayer({
					id: "player-con",
					width: "100%",
					height: "11.3rem",
					isLive: false,
					// rePlay: false,
					autoplay: false,
					isLive: false,
					mediaType: that.mediaType,
					cover: that.course_info.pic,//视频封面图
					vid: that.video_info.url,//视频url
					accessKeyId: that.AccessKeyId,
					securityToken: that.SecurityToken,
					accessKeySecret: that.AccessKeySecret,
					region: 'cn-shanghai', //eu-central-1,ap-southeast-1
					components: that.get_components()
				}, function(player) {
					//设置清晰度
					player.on('sourceloaded', function(params) {
						let paramData = params.paramData
						let desc = paramData.desc
						let definition = paramData.definition
						player.getComponent('QualityComponent').setCurrentQuality(desc, definition)
					})
					player.on('ready', (e) => {
						player.play();
						player.setVolume(0.6)
						//当课件进度小于视频总时长进行定位
						if (that.video_info.kj_jd < player.getDuration()) {
							player.seek(parseInt(that.video_info.kj_jd))
						}
						that.start_sj = (new Date()).valueOf();
					});
					player.on('play', () => {
						if (that.video_info.is_logo == '1') {
							that.logo = true
						}
						if (that.mediaType == 'audio') {
							that.yinpin = true
							that.zyinpin = false
						}
						//点击播放按钮时启动定时器
						that.buy_timer = setInterval(() => {
							that.kj_jd = player.getCurrentTime()
							if (that.kj_jd == 299) {
								that.player_ended = true;
							}
						}, 1000)
					})
					player.on('pause', () => {
						that.end_sj = (new Date()).valueOf();
						if (that.mediaType == 'audio') {
							that.yinpin = false
							that.zyinpin = true
						}
						//视频暂停清除定时器
						clearInterval(that.buy_timer)
					})
					player.on('ended', () => {
						// 视频播放结束清除定时器
						clearInterval(that.buy_timer)
						that.yinpin = false
						that.zyinpin = false
						that.kj_jd = player.getCurrentTime();
						that.end_sj = (new Date()).valueOf();
						that.player_ended = true;
					})
				});
			},
			//获取视频信息
			get_video() {
				this.$api.PlayAutha({}).then(res => {
					this.AccessKeyId = res.data.data.AccessKeyId
					this.AccessKeySecret = res.data.data.AccessKeySecret
					this.SecurityToken = res.data.data.SecurityToken
					this.create_player()
				})
			},
			//获取片头视频信息
			get_pt_video() {
				this.$api.PlayAutha({}).then(res => {
					this.AccessKeyId = res.data.data.AccessKeyId
					this.AccessKeySecret = res.data.data.AccessKeySecret
					this.SecurityToken = res.data.data.SecurityToken
					this.create_pt_player()
				})
			},
			getTime() {
				this.end_sj = (new Date()).valueOf();
			},
			get_components() {
				let component, that = this
				//2019/08/26 改为试看前两节 先注了防止以后再改回来
				//当视频为收费未购买的时候状态为b,启用试看功能
				// {
				//     name: 'PreviewVodComponent',
				//     type: AliPlayerComponent.PreviewVodComponent,
				//     args: [300, '#endPreviewTemplate', `<span class="vip-join" style="color: #91d5ff">购课方式  全国免费电话,400-8787-501</span>`]
				//   },
				switch (that.video_info.is_ad) {
					case '0':
						component = [{
							name: 'QualityComponent',
							type: AliPlayerComponent.QualityComponent
						}]
						break
					case '1':
						component = [{
							name: 'QualityComponent',
							type: AliPlayerComponent.QualityComponent
						}]
				}
				return component
			},
			//双击屏幕暂停
			suspend() {
				let that = this
				that.player.getStatus() == "playing" ? that.player.pause() && clearInterval(that.buy_timer) : that.player.play()
			},
			//添加播放记录
			save_record() {
				this.$api.trainOne.update_play_history({
					// kc_id: this.course_info.id,
					// kcml_id: this.video_info.id,
					// zt: '0',
					user_id: this.user.user_id,
					kc_id: this.video_info.kc_id,
					kj_id: this.video_info.id,
					kj_zt: this.kj_zt || '0',
					start_sj: this.start_sj,
					end_sj: this.end_sj,
					kj_jd: this.kj_jd,
					lx: 'Web',
					bfsd: '1.0',
				});
			},
		},
		watch: {
			video_info: {
				deep: true,
				handler(newval) {
					this.getTime()
					//视频地址改变的时候清除定时器
					clearInterval(this.buy_timer)
					this.save_record()
					//切换地址销毁上个视频，防止覆盖
					this.yinpin = false
					this.zyinpin = false
					this.logo = false
					this.pt_end = true;
					if(this.player != null){
						this.player.dispose();
					}
					
					//this.get_pt_video();
					this.get_video();
				},
			},
		},

		created() {
		
			if (this.course_info.bt.indexOf('语音') != -1) {
				this.mediaType = 'audio'
			} else {
				this.mediaType = 'video'
			}

		},
		async mounted() {
			try {
				const value = uni.getStorageSync('objList');
				if (value) {
					this.user = value
				}
			} catch (e) {
				// error
			}

		},
		beforeDestroy() {
			//页面销毁清除定时器
			if (this.player) {
				clearInterval(this.buy_timer)
				this.player.dispose()
				this.getTime()
				this.save_record()
			}
		},
	};
</script>

<style scoped lang="scss">
	/deep/ .prism-player {
		background-color: rgba(25, 25, 25, 0);
	}

	/deep/ .prism-player .prism-controlbar {
		background-color: rgba(25, 25, 25, 0.6);
	}

	/deep/ #player-pt {
		.prism-controlbar {
			background-color: rgba(25, 25, 25, 0) !important;
		}
	}

	/deep/ .prism-player video {
		left: 0% !important;
		top: 0% !important;
		transform: translate(0%, 0%) !important;
		height: auto !important;
		z-index: -1;
	}

	/deep/ .prism-player .prism-controlbar .prism-controlbar-bg {
		background: none;
	}

	/deep/ .prism-player .prism-big-play-btn {
		width: 80upx;
		height: 80upx;
		bottom: 43% !important;
		left: 43% !important;
	}

	/deep/ .prism-player .prism-big-play-btn .outter {
		border: 7upx solid rgba(255, 255, 255, .51);
		width: 80upx;
		height: 80upx;
		border-radius: 100%;
		position: absolute;
		box-sizing: border-box;
		top: 0;
		left: 0;
	}

	.video-player {
		position: relative;

		.loading {
			position: absolute;
			z-index: 999;
			top: 0;
			left: 0;
			width: 100%;
			height: 432upx;
		}

		.player {
			height: 213upx;
			border-radius: 5upx 5upx 0 0;
			overflow: hidden;
			background: no-repeat scroll center center /cover;
		}

		.video-info {
			padding: 20upx 20upx 16upx;

			.count {
				&>span:not(:first-child) {
					margin-left: 15upx;
				}
			}
		}
	}

	.player-tools {
		bottom: 270upx;

		button {
			color: #bdbdbd;
			background-color: transparent;
			border: none;
			outline: none;
			font-size: 17upx;

			.fa {
				font-size: 29upx;
				color: #828282;
				vertical-align: -5upx;
			}

			&:disabled {
				color: #666;

				.fa {
					color: #666;
				}
			}
		}
	}

	.yinpin {
		top: 26%;
		position: absolute;
		left: 36%;
		z-index: 999;

		image {
			width: 200upx;
			height: 200upx;
		}
	}

	.vidlogo {
		width: 90upx;
		position: absolute;
		right: 3%;
		top: 4%;
		z-index: 999;

		image {
			width: 100%;
			height: 60upx;
		}
	}

	.yinpin {
		width: 200upx;
		height: 200upx;
		top: 26%;
		position: absolute;
		left: 36%;
		z-index: 999;

		image {
			width: 200upx;
			height: 200upx;
		}
	}
</style>

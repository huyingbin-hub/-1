<template>
    <view class="login">
        <view>
            <form @submit="formSubmit" @reset="formReset">
                <view class="uni-form-item">
					<image src="../../static/phone.png"></image>
                    <input style="margin-bottom: 6px;" class="uni-input" name="input" placeholder="请输入手机号" />
                </view>
				<view class="uni-column">
					<view style="display: flex;">
						<image src="../../static/code.png"></image>
						<input class="uni-input" name="code" placeholder="请输入验证码" />
					</view>
					<button v-if="isShowCode" @click="getCode" class="verificationCode">
						{{reGet}}
					</button>
					<button v-else class="verificationCode">{{daojishi}}s</button>
				</view>
                <view class="uni-btn-v">
                    <button form-type="submit">登陆</button>
					<text>未注册用户登陆默认为中课堂注册会员</text>
                </view>
            </form>
        </view>
		<view class="tiaokuan">
			《中课堂服务条款》
		</view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
			isShowCode:true,
			reGet:"获取验证码",
			daojishi:"60"
            }
        },
		onReady() {
					
				},
        methods: {
            formSubmit: function(e) {
                console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
                var formdata = e.detail.value
                uni.showModal({
                    content: '表单数据内容：' + JSON.stringify(formdata),
                    showCancel: false
                });
            },
            formReset: function(e) {
                console.log('清空数据')
            },
			// 获取验证码
			getCode:function(){
				//获取验证码倒计时
				var time = 60;
				this.isShowCode = false;
				var timer = setInterval(()=>{
					time--;
					this.daojishi = time;
						if(time === 0){
							clearInterval(timer);
							this.isShowCode = true;
							this.reGet = '重新获取';
							this.daojishi=60
						}
					},1000)
				}
        }
    }
</script>

<style lang="scss">
    .uni-form-item .title {
        padding: 20rpx 0;
    }
	page{height: 93%;position: relative;}
	.login {
		margin-top: 40px;
		.uni-form-item{
			margin: 30px;
			display: flex;
			image{width: 16px;height: 16px;vertical-align: middle;margin-top: 4px;margin-right: 5px;}
			border-bottom: 1px solid #eeeeee;
			/deep/.uni-input{font-size: 12px;}
		}
		.uni-column{
			margin: 30px;
			display: flex;
			justify-content: space-between;
			image{width: 16px;height: 16px;vertical-align: middle;margin-top: 4px;margin-right: 5px;}
			border-bottom: 1px solid #eeeeee;
			/deep/.uni-input{font-size: 12px;}
			button{
				width: 60px;
				height: 30px;
				font-size: 12px;
				margin-right: 2px;
				margin-bottom: 5px;

			}
		}
		.uni-btn-v{
			margin: 0 30px;
			text-align: center;
			button{
				color: #FFFFFF;
				width: 100%;
				font-size: 14px;
				background-color: #FF6900;
				border-radius: 10px;
				margin-bottom: 10px;
			}
			text{
				width: 100%;
				color: #999999;
				font-size: 12px;
				
			}
		}
		.tiaokuan{
			position: absolute;
			bottom: 10px;
			font-size: 12px;
			color: #FF6900;
			 left:50%;
			transform:translate(-50%);
		}
	}
</style>

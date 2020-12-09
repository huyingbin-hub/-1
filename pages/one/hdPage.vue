<template>
	<view class="">
		<web-view :src="url">
		</web-view>
	</view>
</template>

<script>
	
	//  import child from './cmms/pt_player.js'
	export default{
		data(){
			return{
				url:'',
			}
		},
		  onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
				this.url = `https://www.zjtaoke.cn/eleven/?phone=${option.phone}&title=${option.type}`
				 console.log(this.url,'---')
				 //this.url = `http://localhost:8082/#/?kc_id=${option.id}&user_id=${option.key}&phone=${option.phone}`
		    },
			
			onShow() {
				
			},
		methods:{
		
		}
	}
</script>

<style>
</style>

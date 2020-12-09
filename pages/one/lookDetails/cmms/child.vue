<template>
	<view class="">
		child{{childata}}
	</view>
</template>

<script>
	export default{
		 props:["childata"],
		
		data(){
			return{
				
			}
		},
		onShow() {
			console.log(this.childata,'child----')
		}
	}
</script>

<style>
</style>

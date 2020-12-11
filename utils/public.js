let _methods = {
	//消息提示窗
	show_toast(datas) {
		uni.showToast({
			title: datas,
			icon: "none",
			duration: 2000
		});
	},
	
	//验证手机号
	checkPhone(phone) {
		if (!(/^1[3456789]\d{9}$/.test(phone))) {
			return false;
		} else {
			return true;
		}
	},
}

export {
	_methods
}
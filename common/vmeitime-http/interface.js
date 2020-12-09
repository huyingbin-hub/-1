
import Vue from 'vue';
const $this = Vue.prototype
// const ENV_SUFFIX = process.env.NODE_ENV === 'production'
//   ? location[('111h11' + 1 + '11o22' + 1 + '221s11' + 1 + '1t22').replace(/\d+/g, '')].split('.')[1]
//   : 'zhongjianedu';
//   console.log(ENV_SUFFIX,'klll')
  const ENV_SUFFIX='zhongjianedu';
//拦截器
const decorator_resource_info = (data) => {
  if (!ENV_SUFFIX) return '';

  data['timestamp'] = Math.ceil(new Date() / 1000);
  //sort key
  const reverse_key = Object.keys(data).sort();
  let resource_code = reverse_key.reduce((rst, v) => rst += `${v}=${ data[v]}&`, '').slice(0, -1) + ENV_SUFFIX;
  data['sign'] =$this.$md5(resource_code);
  data['logtype']='pc';
};
export default {
	config: {
		baseUrl:process.env.NODE_ENV === 'development' ? '/dpc' : '',
		baseUrl:'https://caigua.zhongjianedu.com/ztk.php',
		header: {
			//'Content-Type':'application/json;charset=UTF-8',
			'Content-Type':'application/x-www-form-urlencoded'
		}, 
		data: {},
		method: "GET",
		dataType: "json",  /* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		success() {},
		fail() {},
		complete() {},
	},
	
	interceptor: {
		request: null,
		response: null
	},
	
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method
		//TODO 加密数据
		if (options.data) {
		
			options.data = JSON.parse(JSON.stringify(options.data, (k, v) => (v === undefined || v === null) ? '' : v));
			
			if(options.data.transFormData == 'info'){
				options.data = Vue.prototype.$toFormData('info',options.data);
			}
			
			decorator_resource_info(options.data);
			
			let user = {}
			try {
			   const value = uni.getStorageSync('objList');
			   if (value) {
							  user = value
							
			   }
			} catch (e) {
			   
			   // error
			}
			//增加用户信息
			options.data.token = user.token || ''
			// options.data.openid = $this.$store.state.$user.openid || ''
		}
		return new Promise((resolve, reject) => {
			let _config = null
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				if (process.env.NODE_ENV === 'development') {
					if (statusCode === 200) {
					}
				}
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				_reslog(response)
				if (statusCode === 200) { //成功
					resolve(response);
				} else {
					reject(response)
				}
			}
			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			// 统一的请求日志记录
			// 统一的请求日志记录
			_reqlog(_config)

			if (process.env.NODE_ENV === 'development') {
				
				if (_config.data) {
					
				}
			}

			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'  
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	}
}


/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		
		if (req.data) {
			
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		
		if (res.config.data) {
			
		}
		
	}
	//TODO 除了接口服务错误外，其他日志调接口异步写入日志数据库
	switch(_statusCode){
		case 200:
			break;
		case 401:
			break;
		case 404:
			break;
		default:
			break;
	}
}


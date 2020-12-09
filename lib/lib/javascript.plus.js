import Vue from 'vue' 
const $this = Vue.prototype
const $each2= function (cb) {//核心，each为小程序、微信网页关键字
    // 集成一个类似some的功能 ,
    // 回调函数返回 false 则函数终止,并返回 false
    // 否则函数默认返回 this(即为true)
    for (let i in this) {
      if (cb.call(this, this[i], i, this) === false) return false;
    }
    return this;
  }
 Vue.prototype.$toParams = function(){
	  let rst = '';
	  $each2((v, i) => {
	    rst += i + '=' + v + '&';
	  });
	  return rst.slice(0, -1);
  }
Vue.prototype.$toFormData = function (formName, filterKeysList) {
    // 假如 formName = info
    // 传入 {a:2,c:3,b:5}
    // 输出 {info[a]:2,info[c];3,info[b]:5}
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 针对这种请求
    // info[mm]	    是	string	密码
    if (!formName) return this;
    const rst = {};
    if (filterKeysList) {
      $each2((v, i) => {
        const key = filterKeysList.includes(i) ? i : `${formName}[${i}]`;
        rst[key] = encodeURIComponent(v);
      });
    } else {
      $each2((v, i) => {
        rst[formName + '[' + i + ']'] = encodeURIComponent(v)(v);
      });
    }
    return rst;
  }

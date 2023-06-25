import Taro from "@tarojs/taro";
import { ENV } from '../config/index'
import AccountStore from "../stores/AccountStore";

/**
 * 基于 wx.cloud 的 请求拦截器和响应拦截器
 * @author huang xiangkun
 * @date 2023-01-16
 */
const baseConfig = () => {
  return {

  } 
}

const initCloud = async () => {
  // eslint-disable-next-line no-undef
  await wx.cloud.init({ env: ENV });
}

const deepCloneAndAssignObject = (obj1, obj2) => {
  return JSON.parse(JSON.stringify(Object.assign(obj1, obj2)));
}

class HttpService {
  constructor(config) {
    initCloud()
    this.config = deepCloneAndAssignObject(baseConfig(), config);
    this.interceptor = {
      beforeRequest (configs) {
        configs.data = {
          ...configs.data,
          account_book_id: AccountStore.curAccountBook && AccountStore.curAccountBook._id,
        }
        if (configs && configs.refresh == false) {
          return configs
        }
        Taro.showLoading({
          mask: true
        })
        return configs
      },
      beforeResponse (res) {
        Taro.hideLoading()
        return res
      },
      beforeResponseError (e) {
        Taro.showToast({
          title: '请求出错',
          icon: 'none'
        })
        Taro.hideLoading()
        return e
      },
    }
  }
  // 发起请求
  request (params, refresh) {
    return new Promise((resolve, reject) => {
      // 检查传参
      const requestError = getRequestError(params)
      if (requestError instanceof Error) {
        this.interceptor.beforeResponseError(requestError);
        reject(requestError.message)
        return
      }
      let config = {
        ...params,
        refresh: refresh,
      }
      // 发起请求前
      config = deepCloneAndAssignObject(config, this.interceptor.beforeRequest(config))
      wx.cloud.callFunction({
        ...config,
      }).then(res => {
        console.log('params',params);
        console.log('respond:res',res);
        if ('cloud.callFunction:ok'.includes(res.errMsg) && res?.result?.success) {
          // 请求成功后
          const response = this.interceptor.beforeResponse(res.result);
          resolve(response)
        } else {
          // 请求失败后
          this.interceptor.beforeResponseError(res);
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}
export default new HttpService()

// 验证请求配置
function getRequestError (params) {
  if (!params || !params.name || typeof params.name !== 'string') {
    return new Error('this request name is not supported:')
  } else if (params && params.data && typeof params.data !== 'object') {
    return new Error('request data parameter must be object:')
  } else {
    return true
  }
}
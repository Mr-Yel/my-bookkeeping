import Taro from "@tarojs/taro";

export const storage = {
	// 设置永久缓存
	set(key, val, successCallback) {
		const item = {
			data: val
		}
		Taro.setStorage({
			key,
			data: JSON.stringify(item),
			success: successCallback && successCallback()
		})
	},
	// 获取永久缓存
	async get(key) {
		return new Promise((resolve, reject)=>{
			Taro.getStorage({
				key,
			}).then((res)=>{
				try {
					const item = JSON.parse(res.data)
					resolve(item.data)
				} catch (error) {
					reject(error)
				}
			}).catch((error)=>{
				console.log('fail', error);
				reject(error)
			});
		})
	},
	// 移除永久缓存
	remove(key, successCallback) {
		Taro.removeStorage({
			key,
			success: successCallback && successCallback()
		});
	},
	// 移除全部永久缓存
	clear(successCallback) {
		Taro.clearStorage({success: successCallback && successCallback()});
	}
}
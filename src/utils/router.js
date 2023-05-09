import Taro, { getCurrentPages } from '@tarojs/taro';

export const routerGoBack = () => {
  const page = getCurrentPages()
  if(page && page.length == 1) {
    return console.log('页面栈为1');
  }
  Taro.navigateBack()
}

export const routerGoIn = (url) => {
  Taro.navigateTo({
    url,
  });
}
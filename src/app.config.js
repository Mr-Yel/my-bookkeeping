// eslint-disable-next-line no-undef
export default defineAppConfig({
  pages: [
    'pages/home/home',
    'pages/user/user',
    'pages/userInfoEdit/userInfoEdit',
    'pages/addBill/addBill',
    'pages/account/account',
    'pages/addAccount/addAccount',
    'pages/billCategory/billCategory'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '标题',
    navigationStyle: 'custom',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#b4282d',
    backgroundColor: '#fafafa',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/home',
        iconPath: './assets/tab-bar/home.png',
        selectedIconPath: './assets/tab-bar/home-active.png',
        text: '首页'
      },
      {
        pagePath: 'pages/account/account',
        iconPath: './assets/tab-bar/property.png',
        selectedIconPath: './assets/tab-bar/property-active.png',
        text: '账户'
      },
      {
        pagePath: 'pages/user/user',
        iconPath: './assets/tab-bar/user.png',
        selectedIconPath: './assets/tab-bar/user-active.png',
        text: '我的'
      }
    ]
  },
  navigationBarTitleText: '',
  navigationStyle: 'custom'
})

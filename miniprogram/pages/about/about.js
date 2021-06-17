import Notify from '@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showGithub: false,
    showGitee: false
  },

  onClose() {
    this.setData({ 
      showGithub: false,
      showGitee: false
    });
  },

  toGithub() {
    this.setData({
      showGithub: true
    })
  },

  toGitee() {
    this.setData({
      showGitee: true
    })
  },

  drinkCoffee() {
    Notify({
      message: '有人用就不错了，哪敢要咖啡喝啊',
      color: '#43a047',
      background: '#b2f2bb',
      duration: 3000,
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
const db = wx.cloud.database()
const _ = db.command
const todos = db.collection('todos')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeBar: 'personal',
    count: '0'
  },

  async getTasksCount() {
    let openid = wx.getStorageSync('openid')
    if (!openid) {
      await wx.cloud.callFunction({
        name: 'getOpenid'
      }).then((res) => {
      wx.setStorageSync('openid', res.result.openid)
      }).then(() => {
        this.setData({
          openid: wx.getStorageSync('openid')
        })
      })
    } else {
      this.setData({
        openid
      })
    }

    todos.where({
      _openid: this.data.openid
    })
    .count()
    .then((res) => {
      this.setData({
        count: res.total
      })
    })
  },

  getUserProfile() {
    if (!this.data.userInfo) {
      wx.getUserProfile({
        desc: '测试',
        success: (res) => {
          wx.setStorage({
            key: 'userInfo',
            data: res.userInfo
          }).then(() => {
            Toast.success('成功登录啦')
          }).then( () => {
            let userInfo = wx.getStorageSync('userInfo')
            this.setData({
              userInfo
            })
          }).catch(() => {
            Toast.fail('登录失败')
          })
        },
        fail: () => {
          Toast.fail('登录失败了...')
        }
      })
    } else {
      return
    }
    
  },


  onChange(event) {
    wx.redirectTo({
      url: `../${event.detail}/${event.detail}`,
    })
  },

  showAuthorWX() {
    Dialog({
      title: '请记得备注来意哦',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo
      })
    }
    this.getTasksCount()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '快来试试無印Task吧！',
      path: '/miniprogram/pages/index/index',
      imageUrl: 'https://z3.ax1x.com/2021/06/15/2qla0H.jpg'
    }
  }
})
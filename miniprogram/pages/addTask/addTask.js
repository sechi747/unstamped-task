import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
const moment = require('moment')
const db = wx.cloud.database()
const todos = db.collection('todos')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deadline:'',
    isShow: false,
    level: 'trivial',
    activeBar: 'addTask',
    titleText: '',
    //time
    minDate: new Date().getTime(),
    maxDate: new Date(2032, 6, 7).getTime(),
    currentDate: new Date().getTime(),
  },
  pageData: {
    title: '',
    content: '',
    deadline: '',
    level: '琐碎小事',
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.typewriter()
  },

  typewriter() {
    let title = "凡事预则立，不预则废。";
    let that = this
      let i= 0;
      let type = setInterval(function(){
          let text = title.substring(0, i);
          i++;
          that.setData({
              titleText: text
          });
          if (text.length == title.length) {
              clearInterval(type);
          }
      },400)
  },
  
  async addData() {
    if (this.pageData.content.match(/^[ ]*$/)) {
      Dialog.alert({
        message: '怎么也得输点儿东西再提交吧',
      })
      return
    }
    
    todos.add({
      data: {
        title: this.pageData.title,
        content: this.pageData.content,
        deadline: this.pageData.deadline,
        level: this.pageData.level,
        done: false,
        time: new Date().getTime()
      }
    }).then(res => {
      Toast.success({
        message: '创建成功啦',
        duration: 1200,
        forbidClick: true,
        onClose: () => {
          wx.redirectTo({
          url: `../taskInfo/taskInfo?id=${res._id}`,
        })
      }
      })
    }).catch(() => {
      Toast.fail({
        message: '出错啦，请尝试重新提交',
        duration: 1200,
        forbidClick: true,
      })
    })
  },

  handleFieldBlur(event) {
    this.pageData.title = event.detail.value
  },

  handleTextareaBlur(event) {
    this.pageData.content = event.detail.value
  },

  onChooseTime() {
    this.setData({
      isShow: true
    })
  },

  onTimeConfirm(res) {
    this.pageData.deadline = res.detail
    this.setData({
      isShow: false,
      deadline: moment(res.detail).format('YYYY-MM-DD HH:mm')
    })
  },
  onTimeCancel() {
    this.setData({
      isShow: false
    })
  },

  onLevelChange(event) {
    let map = { 'trivial': '琐碎小事', 'middle': '日常安排', 'important': '重要事务'}
    this.pageData.level = map[event.detail]
    this.setData({
      level: event.detail
    })
  },

  onChange(event) {
    wx.redirectTo({
      url: `../${event.detail}/${event.detail}`,
    })
  },
})
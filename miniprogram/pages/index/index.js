import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';

const db = wx.cloud.database()
const _ = db.command
const todos = db.collection('todos')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasks: [],
    activeBar: 'index',
    isSwipe: false
  },

  pageData: {
    _openid: ''
  },

  async getData() {
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
    });

    let _openid = wx.getStorageSync('openid')
    let oldData = this.data.tasks
    let skip = this.data.tasks.length
    
    todos.where({
      _openid
    }).limit(15).skip(skip).orderBy('time', 'desc').field({
      _id:true,
      title:true,
      level:true,
      done: true,
    })
    .get()
    .then(res => {
      if (res.data.length <= 0 & this.data.tasks.length !== 0) {
        Toast.fail({
          message: '全部加载完啦',
          duration: 1000
        });
      } else {
        this.setData({
          tasks: oldData.concat(res.data)
        })
        Toast.clear()
      }
    })
  },

  toTaskInfo(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `../taskInfo/taskInfo?id=${id}`,
    })
  },

  onChange(event) {
    wx.redirectTo({
      url: `../${event.detail}/${event.detail}`,
    })
  },

  onSwipeOpen(event) {
    const { position } = event.detail;

    switch (position) {
      case 'left':
        this.setData({
          isSwipe: true
        })
        setTimeout(() => {
          this.setData({
            isSwipe: false
          })
        }, 0);
        break;
      case 'right':
        this.setData({
          isSwipe: true
        })
        setTimeout(() => {
          this.setData({
            isSwipe: false
          })
        }, 0);
        break;
      case 'cell':
        console.log('sadsaf')
    }
  },

  onSwipeClose(event) {
    const { position, instance, name } = event.detail;
    const id = event.currentTarget.id

    switch (position) {
      case 'left':
        Dialog.confirm({
          title: '确定删除这条事项吗？',
          message: '谨慎思考，删除后无法找回！',
        }).then(() => {
          this.data.tasks.splice(name,1)
          this.setData({
            tasks: this.data.tasks
          })
          instance.close()
        }).then(() => {
          todos.where({
            _id: id
          }).remove()
        }).catch(() => {
          instance.close()
        })
        this.setData({
          isSwipe: false
        })
        break

      case 'right':
        Dialog.confirm({
          title: '确定划去这条事项吗？',
          message: '谨慎思考，划去后任务状态会转变为已完成！',
        }).then(() => {
          this.setData({
            ['tasks['+ name +'].done'] : true
          })
          instance.close()
        }).then(() => {
          todos.doc(id).update({
            data: {
              done: true
            }
          })
          db.collection('messages').doc(id).update({
            data: {
              data: {
                done: true
              }
            }
          })
        }).catch(() => {
          instance.close()
        })
        this.setData({
          isSwipe: false
        })
        break

      case 'cell':
        instance.close()
        this.setData({
          isSwipe: false
        })
        break
      case 'outside':
        console.log('hhhhhh')
        instance.close()
        this.setData({
          isSwipe: false
        })
        break
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (this.data.tasks.length !== 0) {
      this.setData({
        tasks: []
      })
      this.getData()
    }
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.tasks.length !== 0) {
      this.getData()
    }

  },

})
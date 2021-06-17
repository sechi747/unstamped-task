// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    // 从云开数据库中查询等待发送的消息列表
    const messages = await db
      .collection('messages')
      .where({
        done: false,
        // 事务截止前半小时之内
        deadline:_.and(_.gt(new Date().getTime()), _.lte(new Date().getTime() + 30 * 60 * 1000))
      })
      .get();
    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        console.log('im working1')
        await cloud.openapi.subscribeMessage.send({
          "touser": message.touser,
          "page": message.page,
          "data": message.data,
          "templateId": message.templateId,
          "miniprogramState": 'developer'
        });
        console.log('im working2')
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('messages')
          .doc(message._id)
          .update({
            data: {
              done: true,
            },
          });
      } catch (e) {
        return e;
      }
    });
    console.log('im working3')
    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
}
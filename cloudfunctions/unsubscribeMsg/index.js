// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

const db = cloud.database();

exports.main = async (event) => {
  console.log(event.id)
  try {
    const {OPENID} = cloud.getWXContext();
    // 删除订阅的消息
    const result = await db
      .collection('messages')
      .where({
        touser: OPENID,
        templateId: event.templateId,
        _id: event.id,
      })
      .remove();
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};
import IndexedDB from './helper'

// 建立实例
const help = new IndexedDB(dbInfo)

// 添加对象的测试
const add = () => {
  // 定义一个对象
  const model = {
    id: new Date().valueOf(),
    name: 'test'
  }
  // 添加
  help.addModel('menuMeta', model).then((res) => {
    console.log('添加成功！', res) // 返回对象ID
  })
}

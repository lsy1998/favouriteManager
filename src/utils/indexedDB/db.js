import { dbCreateHelp } from '@naturefw/storage'
// 引入数据库数据
const db = {
  dbName: 'nf-indexedDB-test2',
  ver: 1
}

/**
 * 客户项目的 meta 的 db 缓存
 */
export default function createDBHelp (callback) {
  const help = dbCreateHelp({
    // dbFlag: 'project-meta-db',
    dbConfig: db,
    stores: { // 数据库里的对象仓库
      moduleMeta: { // 模块的meta {按钮,列表,分页,查询,表单若干}
        id: 'moduleId',
        index: {},
        isClear: false
      },
      menuMeta: { // 菜单用的meta
        id: 'id',
        index: {},
        isClear: false
      },
      serviceMeta: { // 后端API的meta，在线演示用。
        id: 'moduleId',
        index: {},
        isClear: false
      },
      testIndex: { // 演示一下索引的查询。
        id: 'moduleId',
        index: {
          kind: false,
          type: false
        },
        isClear: false
      }
    },
    // 设置初始数据
    async init (help) {
      if (typeof callback === 'function') {
        await callback(help)
      }
    }
  })
  return help
}

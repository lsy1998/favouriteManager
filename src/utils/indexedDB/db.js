import { dbCreateHelp } from '@naturefw/storage'
// 引入数据库数据
const db = {
  dbName: 'favourite',
  ver: 1
}


export default function createDBHelp (callback) {
  const help = dbCreateHelp({
    // dbFlag: 'project-meta-db',
    dbConfig: db,
    stores: {
      favouriteMasterData: { // 演示一下索引的查询。
        id: 'id',
        index: {
          folderName: false,
          folderId: true,
          folderAddDate:false,
          folderModifiedDate:false,
          linkName:false,
          linkId:true,
          linkUrl:false,
          LinkAddDate:false,
          linkModifiedDate:false,
          parentFolderId:false,
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

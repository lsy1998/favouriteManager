
import IndexedDB from './help.js'

/**
 * 把 indexedDB 的help 做成插件的形式
 */
export default {
  _indexedDBFlag: Symbol('nf-indexedDB-help'),
  _help: {}, // 访问数据库的实例
  _store: {}, // 存放对象，实现 foo.addModel(obj)的功能

  createHelp (info) {
    let indexedDBFlag = this._indexedDBFlag
    if (typeof info.dbFlag === 'string') {
      indexedDBFlag = Symbol.for(info.dbFlag)
    } else if (typeof info.dbFlag === 'symbol') {
      indexedDBFlag = info.dbFlag
    }
    // 连接数据库，获得实例。
    const help = new IndexedDB(info)
    // 存入静态对象，以便于支持保存多个不同的实例。
    this._help[indexedDBFlag] = help // help
    this._store[indexedDBFlag] = {} // 仓库变对象

    // 把仓库变成对象的形式，避免写字符串的仓库名称
    for (const key in info.stores) {
      this._store[indexedDBFlag][key] = {
        put: (obj) => {
          let _id = obj
          if (typeof obj === 'object') {
            _id = obj[info.stores[key].id]
          }
          return help.updateModel(key, obj, _id)
        },
        del: (obj) => {
          let _id = obj
          if (typeof obj === 'object') {
            _id = obj[info.stores[key].id]
          }
          return help.deleteModel(key, _id)
        },
        add: (obj) => help.addModel(key, obj),
        get: (id = null) => help.getModel(key, id)
      }
    }
  },

  // 获取静态对象里的数据库实例
  useDBHelp (_dbFlag) {
    let flag = this._indexedDBFlag
    if (typeof _dbFlag === 'string') {
      flag = Symbol.for(_dbFlag)
    } else if (typeof _dbFlag === 'symbol') {
      flag = _dbFlag
    }
    return this._help[flag]
  },
  useStore (_dbFlag) {
    let flag = this._indexedDBFlag
    if (typeof _dbFlag === 'string') {
      flag = Symbol.for(_dbFlag)
    } else if (typeof _dbFlag === 'symbol') {
      flag = _dbFlag
    }
    return this._store[flag]
  }
}

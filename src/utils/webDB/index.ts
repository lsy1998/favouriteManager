//声明一下window，否则会报错
declare const window: Window

//定义数据库和表的名称
const DB_NAME:string = 'FAVOURITE';
const EDGE_TABLE_NAME:string = 'EDGE_TABLE';

let db:IDBDatabase;


// 打开一个数据库，如果不存在则新建
let idbRequest = window.indexedDB.open(DB_NAME);
// 打开一个数据库，如果不存在则新建
// let dataBase = window.openDatabase('FAVOURITE', '1.0', 'A Web Database', 4 * 1024 * 1024, function () { });

idbRequest.onerror = function (event) {
  console.log('数据库打开报错');
};

idbRequest.onsuccess = async function (event) {
  console.log(idbRequest.result);
  console.log(1);

  if(event.target!=null){
     db = await (event.target as any).result;
  }
  console.log('数据库打开成功');
};

//一开始版本号从无到有，所以先出发的是数据库版本升级事件
//在这个事件中创建初始表
idbRequest.onupgradeneeded = function (event) {
  console.log('数据库升级');
  if(event.target!=null){
    db = (event.target as any).result;
  }
  let objectStore:IDBObjectStore;
  //判断表是否存在
  if (!db.objectStoreNames.contains(EDGE_TABLE_NAME)) {
    objectStore = db.createObjectStore(EDGE_TABLE_NAME, { autoIncrement: true });
    //三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）
    objectStore.createIndex('FOLDER_NAME', 'FOLDER_NAME', { unique: false });
    objectStore.createIndex('FOLDER_ID', 'FOLDER_ID', { unique: false });
    objectStore.createIndex('FOLDER_ADD_DATE', 'FOLDER_ADD_DATE', { unique: false });
    objectStore.createIndex('FOLDER_MODIFIED_DATE', 'FOLDER_MODIFIED_DATE', { unique: false });
    objectStore.createIndex('LINK_NAME', 'LINK_NAME', { unique: false });
    objectStore.createIndex('LINK_URL', 'LINK_URL', { unique: false });
    objectStore.createIndex('LINK_ID', 'LINK_ID', { unique: false });
    objectStore.createIndex('LINK_ADD_DATE', 'LINK_ADD_DATE', { unique: false });
    objectStore.createIndex('LINK_MODIFIED_DATE', 'LINK_MODIFIED_DATE', { unique: false });
    objectStore.createIndex('PARENT_FOLDER_ID', 'PARENT_FOLDER_ID', { unique: false });
  }
}

export {db,EDGE_TABLE_NAME,DB_NAME}

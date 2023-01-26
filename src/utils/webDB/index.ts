//声明一下window，否则会报错
declare const window: Window

//定义表的名称
const EDGE_TABLE_NAME:string = 'EDGE_TABLE';
let database:IDBDatabase;


// 打开一个数据库，如果不存在则新建
let idbRequest  = window.indexedDB.open("FAVOURITE");
// 打开一个数据库，如果不存在则新建
// let dataBase = window.openDatabase('FAVOURITE', '1.0', 'A Web Database', 4 * 1024 * 1024, function () { });

idbRequest.onerror = function (event) {
  console.log('数据库打开报错');
};

idbRequest.onsuccess = function (event) {
  database = idbRequest.result;
  console.log('数据库打开成功');
};

//一开始版本号从无到有，所以先出发的是数据库版本升级事件
//在这个事件中创建初始表
idbRequest.onupgradeneeded = function (event) {
  if(event.target!=null){
    database = (event.target as any).result;
  }
  var objectStore = database.createObjectStore(EDGE_TABLE_NAME);
}

export {}

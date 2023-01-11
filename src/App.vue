<template>
  <router-view />
</template>

<script setup lang="ts">
let dataBase = window.openDatabase('websql', '1.0', 'Datura练习', 4 * 1024 * 1024, function () { });
var tableName = 'websqlTable';//创建表的名称
//这里定一个变量来存建表相关信息，并声明主键，需要存储的字段及格式（NAME、AGE、HEIGHT、WEIGHT）
var creatTableSQL = 'CREATE TABLE IF  NOT EXISTS ' + tableName + ' (rowid INTEGER PRIMARY KEY AUTOINCREMENT, NAME text,AGE text,HEIGHT text,WEIGTH text)';
dataBase.transaction(function (ctx: { executeSql: (arg0: string, arg1: never[], arg2: (ctx: any, result: any) => void, arg3: (tx: any, error: any) => void) => void; }, result: any) {
  ctx.executeSql(creatTableSQL, [], function (ctx: any, result: any) {
    alert("表创建成功 " + tableName);//建表成功
  }, function (tx: any, error: { message: string; }) {
    alert('创建表失败:' + tableName + error.message);//建表失败
  });
});
function websqlInsterDataToTable(tableName: string, NAME: string, AGE: string, HEIGHT: string, WEIGTH: string) {
  var insterTableSQL = 'INSERT INTO ' + tableName + ' (NAME,AGE,HEIGHT,WEIGTH) VALUES (?,?,?,?)';
  dataBase.transaction(function (ctx: { executeSql: (arg0: string, arg1: any[], arg2: (ctx: any, result: any) => void, arg3: (tx: any, error: any) => void) => void; }) {
    ctx.executeSql(insterTableSQL, [NAME, AGE, HEIGHT, WEIGTH], function (ctx: any, result: any) {
      console.log("插入" + tableName + NAME + "成功");
    },
      function (tx: any, error: { message: string; }) {
        alert('插入失败: ' + error.message);
      });
  });
}
websqlInsterDataToTable(tableName, "小红", "18", "175cm", "40kg");
websqlInsterDataToTable(tableName, "小黄", "17", "180cm", "45kg");
websqlInsterDataToTable(tableName, "小蓝", "19", "185cm", "70kg");
websqlInsterDataToTable(tableName, "小绿", "19", "175cm", "60kg");
websqlInsterDataToTable(tableName, "小青", "21", "162cm", "52kg");
websqlInsterDataToTable(tableName, "小紫", "25", "195cm", "80kg");
</script>

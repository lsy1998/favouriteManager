// const { open } = require("sqlite");
// const sqlite3 = require("sqlite3").verbose();
import {open} from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'path';
// import { app } from '@electron/remote'


// function SQLiteInit() {
//   //由于主进程是使用Esbuild绑定的，因此使用__dirname和__filename不会在生产中提供预期的值。
//   //参考文件树，您会注意到，在生产环境中，electron-main.js和electron-preload.js文件被放置在dist/electron-*文件夹中。
//   //根据这些知识，相应地使用__dirname和__filename
//   let rootPath = path.join(app.getPath('userData') , '../database/user.db');
//   console.log(rootPath)
//   let db = new sqlite3.Database(rootPath, (err)=>{
//       if (err) throw err;
//       console.log('数据库连接')
//   })
// }

//dbPath为你想存放数据库文件的目录路径
const connectDB = (dbPath:string) => {
  return open({
    filename: dbPath,
    driver: sqlite3.verbose().Database,
  });
};

export { connectDB };

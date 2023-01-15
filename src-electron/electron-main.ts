import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';
import os from 'os';
import {connectDB} from './common/dbConnection'
import sqlite3 from 'sqlite3'
const md5 = require("md5-node");

// import { initialize, enable } from '@electron/remote/main'


// initialize()
// needed in case process is undefined under Linux
const platform = process.platform || os.platform();

console.log(platform)

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(
      path.join(app.getPath('userData'), 'DevTools Extensions')
    );
  }
} catch (_) {}

let mainWindow: BrowserWindow | undefined;
debugger

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    // frame: false,
    webPreferences: {
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });
  // enable(mainWindow.webContents)
  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    createWindow();
  }
});


SQLiteInit();
console.log(222);

//自定义数据库路径
const userDBPath = path.join(__dirname , '../../src-electron/database/user.db');
createUserInfoTable();
async function createUserInfoTable() {
  console.log(111);
    const userInfoDB = await connectDB(userDBPath);
    const sql = `create table userInfo (
        id integer primary key autoincrement ,
        username varchar unique not null ,
        password varchar not null ,
        name text not null ,
        remark text
        )`;
    let res = null;
    try {
      //查询使用userInfoDb.get userInfoDb.all等 更多命令请查阅官方文档
      const runRes = await userInfoDB.run(sql);
      res = {
      	code:200,
      	data:runRes
      }
    } catch (e) {
      res = {
      	code:500,
      	msg:e
      }
    } finally {
    //最后关闭连接
      await userInfoDB.close();
    }
    return res;
  }

  function SQLiteInit() {
  //由于主进程是使用Esbuild绑定的，因此使用__dirname和__filename不会在生产中提供预期的值。
  //参考文件树，您会注意到，在生产环境中，electron-main.js和electron-preload.js文件被放置在dist/electron-*文件夹中。
  //根据这些知识，相应地使用__dirname和__filename
  let rootPath = path.join(__dirname , '../../src-electron/database/user.db');
  console.log(rootPath)
  let db = new sqlite3.Database(rootPath, (err)=>{
      if (err) throw err;
      console.log('数据库连接')
  })
}

inertUserInfoTable()
async function inertUserInfoTable(data = {}) {
    const userInfoDb = await connectDB(userDBPath);
    const sql = `insert into userInfo (username,password,name,remark) values (:username,:password,:name,:remark)`;
    let res = null;
    try {
      const v = {
      	":username": "1",
        ":name": "1",
        ":remark": "1",
        ":password": md5("1"),
      };
      const runRes = await userInfoDb.run(sql, v);
       res = {
      	code:200,
      	data:runRes
      }
    } catch (e) {
      res = {
      	code:500,
      	msg:e
      }
    } finally {
      await userInfoDb.close();
    }
    return res;
  }


/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import electronLocalshortcut from 'electron-localshortcut';
import { app, ipcMain, globalShortcut } from 'electron';
import mainWindow from './mainWin';
import createTray from './tray';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

// 只能运行一次
const gotTheLock = app.requestSingleInstanceLock();

// 程序第二次启动，触发show
app.on('second-instance', () => {
  mainWindow?.show();
});

const createWindow = async () => {
  if (!gotTheLock) return;

  createTray();

  mainWindow.createWin();

  electronLocalshortcut.register(mainWindow.mainWindow, 'Esc', () => {
    mainWindow.animaHide();
  });

  globalShortcut.register('super+ctrl+b', () => {
    mainWindow.show();
  });
};

ipcMain.on('main-win-fixed', (ev, fixed) => {
  mainWindow.setFixed(fixed);
});

// 查询 mainwin 状态
ipcMain.on('main-win-status', (ev) => {
  ev.reply('main-win-status-reply', {
    isFixed: mainWindow.isFixed,
  });
});

ipcMain.on('main-win-enable-resize', (ev, resizable) => {
  mainWindow.setEnableResize(resizable);
});

/**
 * Add event listeners...
 */

// app.on('window-all-closed', () => {
//   // Respect the OSX convention of having the application in memory even
//   // after all windows have been closed
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      // if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

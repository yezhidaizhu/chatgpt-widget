/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import { app, ipcMain, globalShortcut } from 'electron';
import MainWin from './mainWin';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}
const mainWindow = new MainWin();

const createWindow = async () => {
  mainWindow.createWin();

  globalShortcut.register('super+ctrl+b', () => {
    console.log('CommandOrControl+X is pressed');
    mainWindow.show();
  });
};

ipcMain.on('close-main-win', () => {
  mainWindow.animaHide();
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

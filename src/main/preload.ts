// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import loadOptions from './preload/options';
import loadPandors from './preload/urlPandors';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event: any, ...args: any) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

const mainWindowStatus = {};
ipcRenderer.send('main-win-status');
ipcRenderer.on('main-win-status-reply', (ev, status) => {
  if (status) {
    Object.assign(mainWindowStatus, status);
  }
});

ipcRenderer.once('main-win-dom-ready', () => {
  loadOptions({ mainWindowStatus });

  // 鼠标在右边不能 resize
  let enableResize = true;
  const sendEnableResize = (enable: boolean) =>
    ipcRenderer.send('main-win-enable-resize', enable);

  document.body.addEventListener('mousemove', (event) => {
    const { clientX } = event;

    if (document.body.clientWidth - clientX < 16) {
      enableResize = false;
      sendEnableResize(false);
    } else if (!enableResize) {
      enableResize = true;
      sendEnableResize(true);
    }
  });
});

ipcRenderer.once('main-win-did-finish-load', () => {
  loadPandors();
});

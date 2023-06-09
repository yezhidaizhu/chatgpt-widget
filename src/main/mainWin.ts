/* eslint-disable no-underscore-dangle */
/*  */
import { app, screen, BrowserWindow, Menu } from 'electron';
import path from 'path';
import { getDefaultLink, getStoreSetting, setStoreSetting } from './store';

class MainWin {
  mainWindow: BrowserWindow | undefined;

  screenWidth = 0;

  screenHeight = 0;

  windowWidth = 600;

  inervalTimer: any;

  link = '';

  isFixed = false;

  constructor() {
    const setting = getStoreSetting();
    this.windowWidth = setting?.windowWidth;
    this.link = getDefaultLink();
  }

  createWin() {
    const { width: screenWidth, height: screenHeight } =
      screen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: this.windowWidth,
      height: screenHeight,
      frame: false,
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
      },
      minHeight: screenHeight,
      maxWidth: 0.85 * screenWidth,
      minWidth: 400,
      skipTaskbar: true,
      x: screenWidth,
      y: 0,
      show: false,
      // resizable:false
    });

    this.mainWindow = mainWindow;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    // 监听
    this.listener();

    // and load the index.html of the app.
    mainWindow.loadURL(this.link);

    // Open the DevTools.
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  }

  listener() {
    const { mainWindow, screenWidth } = this;
    const _this = this;

    // 打开时滑动打开
    mainWindow?.on('show', () => {
      const speed = Math.floor(_this.windowWidth / 16);
      const slideInAnimation = () => {
        const start = screenWidth;

        const end = screenWidth - _this.windowWidth;
        let pos = start;

        clearInterval(_this.inervalTimer);

        // eslint-disable-next-line no-use-before-define
        _this.inervalTimer = setInterval(showFrame, 5);
        function showFrame() {
          if (pos <= end) {
            _this.mainWindow?.setPosition(end, 0);
            clearInterval(_this.inervalTimer);
          } else {
            pos -= speed; // 调整滑动速度
            _this.mainWindow?.setPosition(pos, 0);
          }
        }
      };

      slideInAnimation();
    });

    // 改变窗口大小时
    mainWindow?.on('resized', () => {
      const { width } = mainWindow.getBounds();
      _this.windowWidth = width;
    });

    mainWindow?.on('blur', () => {
      if (_this.isFixed) return;
      _this.hide();
    });

    // 禁止右边拖动
    mainWindow?.on(
      'will-resize',
      (
        event: { preventDefault: () => void },
        _newBounds: any,
        details: { edge: string }
      ) => {
        if (details.edge === 'right') {
          event.preventDefault();
        } else {
          const { width } = mainWindow.getBounds();
          setStoreSetting({ windowWidth: width });
        }
      }
    );

    // 通知dom-ready完成触发
    mainWindow?.webContents.on('dom-ready', () => {
      mainWindow?.webContents.send('main-win-dom-ready');
    });

    // 通知加载完成触发 did-finish-load
    mainWindow?.webContents.on('did-finish-load', () => {
      mainWindow?.webContents.send('main-win-did-finish-load');
    });
  }

  show() {
    if (this.mainWindow?.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.mainWindow?.show?.();
    }
  }

  close() {
    this.mainWindow?.close?.();
  }

  animaHide() {
    const { screenWidth } = this;
    const _this = this;
    const speed = Math.floor(_this.windowWidth / 6);

    const slideInAnimation = () => {
      let pos = screenWidth - _this.windowWidth;
      // eslint-disable-next-line no-use-before-define
      _this.inervalTimer = setInterval(hidenFrame, 5);
      function hidenFrame() {
        if (pos <= screenWidth) {
          pos += speed; // 调整滑动速度
          _this.mainWindow?.setPosition(pos, 0);
        } else {
          _this.mainWindow?.setPosition(screenWidth, 0);
          _this.mainWindow?.hide();
          clearInterval(_this.inervalTimer);
        }
      }
    };

    slideInAnimation();
  }

  hide() {
    this.mainWindow?.setPosition(this.screenWidth, 0);
    setTimeout(() => {
      this.mainWindow?.hide();
    }, 100);
  }

  reloadUrl(url?: string) {
    this.mainWindow?.reload();
    // eslint-disable-next-line no-unused-expressions
    url && this.mainWindow?.loadURL(url);
  }

  // 固定，并且置顶，esc 才能关闭
  setFixed(fixed?: boolean) {
    this.isFixed = fixed ?? !this.isFixed;
    this.mainWindow?.setAlwaysOnTop(this.isFixed);
  }

  // 是否可以 resize
  setEnableResize(resizable: boolean) {
    this.mainWindow?.setResizable(resizable);
  }

  // 打开开发者工具
  toggleDevTools() {
    this.mainWindow?.webContents.openDevTools();
  }
}

const mainWindow = new MainWin();

export default mainWindow;

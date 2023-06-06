import { Menu, Tray } from 'electron';
import mainWindow from './mainWin';
import { getDefaultLink, getLinkOptons, setDefaultLink } from './store';
import { getAssetPath } from './util';

const iconTray = getAssetPath('icon.png');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let tray: Tray | undefined;

export default function createTray() {
  tray = new Tray(iconTray);
  const reloadUrl = (url: string) => {
    mainWindow.reloadUrl(url);
    setDefaultLink(url);
  };

  const defaultLink = getDefaultLink();
  const links: any[] = getLinkOptons().map((item) => ({
    label: item.label,
    type: 'radio',
    checked: defaultLink === item.url,
    click: () => reloadUrl(item.url),
  }));

  const contextMenu = Menu.buildFromTemplate([
    ...links,
    { type: 'separator' },
    { label: '退出', role: 'quit' },
  ]);
  tray?.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.show();
  });
}

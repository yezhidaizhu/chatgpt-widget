import Store from 'electron-store';
import { linkOptions } from './config';

const store = new Store();

const Setting_Store_key = 'setting';

const defaultSetting = {
  windowWidth: 600, // 窗口宽度
  link: '', // 链接
};

export function getStoreSetting() {
  const setting: { [key: string]: any } = store.get(Setting_Store_key) || {};

  return Object.assign(defaultSetting, setting);
}

export function setStoreSetting(setting: { [key: string]: any } = {}) {
  if (!setting) return;
  const settingData = getStoreSetting();
  Object.assign(settingData, setting);
  store.set(Setting_Store_key, settingData);
}

// 链接
export function getLinkOptons() {
  return linkOptions;
}

export function getDefaultLink() {
  const setting = getStoreSetting();
  const settingLink = setting.link;
  const linkItem = getLinkOptons()?.find((item) => item.url === settingLink);
  return linkItem?.url || getLinkOptons()[0].url;
}

export function setDefaultLink(url: any) {
  setStoreSetting({ link: url });
}

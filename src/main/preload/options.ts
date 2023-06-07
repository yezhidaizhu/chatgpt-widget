import jss, { JssStyle } from 'jss';
import { ipcRenderer } from 'electron';
import Toastify from 'toastify';
import copy from 'copy-text-to-clipboard';

import { createFaIcon, loadCss } from './utils';
import { loadDefaultCss } from './defaultCss';

Toastify.setOption('delay', 500);

// 界面右上角操作
function loadOptions({ mainWindowStatus = {} }: { [key: string]: any }) {
  console.log('load options');
  const defaultOptions = {
    fixed: mainWindowStatus?.isFixed,
  };

  if (typeof window !== 'undefined') {
    const presetDefault = require('jss-preset-default').default;
    jss.setup(presetDefault());

    loadDefaultCss();
    loadCss(
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
    );
  }

  const { classes } = jss.createStyleSheet(styles as any).attach();
  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add(classes.optionsContainer);

  // 固定钉
  const tackIcon = createFaIcon([classes.optionsIcon, 'fa-thumb-tack']);
  const optionsIconBox = document.createElement('div');
  optionsIconBox.classList.add(classes.optionsIconBox);
  if (defaultOptions.fixed) optionsIconBox.classList.add(classes.fixed);
  optionsIconBox.append(tackIcon);
  optionsIconBox.addEventListener('click', () => {
    const fixed = !defaultOptions.fixed;
    defaultOptions.fixed = fixed;
    ipcRenderer.send('main-win-fixed', fixed);
    if (fixed) {
      optionsIconBox.classList.add(classes.fixed);
    } else {
      optionsIconBox.classList.remove(classes.fixed);
    }
  });

  // 复制
  const copyIcon = createFaIcon([classes.optionsIcon, 'fa-copy']);
  const copyOptionsIconBox = document.createElement('div');
  copyOptionsIconBox.classList.add(classes.optionsIconBox);
  copyOptionsIconBox.append(copyIcon);
  copyOptionsIconBox.addEventListener('click', () => {
    // eslint-disable-next-line no-restricted-globals
    copy(location.href);
    Toastify.info('已复制当前地址');
  });

  optionsContainer.appendChild(copyOptionsIconBox);
  optionsContainer.appendChild(optionsIconBox);
  window.document.body.append(optionsContainer);
}

export default loadOptions;

const styles: JssStyle = {
  optionsContainer: {
    position: 'fixed',
    top: '0',
    right: '0',
    margin: '8px 8px',
    'z-index': 99999,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    fontSize: 14,
    color: '#fff',
    transition: 'all 0.2s',
  },
  optionsIconBox: {
    '&:hover': {
      opacity: 1,
    },
    opacity: 0.2,
    width: 24,
    height: 24,
    borderRadius: 4,
    background: '#111',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  optionsIcon: {
    '&:hover': {
      transition: 'all 0.2s',
    },
    color: '#fff',
  },
  fixed: {
    opacity: 1,
    background: '#0066ff',
  },
};

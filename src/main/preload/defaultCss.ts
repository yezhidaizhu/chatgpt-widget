import { loadCssStr } from './utils';

/**
 * 注入所有需要的css样式
 */

export function loadDefaultCss() {
  // 滚动条
  loadCssStr(scrollbarStyleStr);

  loadCssStr(toastifyStyleStr);
}

const scrollbarStyleStr = `
::-webkit-scrollbar-thumb:horizontal { /*水平滚动条的样式*/
    width: 4px;
    -webkit-border-radius: 8px;
}
::-webkit-scrollbar-track-piece {
    -webkit-border-radius: 0; /*滚动条的圆角宽度*/
}
::-webkit-scrollbar {
    width: 12px; /*滚动条的宽度*/
    height: 8px; /*滚动条的高度*/
}
::-webkit-scrollbar-thumb:vertical { /*垂直滚动条的样式*/
    -webkit-border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #fff;
}
::-webkit-scrollbar-thumb:hover { /*滚动条的hover样式*/
    -webkit-border-radius: 4px;
}
`;

const toastifyStyleStr = `
.toastify {
    font-family: sans-serif;
    padding: 15px;
    position: fixed;
    border-radius: 3px;
    min-width: 200px;
    opacity: 0;
    z-index: 9999; }
    .toastify.toastify-bottom-right {
      bottom: 15px;
      right: 15px; }
    .toastify.toastify-top-right {
      top: 15px;
      right: 15px; }
    .toastify.toastify-top-left {
      top: 15px;
      left: 15px; }
    .toastify.toastify-bottom-left {
      bottom: 15px;
      left: 15px; }
    .toastify.toastify-success {
      background: #2ecc71;
      color: white;
      border: 1px solid #29b765; }
    .toastify.toastify-warning {
      background: #f39c12;
      color: white;
      border: 1px solid #e08e0b; }
    .toastify.toastify-default {
      background: #333;
      color: white;
      border: 1px solid #262626; }
    .toastify.toastify-error {
      background: #e74c3c;
      color: white;
      border: 1px solid #e43725; }
    .toastify.toastify-info {
      background: #3498db;
      color: white;
      border: 1px solid #258cd1; }
    .toastify span {
      display: block; }
    .toastify .toastify-title {
      font-weight: bold;
      margin-bottom: 10px; }
    .toastify .toastify-cancel-icon {
      position: absolute;
      top: 5px;
      font-size: 18px;
      right: 10px;
      cursor: pointer; }
  
`;

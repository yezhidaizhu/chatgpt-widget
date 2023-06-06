import { loadCssStr } from './utils';

/**
 * 注入所有需要的css样式
 */

export function loadDefaultCss() {
  // 滚动条
  loadCssStr(scrollbarStyleStr);
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

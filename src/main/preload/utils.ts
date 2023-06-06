export function loadScript(url: string, callback?: any) {
  if (!url) return;
  const script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

export function loadCss(url: string, callback?: any) {
  if (!url) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.onload = callback;

  document.head.appendChild(link);
}

export function createFaIcon(
  typeClass: string | string[] = [],
  attr: any = {}
): HTMLElement {
  const iconElement = document.createElement('i');
  const classList = typeof typeClass === 'string' ? [typeClass] : typeClass;
  iconElement.classList.add('fa', ...classList); // 使用 Font Awesome 的类名
  if (attr) {
    Object.assign(iconElement, attr);
  }
  return iconElement;
}

export function loadCssStr(str: string = '') {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(str));

  setTimeout(() => {
    document.head.appendChild(style);
  }, 3000);
}

import JSAlert from 'js-alert';

// pandors 链接下
export default function loadPandors() {
  if (!window.location.href.startsWith('https://chat.zhile.io')) return;

  // 解决登陆时的 prompt 弹出输入 token 的问题
  if (window.location.href.startsWith('https://chat.zhile.io/auth')) {
    const submitBtn = document.querySelector('#submit-token');
    console.log(`%c resolve prompt: ${!!submitBtn}`, 'color: #a3e635');

    submitBtn?.addEventListener('click', async () => {
      const accessToken = await JSAlert.prompt('Please input access token:');
      if (accessToken) {
        fetch('login_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body:
            'action=token&access_token=' +
            encodeURIComponent(accessToken) +
            '&next=' +
            encodeURIComponent(document.getElementById('txtNext').value),
        })
          .then((response) => response.json())
          .then((data) => {
            if (0 === data.code) {
              window.location.href = data.url;
            } else {
              alert(data.message);
            }
          })
          .catch((error) => console.error(error));
      }
    });
  } else {
    let timer: any;
    let count = 0;
    // eslint-disable-next-line prefer-const
    timer = setInterval(() => {
      const hasBtn = addEnterListener();
      console.log('%c wait submit btn dom ...', 'color: #fbbf24');

      if (hasBtn) {
        console.log('%c start listener enter key', 'color: #a3e635');
        clearInterval(timer);
      }
      count += 1;
      // 超过一定的次数，关闭
      if (count > 20) {
        clearInterval(timer);
      }
    }, 800);
  }

  // 解决宽度小的情况下，回车不能发送问题
  function addEnterListener() {
    const textarea = document.getElementById(
      'prompt-textarea'
    ) as HTMLTextAreaElement;
    const btn = textarea?.parentNode?.querySelector('button');

    if (!btn) return false;

    textarea?.addEventListener('keydown', (event: any) => {
      if (event.key.toLowerCase() === 'enter') {
        btn?.click();
      }
    });

    textarea?.addEventListener('input', () => {
      if (!textarea.value || textarea.value === '\n') {
        textarea.value = '';
        textarea.style.height = '24px';
      }
    });

    textarea?.addEventListener('change', () => {
      if (!textarea.value || textarea.value === '\n') {
        textarea.value = '';
        textarea.style.height = '24px';
      }
    });

    return true;
  }
}

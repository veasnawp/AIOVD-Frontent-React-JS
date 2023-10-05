// const localhost = (path?: string, port?: number) => `http://localhost:${port || 5500}${path || ''}`;
const localhost = (path?: string) => `${window.location.origin}${path || ''}`;
const headers = { headers: { Accept: 'application/json' } };

const staticIcons = (icon: string) => localhost(`/static/icons/${icon}`);

const addHeaders = (configs?: Record<string, any>, userAgent = false) => {
  return {
    headers: {
      ...headers.headers,
      ...(userAgent
        ? {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) InternetDownloadManagerbytCtT/1.0.0 Chrome/114.0.5735.248 Electron/25.3.2 Safari/537.36'
            // 'User-Agent':
            //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Safari/537.36'
          }
        : {}),
      ...configs
    }
  };
};

const localStaticIcons = () => {
  const icons = [
    'mp4-file.png',
    'mov-file.png',
    'wmv-file.png',
    'avi-file.png',
    'flv-file.png',
    'mkv-file.png',
    'hevc-mp4-file.png',
    'hevc-mkv-file.png',
    'iphone.png',
    'ipad.png',
    'android-phone.png',
    'android-tablet.png'
  ];
  return icons.map((icon) => staticIcons(icon));
};

export { localhost, headers, addHeaders, staticIcons, localStaticIcons };

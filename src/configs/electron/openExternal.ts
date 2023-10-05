import { Prettify } from '../../component/mantine/helpers/HelperType';

interface ResultProps extends Record<string, any> {
  // canceled: boolean;
  // filePath: string;
  // filePaths: string[];
}

interface OpenExternalProps {
  url: string | URL;
  options?: any;
  callback?: (result: Prettify<ResultProps>) => void;
  error?: (error: any) => void;
}
export const openExternal = (props: Prettify<OpenExternalProps>) => {
  window.electron.ipcRenderer
    .invoke('open-external', props.url, props.options)
    .then((result: Prettify<ResultProps>) => {
      props?.callback?.(result);
    })
    .catch((err) => props?.error?.(err));
};

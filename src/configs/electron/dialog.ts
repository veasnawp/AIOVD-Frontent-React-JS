import { Prettify } from '../../component/mantine/helpers/HelperType';

interface ResultProps extends Record<string, any> {
  canceled: boolean;
  filePath: string;
  filePaths: string[];
}
type CallbackName =
  | 'showErrorBox'
  | 'showMessageBox'
  | 'showMessageBoxSync'
  | 'showOpenDialogSync'
  | 'showOpenDialog'
  | 'showSaveDialog'
  | 'showSaveDialog'
  | 'showCertificateTrustDialog';

type Properties = 'openFile' | 'openDirectory' | 'multiSelections';

interface DialogConfigProps extends Record<string, any> {
  title?: string;
  buttonLabel?: string;
  properties?: Array<Properties>;
  filters?: Array<Record<string, any>>;
}

interface DialogProps {
  callbackName?: CallbackName;
  dialogConfig?: Prettify<DialogConfigProps>;
  callback?: (result: Prettify<ResultProps>) => void;
  error?: (error: any) => void;
}

export const dialogDefaultSelectFile = (config?: Prettify<DialogConfigProps>) =>
  ({
    title: 'Select a File',
    buttonLabel: 'Open File',
    properties: ['openFile', 'multiSelections'],
    // properties: ["openFile", "openDirectory", "multiSelections"],
    filters: [
      { name: 'Text File', extensions: ['txt'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    ...config
  } as Prettify<DialogConfigProps>);

export const dialog = (props?: Prettify<DialogProps>) => {
  const dialogConfig_ = props?.dialogConfig ?? {
    title: 'Select a Folder',
    buttonLabel: 'Select Folder',
    properties: ['openFile', 'openDirectory']
    // properties: ["openFile", "openDirectory", "multiSelections"],
  };
  window.electron.ipcRenderer
    .invoke('dialog', props?.callbackName || 'showOpenDialog', dialogConfig_)
    .then((result: Prettify<ResultProps>) => {
      props?.callback?.(result);
    })
    .catch((err) => props?.error?.(err));
};

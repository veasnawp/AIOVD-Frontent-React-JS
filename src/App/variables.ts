export const AppName = 'AppName';
export const cn = (cls: string) => `${AppName}-${cls}`;

export const switchColor = (dark: string, light: string) => ({ dark, light });
export const myTheme = {
  pink: '#D6336C',
  pinkTr: 'rgb(155 195 255 / 5%)',
  white: '#ffffff'
};
const domain_path =
  'https://phumikhmermov.local/wp-content/plugins/phumikhmer-blocks/assets/css/blogger/template/assets';
export const myLogo = {
  main: switchColor(
    domain_path + '/img/logo/logo-dark.png',
    domain_path + '/img/logo/logo-light.png'
  ),
  square: switchColor(
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjnF-4Apd3ORkALlAAJ_OJsv-RE9gD9b_Cc_y-mdT28TUy_bRyWd2nQAzZPupi2iBrV3lmdJhk-kr8HgDWht1eMf12vMGA9v1LVz2Uz75-T8eIKsqiuObPoN_hXgrf9XHeoCHPXbN3uhZ9ayxjAFC5QCfTYmjMqE_ZZWieQtMD--4LIwmsj49rrSEl4/s50/square-logo-dark.png',
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEju4o8hbAmXW8NJMDWW8p4HlSV_DgoDBXu_WBE3EvFIAukFYX2I6BwDLXqqt1MonvSrF_KU0PU5VtXfxPRbDUd2nGefbJ6lpVwfRMtZLCmeFrjp73xQQ4Unip1Uzgs6iQ-YR0mlAaniU1Pnxu5W8wIhqVL5dVZpTp4Sf9RLmlNNcFDjyKwgws9qTe1m/s50/square-logo-light.png'
  )
};
export const colorSchemes = {
  custom: (dark: string, light: string) => switchColor(dark, light),
  textAppearance: switchColor('Dark Theme', 'Light Theme'),
  defaultBGColor: switchColor('#1b2531', '#fafafb'),
  sectionBGColor: switchColor('rgb(40, 49, 66)', myTheme.white),
  sectionBGColorTr: (alpha: string | number) =>
    switchColor(`rgb(40, 49, 66, ${alpha})`, `rgb(255, 255, 255, ${alpha})`),
  sectionHoverBGColor: switchColor('rgb(45 55 75)', 'rgb(45 55 75, 5%)'),
  overSectionBGColor: switchColor('rgb(155 195 255 / 5%)', 'rgb(155 195 255 / 5%)'),
  headerColor: switchColor('rgba(255, 255, 255, 0.85)', 'rgb(69, 85, 96)'),
  headerColorHover: switchColor('rgba(255, 255, 255)', 'rgb(69, 85, 96)'),
  headingColor: switchColor('#d6d7dc', 'rgb(26, 51, 83)'),
  textColor: switchColor('#b4bed2', '#455560'),
  // textColor: switchColor("#b4bed2","#72849a"),
  linkHoverColor: switchColor(myTheme.white, myTheme.pink),
  sectionBorderColor: switchColor('#1c232f', '#f0f0f0'),
  borderColor: switchColor('rgb(77 91 117)', 'rgb(230 235 241)'),
  borderColorTr: (alpha: string) =>
    switchColor(`rgb(77 91 117 / ${alpha})`, `rgb(230 235 241 / ${alpha})`),
  boxShadow: switchColor(
    'rgba(0, 0, 0, 0.75) 0px 1px 8px -1px',
    'rgba(0, 0, 0, 0.15) 0px 1px 4px -1px'
  ),
  boxShadow2: switchColor(
    'rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.58) 0px 6px 16px 0px, rgba(0, 0, 0, 0.15) 0px 9px 28px 8px',
    'rgba(0, 0, 0, 0.08) 0px 6px 16px 0px, rgba(0, 0, 0, 0.12) 0px 3px 6px -4px, rgba(0, 0, 0, 0.05) 0px 9px 28px 8px'
  )
};

export const monthsName = [
  'January',
  'February',
  'May',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const currentDate = () => {
  const w = new Date();
  w.setDate(w.getDate());
  return `${monthsName[w.getMonth()]} ${w.getDate()}, ${w.getFullYear()}`;
};

export const currentTime = (withAmPm = true) => {
  const date = new Date();
  let hours = date.getHours();
  const minute = date.getMinutes();
  const am_pm = withAmPm ? (hours >= 12 ? ' pm' : ' am') : '';
  hours = withAmPm ? hours % 12 : hours;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutes = minute < 10 ? '0' + minute : minute;
  const strTime = hours + ':' + minutes + am_pm;
  return strTime;
};

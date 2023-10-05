// import { prototype } from "mini-css-extract-plugin";

//

export function isNumber(n: string | number) {
  return !isNaN(parseFloat(n as string)) && isFinite(n as number);
}

export function toCapitalized(words: string) {
  return words.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

export function isValidJSON(jsonString?: string) {
  if (jsonString != undefined) {
    try {
      var handleJsonString = jsonString
        .replace(/(\t|\n|\r|\  )/g, '')
        .replace(/\": "/g, '":"')
        .replace(/\,}/g, '}')
        .replace(/\,]/g, ']');
      var obj = JSON.parse(handleJsonString);
      // console.log(obj)
      if (obj && typeof obj === 'object') {
        return obj;
      }
    } catch (e) {}
  }
  return false;
}

type AscOrDesc = 'asc' | 'desc';

export function arraySort(arr: any[], ascOrDesc: AscOrDesc = 'asc', keys?: Record<string, any>) {
  return Array(...arr).sort(function (a, b) {
    const keysString = (val: any) => typeof keys === 'object' && val[keys.parent][keys.child];
    a = keys ? keysString(a).toLowerCase() : a.toLowerCase();
    b = keys ? keysString(b).toLowerCase() : b.toLowerCase();

    return ascOrDesc === 'asc' ? (a > b ? 1 : -1) : a > b ? -1 : 1;
    // if (a == b) return 0;
    // if (a > b) return 1;
    //   return ascOrDescNumber || -1;
  });
}

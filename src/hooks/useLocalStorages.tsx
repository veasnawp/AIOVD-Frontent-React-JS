import { useState, useEffect } from "react";

const getLocalValues = (key:string, initValue: string | any) => {
    //SSR Next.js
    if (typeof window === 'undefined') return initValue;

    // if a value is already store
    const localValue = JSON.parse(localStorage.getItem(key) as string);
    if (localValue) return localValue;

    // return result of a function
    if (initValue instanceof Function) return initValue();

    return initValue;
}

// export interface userLocalStorageValue {
//     value: any;
//     setValue: React.Dispatch<any>
// }
const useLocalStorages = (key:string, initValue?: string | unknown) => {
    const [value, setValue] = useState(() => {
        return getLocalValues(key, initValue);
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value])

    return [value, setValue];
}

export default useLocalStorages;
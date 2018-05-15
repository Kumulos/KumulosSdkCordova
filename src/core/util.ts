export const generateUUID = ():string => {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

export function urlEncodedParams(object, parentKey = null) {
    const keys = Object.keys(object);
    let parts = [];

    let val, key, encodedKey, encodedVal;
    for (let i = 0, len = keys.length; i < len; ++i) {
        key = keys[i];
        val = object[key];

        if (typeof val === 'object') {
            parts.push(urlEncodedParams(val, key));
            continue;
        }
        
        if (parentKey !== null) {
            encodedKey = `${encodeURIComponent(parentKey)}[${encodeURIComponent(key)}]`;
        }
        else {
            encodedKey = encodeURIComponent(key);
        }

        encodedVal = encodeURIComponent(val);

        parts.push(`${encodedKey}=${encodedVal}`);
    }

    return parts.join('&');
}

export const noop = () => {};
export const empty = str => !str || !str.length;
export const nullOrUndefined = val => val === null || val === undefined;

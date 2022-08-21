export const jsonObjectToArray = (obj: any) => {
    return objToArray(obj)
}

const isObject = (obj: any) => {
    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}

const objToArray = (obj: any): any => {
    return Object.keys(obj).map((key: any) => {
        return [
            key, isObject(obj[key]) ?
                objToArray(obj[key]) :
                obj[key]
        ];
    });
}

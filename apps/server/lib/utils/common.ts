export function isArray(x: any): boolean {
    return x && Object.prototype.toString.call(x) === '[object Array]';
}

export function toArray(value: any) : any[] {
    if (!value) return [];

    return isArray(value) ? value : [ value ];
}

import moment from 'moment';

export function isArray(x: any): boolean {
    if (!x) return false;

    return x && Object.prototype.toString.call(x) === '[object Array]';
}

export function toArray(value: any) : any[] {
    if (!value) return [];

    return isArray(value) ? value : [ value ];
}

export function flatten(arr: any[]): any[] {
    return toArray(arr).reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}


export function formatDate(date: Date | string, format?: string): string {
    if (!date) return '';
    const momentDate = moment(date).utc();

    return format
        ? momentDate.format(format)
        : momentDate.toISOString();
}

export class ResponseRefiner {
    static refineArray(data: any[], DTOClass: any): any[] {
        return data.map((item) => new DTOClass(item));
    }

    static refineObject(data: any, DTOClass: any) {
        return new DTOClass(data);
    }
}

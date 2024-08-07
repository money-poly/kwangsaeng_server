export class ProcessOrderUtil {
    static refine(order: string): string {
        return `ARRAY_POSITION(ARRAY[${String(order)}], "m"."id")`;
    }
}

export class LocationUtil {
    static R = 6371.0;

    static toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    static measureDistance(lat1: number, lat2: number, lon1: number, lon2: number) {
        const x1Rad = this.toRadians(lat1);
        const y1Rad = this.toRadians(lon1);
        const x2Rad = this.toRadians(lat2);
        const y2Rad = this.toRadians(lon2);

        const dx = x2Rad - x1Rad;
        const dy = y2Rad - y1Rad;

        const a = Math.sin(dx / 2) ** 2 + Math.cos(x1Rad) * Math.cos(x2Rad) * Math.sin(dy / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = this.R * c * 1000; // 거리 (단위: m)

        return distance;
    }

    static measurePickUpTime(cookingTime: number, lat1: number, lat2: number, lon1: number, lon2: number): string {
        const distance = this.measureDistance(lat1, lat2, lon1, lon2);

        const pickUpTime: number[] = [];
        if (distance < 200) {
            pickUpTime.push(5, 7);
        } else if (distance < 500) {
            pickUpTime.push(7, 10);
        } else if (distance < 1000) {
            pickUpTime.push(10, 15);
        } else {
            pickUpTime.push(15, 20);
        }

        const refinedPickUpTime = pickUpTime[0] + cookingTime + '~' + (pickUpTime[1] + cookingTime);
        return refinedPickUpTime;
    }
}

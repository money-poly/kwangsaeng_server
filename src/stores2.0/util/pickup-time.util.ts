export class PickUpTimeUtil {
    static measure(cookingTime: number, x1: number, x2: number, y1: number, y2: number): string {
        const R = 6371.0; // 지구의 반지름 (단위: km)

        const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

        const x1Rad = toRadians(x1);
        const y1Rad = toRadians(y1);
        const x2Rad = toRadians(x2);
        const y2Rad = toRadians(y2);

        const dx = x2Rad - x1Rad;
        const dy = y2Rad - y1Rad;

        const a = Math.sin(dx / 2) ** 2 + Math.cos(x1Rad) * Math.cos(x2Rad) * Math.sin(dy / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // 거리 (단위: km)

        const pickUpTime: number[] = [];
        if (distance < 0.2) {
            pickUpTime.push(5, 7);
        } else if (distance < 0.5) {
            pickUpTime.push(7, 10);
        } else if (distance < 1) {
            pickUpTime.push(10, 15);
        } else {
            pickUpTime.push(15, 20);
        }

        const refinedPickUpTime = pickUpTime[0] + cookingTime + '~' + (pickUpTime[1] + cookingTime);
        return refinedPickUpTime;
    }
}

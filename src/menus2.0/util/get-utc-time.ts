export function getUTCTime() {
    // 현재 시간을 나타내는 Date 객체 생성
    const now = new Date();

    // 한국 표준시(KST)로 변환
    const nowKST = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

    // 3시간을 밀리초로 변환 (3시간 * 60분 * 60초 * 1000밀리초)
    const threeHoursLaterKST = new Date(nowKST.getTime() + 3 * 60 * 60 * 1000);

    // 현재 시간 포맷
    const currentYear = nowKST.getFullYear();
    const currentMonth = String(nowKST.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
    const currentDay = String(nowKST.getDate()).padStart(2, '0');
    const currentHours = String(nowKST.getHours()).padStart(2, '0');
    const currentMinutes = String(nowKST.getMinutes()).padStart(2, '0');
    const currentSeconds = String(nowKST.getSeconds()).padStart(2, '0');

    // 3시간 후 시간 포맷
    const laterYear = threeHoursLaterKST.getFullYear();
    const laterMonth = String(threeHoursLaterKST.getMonth() + 1).padStart(2, '0');
    const laterDay = String(threeHoursLaterKST.getDate()).padStart(2, '0');
    const laterHours = String(threeHoursLaterKST.getHours()).padStart(2, '0');
    const laterMinutes = String(threeHoursLaterKST.getMinutes()).padStart(2, '0');
    const laterSeconds = String(threeHoursLaterKST.getSeconds()).padStart(2, '0');

    // ISO 형식으로 변환
    const isoStringCurrentKST = `${currentYear}-${currentMonth}-${currentDay}T${currentHours}:${currentMinutes}:${currentSeconds}`;
    const isoStringLaterKST = `${laterYear}-${laterMonth}-${laterDay}T${laterHours}:${laterMinutes}:${laterSeconds}`;

    return {
        now: isoStringCurrentKST,
        threeHoursLater: isoStringLaterKST,
    };
}

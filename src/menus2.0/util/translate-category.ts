const categoryTranslation = {
    korean: '한식',
    chinese: '중식',
    japanese: '일식',
    western: '양식',
    snack: '분식',
    cafe: '카페',
    dessert: '디저트',
    franchise: '프렌차이즈',
};

export function translateCategory(category: string): string {
    return categoryTranslation[category] || category;
}

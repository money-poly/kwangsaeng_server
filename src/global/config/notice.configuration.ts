import { registerAs } from '@nestjs/config';

export default registerAs('notice', () => ({
    noticeItems: [
        '메뉴 사진은 연출된 이미지로 실제 조리된 음식과 다를 수 있습니다.',
        '상단 메뉴 및 가격은 업소에서 제공한 정보를 기준으로 작성되었으며 변동될 수 있습니다.',
        '광생은 상품거래에 대한 동신판매중개자이며, 동신판매의 당사자가 아닙니다.',
        '따라서 광생은 상품 거래정보 및 거래에 대한 책임을 지지 않습니다.',
        '거래 상품에 대한 식품위생상의 모든 책임은 각 매장에 있습니다.',
    ],
}));
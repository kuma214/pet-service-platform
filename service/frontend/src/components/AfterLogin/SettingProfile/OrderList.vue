<template>
    <div id="afterLoginMain">
        <!-- 상단 바 -->
        <div class="top-bar">
            <!-- 왼쪽에 뒤로가기 버튼 -->
            <button class="back-button" @click="goBack">
                <svg
                    width="30px"
                    height="30px"
                    fill="#000000"
                    viewBox="0 0 200 200"
                    data-name="Layer 1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <title></title>
                        <path
                            d="M160,89.75H56l53-53a9.67,9.67,0,0,0,0-14,9.67,9.67,0,0,0-14,0l-56,56a30.18,30.18,0,0,0-8.5,18.5c0,1-.5,1.5-.5,2.5a6.34,6.34,0,0,0,.5,3,31.47,31.47,0,0,0,8.5,18.5l56,56a9.9,9.9,0,0,0,14-14l-52.5-53.5H160a10,10,0,0,0,0-20Z"
                        ></path>
                    </g>
                </svg>
            </button>

            <!-- 가운데에 '주문배송' 텍스트 -->
            <div class="search-title">주문배송</div>
        </div>

        <!-- 컨텐츠 영역 -->
        <div id="router-pages">
            <div class="pageContainer" v-if="orders.length > 0">
                <!-- 각각의 주문내역 -->
                <!-- 데이터 처리할 부분 : //이라는 표시를 해둠  -->
                <div class="itemContainer" v-for="order in orders" :key="order.id">
                    <div class="orderDate">
                        주문일: <b>{{ formatDate(order.buyingDate) }}</b>
                    </div>
                    <div class="whiteContentDiv">
                        <!-- 누구한테 보내지는지 + 상세보기버튼 -->
                        <div class="itemTopBar">
                            <!-- 배송현황으로 바꿔도 무방 -->
                            <div class="itemTopBarDiv"><b>to.</b>{{ order.receipient_name }}</div>
                        </div>
                        <hr style="margin: 0px !important" />
                        <!-- 제품 요약 -->
                        <div class="titleNimgDiv" v-for="product in order.orderProductList" :key="product.id">
                            <div style="display: flex">
                                <!-- 이미지div -->
                                <div class="imgDiv">
                                    <img
                                        :src="product.productMainImageUrl"
                                        style="width: inherit; height: inherit; border-radius: 10px"
                                    />
                                </div>
                                <!-- 제품에 대한 설명 -->
                                <div class="titleDiv">
                                    <div class="brandName">
                                        <div>풀무원</div>
                                    </div>
                                    <div class="itemName">
                                        <div
                                            style="
                                                overflow: hidden; /* 넘치는 부분을 숨김 */
                                                text-overflow: ellipsis; /* 말줄임(...) 처리 */
                                                white-space: nowrap; /* 줄 바꿈을 하지 않음 */
                                                width: 200px;
                                            "
                                        >
                                            {{ product.productName }}
                                        </div>
                                        <div>
                                            <!-- 상세보기 버튼 -->
                                            <div class="toggleBtn" @click="toggleDetails(order.id, product.id)">
                                                <button
                                                    style="
                                                        border: none;
                                                        background-color: transparent;
                                                        margin-right: 5px;
                                                    "
                                                >
                                                    <span v-if="isDetailsVisible(order.id, product.id)">▲</span>
                                                    <span v-else>▼</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="itemPrice">
                                        <b>{{ order.totalPrice }}</b
                                        >원
                                    </div>
                                    <div class="itemCount">수량 <span>1</span>개</div>
                                </div>
                            </div>
                            <!-- 주문번호 및 상세 -->
                            <div
                                v-if="isDetailsVisible(order.id, product.id)"
                                class="titleNimgDiv"
                                style="border-top: 1px solid lightgray; margin-top: 10px"
                            >
                                <div
                                    style="
                                        background-color: #f9f9f9;
                                        padding: 10px;
                                        display: flex;
                                        flex-direction: column;
                                        align-content: center;
                                    "
                                >
                                    <div class="detailContainer">
                                        <div style="flex: 3">주문번호</div>
                                        <div style="flex: 7">{{ order.id }}</div>
                                    </div>
                                    <div style="border: 1px solid lightgray"></div>
                                    <div class="detailContainer">
                                        <div style="flex: 3">배송상태</div>
                                        <div style="flex: 7">{{ product.shippingStatus }}</div>
                                    </div>
                                    <div style="border: 1px solid lightgray"></div>
                                    <div class="detailContainer">
                                        <div style="flex: 3">메모</div>
                                        <div style="flex: 7">{{ order.memo }}</div>
                                    </div>
                                    <div style="border: 1px solid lightgray"></div>
                                    <div class="detailContainer">
                                        <div style="flex: 3">배송지</div>
                                        <div style="flex: 7">서울시 동래구 온천동 럭키아파트 12동 1303호</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>주문 내역이 없습니다.</p>
            </div>
        </div>

        <!-- bottom bar -->
        <ButtomBar />
    </div>
</template>

<script>
import ButtomBar from '../Layouts/ButtomBar.vue';
export default {
    components: {
        ButtomBar,
    },
    data() {
        return {
            showDetailsMap: new Map(), // 각 주문의 상세 상태를 관리하는 Map
            orders: [
                {
                    id: 101,
                    totalPrice: 45000,
                    buyingDate: '2024-10-01T15:00:00Z',
                    receipient_name: '홍길동',
                    receipient_telNum: '010-1234-5678',
                    isAllShipping: '배송 완료',
                    orderProductList: [
                        {
                            id: 1,
                            productName: 'ANF 전연령 독 식스프리',
                            shippingStatus: '배송 중',
                            productMainImageUrl:
                                'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/2024/05/21/17/7/a88a31df-6c64-40e9-919a-678a7b3db597.jpg',
                        },
                        {
                            id: 2,
                            productName: '리브펫 반려동물 유산균',
                            shippingStatus: '배송 완료',
                            productMainImageUrl:
                                'https://thumbnail7.coupangcdn.com/thumbnails/remote/230x230ex/image/vendor_inventory/d499/6f33af5ed20d4ebaf93756ef3170f21086156fba07fdea05f31af1869d7f.png',
                        },
                    ],
                    memo: '문 앞에 두세요.',
                },
                {
                    id: 102,
                    totalPrice: 20000,
                    buyingDate: '2024-09-29T12:30:00Z',
                    receipient_name: '김철수',
                    receipient_telNum: '010-9876-5432',
                    isAllShipping: '배송 중',
                    orderProductList: [
                        {
                            id: 3,
                            productName: '탐사 전연령용 고양이 사료, 20kg, 닭, 1개',
                            shippingStatus: '배송 준비 중',
                            productMainImageUrl:
                                'https://thumbnail10.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/1244572466192737-bcd4cc5a-95a8-4135-8700-6089c262ca2b.jpg',
                        },
                    ],
                    memo: '경비실에 맡겨주세요.',
                },
            ],
        };
    },
    methods: {
        goBack() {
            window.history.back(); // 이전 페이지로 이동
        },
        toggleDetails(orderId, productId) {
            const key = `${orderId}-${productId}`; // 주문 ID와 상품 ID 조합
            const currentStatus = this.showDetailsMap.get(key) || false;
            this.showDetailsMap.set(key, !currentStatus);
            this.$forceUpdate(); // 상태 변경 강제 반영
        },
        isDetailsVisible(orderId, productId) {
            const key = `${orderId}-${productId}`; // 주문 ID와 상품 ID 조합
            return this.showDetailsMap.get(key) || false;
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
    },
};
</script>

<style scoped>
#afterLoginMain {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh; /* 전체 화면을 차지 */
}
#router-pages {
    background-color: #cee2f5;
    flex-grow: 1;
    overflow-y: auto;
    height: -webkit-fill-available;
    /* 스크롤바 숨기기 */
    scrollbar-width: none;
}
.pageContainer {
    flex-grow: 1;
    overflow-y: auto;
    height: 100%; /* 스크롤바 숨기기 */
    scrollbar-width: none;
}
.whiteContentDiv {
    display: flex;
    flex-direction: column;
    background-color: white;
    text-align: left;
    margin-right: 10px;
    margin-left: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 6px 0 rgba(34, 36, 38, 0.04);
}

/* 상단 바 스타일 */
.top-bar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: white;
    padding: 15px 10px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
}

/* 뒤로가기 버튼 스타일 */
.back-button {
    position: absolute;
    left: 10px;
    background: none;
    border: none;
    cursor: pointer;
}

/* 검색 제목 스타일 */
.search-title {
    font-size: 20px;
}
.orderDate {
    margin-top: 20px;
    text-align: left;
    padding-left: 20px;
    padding-bottom: 5px;
    font-size: 15px;
}
.itemTopBar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.itemTopBarDiv {
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 15px;
}
.itemDetailBtn {
    color: gray;
    font-size: 15px;
}
.titleNimgDiv {
    padding: 20px;
}
.imgDiv {
    width: 100px;
    height: 100px;
    background-color: gray;
    border-radius: 10px;
}
.titleDiv {
    display: flex;
    flex-direction: column;
    padding: 0 15px;
}
.brandName {
    color: lightgray;
    font-size: 12px;
    flex: 1;
}
.itemName {
    font-size: 18px;
    flex: 2;
    display: flex;
    justify-content: space-between;
}
.itemPrice {
    flex: 1;
}
.itemCount {
    color: lightgray;
    font-size: 12px;
    flex: 1;
}
.detailContainer {
    font-size: 14px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    display: flex;
}
</style>

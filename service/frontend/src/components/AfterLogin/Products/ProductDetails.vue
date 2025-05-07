<template>
    <div class="product-page">
        <div class="top-bar">
            <!-- 뒤로 가기 버튼 -->
            <button class="back-button" @click="goBack">
                <svg width="30px" height="30px" fill="#000000" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M160,89.75H56l53-53a9.67,9.67,0,0,0,0-14,9.67,9.67,0,0,0-14,0l-56,56a30.18,30.18,0,0,0-8.5,18.5c0,1-.5,1.5-.5,2.5a6.34,6.34,0,0,0,.5,3,31.47,31.47,0,0,0,8.5,18.5l56,56a9.9,9.9,0,0,0,14-14l-52.5-53.5H160a10,10,0,0,0,0-20Z"
                    />
                </svg>
            </button>
            <div class="main-title">상품 상세 정보</div>
        </div>

        <div v-if="product != null" class="main-content">
            <!-- Vue Swiper 이미지 슬라이더 -->
            <Swiper :slides-per-view="1" navigation pagination>
                <!-- 첫 번째 슬라이드에 mainimageurl 사용 -->
                <SwiperSlide v-if="product.mainimageurl">
                    <img :src="product.mainimageurl" alt="Main Product Image" class="product-image" />
                </SwiperSlide>

                <!-- 나머지 이미지들 슬라이드로 출력 -->
                <SwiperSlide v-for="(image, index) in product.imageUrls" :key="index">
                    <img :src="image" :alt="`Product image ${index + 1}`" class="product-image" />
                </SwiperSlide>
            </Swiper>

            <br />
            <h3>{{ product.name }}</h3>
            <div class="product-details">
                <div class="facility-rating">5.0 ★★★★★</div>
                <p style="color: red">{{ product.price }}원</p>
                <p style="font-size: 15px">제조사: {{ product.maker }}</p>
                <p style="font-size: 15px">원산지: {{ product.origin }}</p>

                <div class="tag-container">
                    <span class="tag">#{{ product.animalName }}</span>
                    <span class="tag">#{{ product.subtype }}</span>
                </div>

                <!-- 가로 줄 -->
                <hr class="horizontal-line" />

                <p class="small-text" v-for="(func, index) in product.function.split('/')" :key="index">
                    {{ func.trim() }}
                </p>

                <hr class="horizontal-line" />

                <p class="small-text" style="margin-bottom: 20px">원료: {{ product.allRawMaterial }}</p>
                <p class="small-text">영양 성분: {{ product.ingredient }}</p>
                <hr class="horizontal-line" />
                <p class="small-text">칼로리: {{ product.calories }}</p>
                <p class="small-text">총 무게: {{ product.weight }}</p>
                <p class="small-text">대상 연령: {{ product.ageGroup }}</p>
            </div>

            <div class="image-container">
                <img
                    v-for="(image, index) in product.detailImageUrls"
                    :key="index"
                    :src="image"
                    alt="상품 상세 이미지"
                    class="product-detail-image"
                />
            </div>
            <!-- 여기에 DetailImageUrls의 사진 전부 세로로 나열-->
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>

        <div class="sliding-payment-box" :class="{ show: isPaymentBoxVisible }" v-if="product">
            <div class="payment-content">
                <!-- 제품 정보 -->
                <div class="product-info-box">
                    <p style="flex: 7">1개당 가격: {{ product.price }}원</p>
                    <p id="free-delivery" style="flex: 2; color: red">무료 배송!</p>
                </div>

                <!-- 수량 입력 -->
                <div class="quantity-input-box">
                    <label for="quantity">구매 수량:</label>
                    <input type="number" id="quantity" v-model.number="quantity" min="1" @input="updateTotalPrice" />
                </div>

                <!-- 배송지 정보 -->
                배송지 정보
                <div class="primary-address-box" v-if="primaryAddress">
                    <div class="address-info">
                        <div>
                            <label for="address">{{ primaryAddress.address }}</label>
                        </div>
                        <div>
                            <label for="receiptant-info"
                                >{{ primaryAddress.receipientName }} ( {{ primaryAddress.receipientTellNum }} )</label
                            >
                        </div>
                    </div>
                    <button @click="changeAddress" class="change-address-button">주소변경</button>
                </div>

                <!-- 결제 금액 및 결제 버튼 -->
                <div class="submit-container">
                    <p>총 결제 금액: {{ totalPrice }}원</p>
                    <button @click="requestPayment" class="final-purchase-button">결제하기</button>
                </div>
            </div>
        </div>

        <!-- 하단의 구매하기 버튼과 장바구니 버튼 -->
        <div class="button-container">
            <!-- 장바구니 넣기 버튼 -->
            <button class="add-to-cart-button" @click="toggleHeart">
                <svg
                    v-if="isHeartFilled"
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="red"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                </svg>
                <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="none"
                    stroke="red"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    />
                </svg>
            </button>
            <button class="purchase-button" @click="showPaymentBox">구매하기</button>
        </div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css'; // CSS 임포트
import axios from 'axios';
import { fetchAddressList } from '@/fetch_datas/addressStore';

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    data() {
        return {
            product: null,
            unitPrice: 0,
            productId: this.$route.params.id,
            defaultImage: 'https://via.placeholder.com/300',
            isHeartFilled: false, // 하트가 채워져 있는지 여부를 추적
            isPaymentBoxVisible: false,
            quantity: 1,
            totalPrice: 0,
            impLoadingStatus: 'idle', // 'idle', 'loading', 'loaded', 'error'
            isLoading: true,
            primaryAddress: null,
        };
    },
    async created() {
        await this.fetchProductDetails(this.productId);
        await this.fetchPrimaryAddress();
    },
    methods: {
        async fetchPrimaryAddress() {
            const addressStore = fetchAddressList();
            await addressStore.fetchContents();
            if (addressStore.contents) {
                this.primaryAddress = addressStore.contents.find((address) => address.isPrimary === 'T');
            }
        },
        async fetchProductDetails(productId) {
            this.isLoading = true;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://localhost:8081/api/products/get/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                this.product = response.data;
                console.log(this.product);
                this.unitPrice = response.data.price;
                console.log(this.product.id);
            } catch (error) {
                console.error('Fetch ERROR!', error);
            } finally {
                this.isLoading = false;
            }
        },
        goBack() {
            this.$router.push('/products/feed');
        },
        purchaseProduct() {
            alert('구매 페이지로 이동합니다!');
        },
        toggleHeart() {
            this.isHeartFilled = !this.isHeartFilled;
            alert(this.isHeartFilled ? '장바구니에 추가되었습니다!' : '장바구니에서 제거되었습니다!');
        },
        showPaymentBox() {
            if (this.isPaymentBoxVisible === false) {
                this.isPaymentBoxVisible = true;
            } else {
                this.isPaymentBoxVisible = false;
            }

            this.updateTotalPrice();
        },
        updateTotalPrice() {
            this.totalPrice = this.product.price * this.quantity;
        },

        async loadImpScript() {
            this.impLoadingStatus = 'loading';
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.iamport.kr/v1/iamport.js';
                script.async = true;
                script.onload = () => {
                    if (window.IMP) {
                        window.IMP.init('imp05475712'); // 실제 상점식별코드로 변경 필요
                        this.impLoadingStatus = 'loaded';
                        resolve();
                    } else {
                        this.impLoadingStatus = 'error';
                        reject(new Error('IMP object not found'));
                    }
                };
                script.onerror = () => {
                    this.impLoadingStatus = 'error';
                    reject(new Error('Failed to load IMP script'));
                };
                document.head.appendChild(script);
            });
        },

        async requestPayment() {
            try {
                // 결제 모듈이 로드될 때까지 기다림
                await this.loadImpScript();

                // 모듈이 로드되지 않았을 경우 경고창 표시
                if (this.impLoadingStatus !== 'loaded') {
                    alert('결제 모듈이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
                    return;
                }

                // 결제 요청 진행
                const response = await new Promise((resolve, reject) => {
                    window.IMP.request_pay(
                        {
                            pg: 'html5_inicis',
                            pay_method: 'card',
                            merchant_uid: `${this.product.id}_${Date.now()}`,
                            name: this.product.name,
                            amount: this.totalPrice,
                            // buyer_email: 'buyer@example.com',
                            // buyer_name: '구매자이름',
                            // buyer_tel: '010-1234-5678',
                            // buyer_addr: '서울특별시 강남구 삼성동',
                            // buyer_postcode: '123-456',
                        },
                        (rsp) => {
                            if (rsp.success) {
                                resolve(rsp);
                            } else {
                                reject(new Error(rsp.error_msg));
                            }
                        },
                    );
                });

                // 결제가 성공했을 때
                const token = localStorage.getItem('token');
                const res = await axios.post(`https://localhost:8081/api/pay/${response.imp_uid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Payment successful', res);

                alert('결제가 완료되었습니다!');
                this.isPaymentBoxVisible = false;
            } catch (error) {
                // 결제 실패 시
                console.error('Payment failed', error);
                alert(`결제에 실패했습니다: ${error.message}`);
            }
        },
    },
};
</script>

<style scoped>
@import 'swiper/swiper-bundle.css';

.product-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #ffffff;
    width: 100%;
    margin: 0 auto;
    position: relative;
    padding-bottom: 60px; /* 하단 버튼 공간 확보 */
}

.top-bar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: white;
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
}

.back-button {
    position: absolute;
    left: 10px;
    background: none;
    border: none;
    cursor: pointer;
}

.main-title {
    font-size: 20px;
    text-align: center;
}

.main-content {
    overflow-y: auto; /* 세로 스크롤을 활성화 */
    max-height: calc(100vh - 120px); /* 상단 바와 버튼을 제외한 최대 높이 */
    scrollbar-width: none;
}

.product-image {
    width: 400px;
    height: 400px;
    max-width: 100%;
    max-height: 100%;
    object-fit: fill;
    border-radius: 10px;
    margin: 0 auto;
}

.product-details {
    margin: 20px;
    font-size: 18px;
    color: #333;
    text-align: left; /* 좌측 정렬 추가 */
}

.product-details p {
    margin-bottom: 5px;
}

.product-detail-image {
    width: 100%; /* 각 이미지가 가로로 100% 차지하도록 설정 */
    height: auto; /* 비율 유지 */
    max-width: none; /* 최대 너비 제한 제거 */
    padding: 10px 20px;
}

/* .button-container {
    display: flex;
    justify-content: space-between; 
    position: fixed; 
    bottom: 0; 
    left: 0; 
    width: 100%; 
    background-color: white; 
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); 
} */

.add-to-cart-button {
    flex: 2;
    padding: 15px;
    background-color: transparent; /* 배경 투명 */
    color: red; /* 하트의 기본 색상 */
    border: none;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-to-cart-button:hover {
    color: darkred; /* 호버 시 진한 빨강 */
}

.purchase-button {
    flex: 8; /* 구매하기 버튼의 비율 */
    padding: 15px;
    background-color: #007bff;
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.purchase-button:hover {
    background-color: #0056b3; /* 구매하기 버튼 호버 색상 */
}

.tag-container {
    display: flex;
    gap: 10px; /* 태그 사이의 간격 */
    margin: 10px 0; /* 상하 여백 */
}

.tag {
    background-color: #cee2f5; /* 태그 배경색 */
    color: #333; /* 텍스트 색상 */
    border-radius: 12px; /* 모서리 둥글게 */
    padding: 5px 10px; /* 여백 */
    font-size: 14px; /* 글자 크기 */
    display: inline-block; /* 블록 형태로 표시 */
}

.horizontal-line {
    border: 1.5px solid #b4b4b4; /* 줄 색상 */
    margin: 20px 0; /* 상하 여백 */
}

.small-text {
    font-size: 14px; /* 원하는 작은 폰트 사이즈로 설정 */
    color: #666; /* 텍스트 색상 (선택 사항) */
}
.facility-rating {
    font-size: 15px;
    display: flex;
    align-items: center;
    color: #ff6347; /* 0.0 숫자를 빨간색으로 */
    margin-bottom: 10px;
}

.button-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: white;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1001; /* 슬라이딩 박스보다 위에 표시 */
}

.sliding-payment-box {
    position: fixed;
    bottom: 60px;
    left: 0;
    width: 100%;
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    transform: translateY(100%);
}

.sliding-payment-box.show {
    transform: translateY(0);
}

.payment-content {
    padding: 20px;
    text-align: left;
}

/* 제품 정보 박스 */
.product-info-box {
    border-bottom: 1px solid #e0e0e0;
    display: flex;
}

/* 수량 입력 박스 */
.quantity-input-box {
    margin: 10px 0;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 10px;
}

.quantity-input input {
    width: 50px;
    margin-left: 10px;
}

/* 배송지 정보 박스 */
.primary-address-box {
    margin: 10px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
}

.change-address-button {
    background-color: #71a9db;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    flex: 2;
    height: 44px;
}

.final-purchase-button {
    background-color: #3596eb;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 4px;
    flex: 2;
    height: 44px;
}
.primary-address-box {
    display: flex;
}
.submit-container {
    display: flex;
    margin-bottom: 15px;
}
.submit-container p {
    flex: 7;
}
.address-info {
    flex: 7;
}
#quantity {
    margin-left: 10px;
}
</style>

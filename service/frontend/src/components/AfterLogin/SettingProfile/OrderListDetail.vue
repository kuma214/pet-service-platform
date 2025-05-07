<template>
    <div class="order-container">
        <div class="header" @click="toggleDetails">
            <span>to. {{ customerName }}</span>
            <button style="border: none; background-color: transparent; margin-right: 5px">
                <span v-if="showDetails">▲</span>
                <span v-else>▼</span>
            </button>
        </div>

        <div class="product-info">
            <img :src="productImage" alt="Product Image" class="product-image" />
            <div>
                <h3>{{ productName }}</h3>
                <p>{{ productPrice }}원</p>
                <p>수량 {{ productQuantity }}개</p>
            </div>
        </div>

        <div v-if="showDetails" class="order-details">
            <p>주문번호: {{ orderNumber }}</p>
            <button>영수증 조회</button>
            <p class="status">배송 완료</p>
            <div class="actions">
                <button>교환 요청</button>
                <button>반품 요청</button>
            </div>
            <div class="contact-buttons">
                <button class="chat">상담하기</button>
                <button class="inquiry">문의하기</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showDetails: false, // 세부 정보 표시 여부
            customerName: '최혜령',
            productImage: 'https://example.com/product.jpg', // 이미지 링크 또는 경로
            productName: '[단독] 찐~한 말차에 치즈, 오설록 프리미엄 녹차 치즈 케이크',
            productPrice: '31,900',
            productQuantity: 1,
            orderNumber: '2638852300',
        };
    },
    methods: {
        toggleDetails() {
            this.showDetails = !this.showDetails;
        },
    },
};
</script>

<style scoped>
.order-container {
    border: 1px solid #ddd;
    padding: 16px;
    border-radius: 8px;
    margin: 16px;
}

.header {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
}

.product-info {
    display: flex;
    margin-top: 12px;
}

.product-image {
    width: 80px;
    height: 80px;
    margin-right: 16px;
}

.order-details {
    margin-top: 12px;
}

.status {
    color: red;
    font-weight: bold;
}

.actions button {
    margin-right: 8px;
}

.contact-buttons button {
    margin-right: 8px;
}

.chat {
    background-color: #fee500;
    border: none;
    padding: 8px;
    cursor: pointer;
}

.inquiry {
    background-color: #ddd;
    border: none;
    padding: 8px;
    cursor: pointer;
}
</style>

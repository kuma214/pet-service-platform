<template>
    <div class="product-slider">
        <button @click="scrollLeft" class="scroll-button left" :disabled="isAtStart">&#8249;</button>
        <div class="products-container" ref="container">
            <!-- products 리스트를 v-for로 출력하여 각 상품을 표시 -->
            <div v-for="product in products" :key="product.id" class="product-item">
                <div class="relative">
                    <a @click.prevent="goToProductDetails(product.id)" class="block">
                        <!-- imageUrls의 첫 번째 이미지를 사용하여 이미지 출력 -->
                        <img
                            :src="product.mainimageurl ? product.mainimageurl : product.imageUrls[0]"
                            :alt="product.mainimageurl"
                            class="product-image"
                            width="146"
                            height="146"
                        />
                    </a>
                </div>
                <div class="product-info">
                    <a href="#" class="product-name">{{ product.name }}</a>
                    <span class="product-price">₩{{ product.price }}</span>
                </div>
            </div>
        </div>
        <button @click="scrollRight" class="scroll-button right" :disabled="isAtEnd">&#8250;</button>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // useRouter 임포트

// eslint-disable-next-line no-undef
const props = defineProps({
    products: {
        type: Array,
        required: true,
        default: () => [],
    },
    type: {
        type: String,
        required: true,
    },
});

const container = ref(null);
const isAtStart = ref(true);
const isAtEnd = ref(false);

// const defaultImage = 'https://via.placeholder.com/150';

const router = useRouter(); // router 정의

onMounted(async () => {
    console.log('Slider Type:', props.type); // 슬라이더 타입 확인
    console.log('Slider Products:', props.products);
    updateScrollState();
    if (container.value) {
        container.value.addEventListener('scroll', updateScrollState);
    }
});

// 상품 클릭 시 해당 상품의 ID로 라우팅
const goToProductDetails = (productId) => {
    router.push({ name: 'ProductDetails', params: { id: productId } });
};

// watch로 props 변경 시 scroll 상태를 업데이트
watch(props.products, () => {
    updateScrollState();
});

const scrollLeft = () => {
    if (container.value) {
        container.value.scrollLeft -= 200;
        updateScrollState();
    }
};

const scrollRight = () => {
    if (container.value) {
        container.value.scrollLeft += 200;
        updateScrollState();
    }
};

const updateScrollState = () => {
    if (container.value) {
        isAtStart.value = container.value.scrollLeft <= 0;
        isAtEnd.value = container.value.scrollLeft + container.value.clientWidth >= container.value.scrollWidth;
    }
};
</script>

<style scoped>
.product-slider {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.products-container {
    display: flex;
    overflow-x: auto;
    scroll-behavior: smooth;
    -ms-overflow-style: none;
    scrollbar-width: none;
    padding: 10px 0;
}

.products-container::-webkit-scrollbar {
    display: none;
}

.product-item {
    flex: 0 0 auto;
    width: 148px;
    margin-right: 10px;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    background-color: #fff;
}

.product-image {
    width: 100%;
    height: 146px;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
}

.product-info {
    padding: 10px;
}

.product-name {
    display: block;
    margin-bottom: 5px;
    color: #333;
    text-decoration: none;
    font-size: 0.8em;
    height: 58px;
    align-content: center;
}

.product-price {
    font-weight: bold;
    font-size: 0.9em;
}

.scroll-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(255, 255, 255, 0.7);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 24px;
    z-index: 10;
    cursor: pointer;
}

.scroll-button.left {
    left: 10px;
}

.scroll-button.right {
    right: 10px;
}

.scroll-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.wishlist-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: white;
    border: 1px solid #e5e5e5;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    font-size: 18px;
    cursor: pointer;
}
</style>

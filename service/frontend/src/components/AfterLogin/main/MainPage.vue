<template>
    <div class="main-page">
        <!-- 프로필 로딩 상태 -->
        <div v-if="!profileLoaded" class="loading-container">
            <span class="spinner"></span>
            <p>프로필 정보를 불러오고 있습니다...</p>
        </div>

        <!-- 전체 상품 로딩 중인 경우 -->
        <div v-else-if="profileLoaded && !allProductsLoaded" class="loading-container">
            <span class="spinner"></span>
            <p>전체 상품을 불러오고 있습니다...</p>
        </div>

        <!-- 맞춤형 상품 로딩 중인 경우 -->
        <div v-else-if="allProductsLoaded && !personalizedLoaded" class="loading-container">
            <span class="spinner"></span>
            <p>맞춤형 상품을 불러오고 있습니다...</p>
        </div>
        <!-- 중간 이미지 섹션 (4분할) -->
        <!-- 모든 데이터가 로드된 경우 -->
        <div v-else class="middle-section">
            <!-- 첫 번째 섹션 -->
            <div class="section-item" @click.stop="navigateToPage('MapsPage', 'facility')">
                <!-- <div id="title-container">
                    <div id="title-p-container">{{ profileName }}의 맞춤 시설 찾기</div>
                    <div id="title-img-container">
                        <img class="icon" src="@/assets/icon-right-arrow.svg" alt="Right Arrow Icon" />
                    </div>
                </div> -->
                <img src="@/assets/animal_hospital.jpg" alt="Animal Hospital" />
            </div>
            <!-- 두 번째 섹션 -->
            <div class="section-item">
                <div id="title-container">
                    <div id="title-p-container">
                        <span style="font-size: 17px; font-weight: bold">{{ profileName }} </span> 건강 맞춤 사료
                        <img
                            style="margin-left: 5px; height: 25px; width: 25px"
                            class="icon"
                            src="@/assets/icon-feed.svg"
                            alt="snack"
                        />
                    </div>
                    <div id="title-img-container">
                        <img
                            class="icon"
                            src="@/assets/icon-right-arrow.svg"
                            alt="Right Arrow Icon"
                            @click.stop="navigateToPage('ProductPage', 'feed')"
                        />
                    </div>
                </div>
                <!-- 필터링된 feedProducts를 ProductSlider 컴포넌트에 props로 전달 -->
                <ProductSlider :products="feedProducts" :type="'feed'" />
            </div>

            <!-- 세 번째 섹션 -->
            <div class="section-item">
                <div id="title-container">
                    <div id="title-p-container">
                        <span style="font-size: 17px; font-weight: bold">{{ profileName }}</span> 맞춤 간식
                        <img
                            style="margin-left: 5px; height: 25px; width: 25px"
                            class="icon"
                            src="@/assets/icon-snack.svg"
                            alt="snack"
                        />
                    </div>

                    <div id="title-img-container">
                        <img
                            class="icon"
                            src="@/assets/icon-right-arrow.svg"
                            alt="Right Arrow Icon"
                            @click.stop="navigateToPage('ProductPage', 'snack')"
                        />
                    </div>
                </div>
                <!-- 필터링된 snackProducts를 ProductSlider 컴포넌트에 props로 전달 -->
                <ProductSlider :products="snackProducts" :type="'snack'" />
            </div>

            <!-- 네 번째 섹션 -->
            <div class="section-item">
                <div id="title-container">
                    <div id="title-p-container">
                        <span style="font-size: 17px; font-weight: bold">{{ profileName }}</span> 맞춤 영양제
                        <img
                            style="margin-left: 5px; height: 25px; width: 25px"
                            class="icon"
                            src="@/assets/icon-supplement.svg"
                            alt="snack"
                        />
                    </div>
                    <div id="title-img-container">
                        <img
                            class="icon"
                            src="@/assets/icon-right-arrow.svg"
                            alt="Right Arrow Icon"
                            @click.stop="navigateToPage('ProductPage', 'supplement')"
                        />
                    </div>
                </div>
                <!-- 필터링된 supplementProducts를 ProductSlider 컴포넌트에 props로 전달 -->
                <ProductSlider :products="supplementProducts" :type="'supplement'" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentProfileStore } from '@/fetch_datas/currentProfileStore';
import { useProductStore } from '@/stores/productStore';
import { storeToRefs } from 'pinia';
import ProductSlider from './ProductSlider.vue';

const router = useRouter();
const profileStore = useCurrentProfileStore();
const productStore = useProductStore();
const { contents } = storeToRefs(profileStore);
// const { products } = storeToRefs(productStore);
const { personalizedFeedProducts, personalizedSnackProducts, personalizedSupplementProducts } =
    storeToRefs(productStore);

const profileLoaded = ref(false); // 프로필 데이터 로딩 여부
const allProductsLoaded = ref(false); // 전체 상품 로딩 여부
const personalizedLoaded = ref(false); // 맞춤형 상품 로딩 완료 여부

onMounted(async () => {
    try {
        const profilePromise = profileStore.fetchContents().then(() => {
            profileLoaded.value = true;
        });

        const productsPromise = productStore.fetchAllProducts().then(() => {
            allProductsLoaded.value = true;
        });

        // 프로필과 전체 상품 병렬 로딩
        await Promise.all([profilePromise, productsPromise]);

        // 맞춤형 상품은 비동기적으로 로드
        await Promise.all([
            productStore.fetchPersonalizedProductsByType('feed'),
            productStore.fetchPersonalizedProductsByType('snack'),
            productStore.fetchPersonalizedProductsByType('supplement'),
        ]).then(() => {
            personalizedLoaded.value = true;
        });
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

const profileName = computed(() => contents.value?.name || '반려동물');

// 프로필의 동물 타입을 확인하기 위해 animalType을 추출
const profileAnimalType = computed(() => {
    // contents가 존재하고, animalDetailDTO 및 animalDTO가 존재할 경우 animalDTO의 name을 반환
    return contents.value?.animalDetailDTO?.animalDTO?.name;
});

// 상품 타입에 따라 필터링된 상품들을 computed로 정의
const feedProducts = computed(() =>
    personalizedFeedProducts.value.filter(
        (product) => product.type === 'feed' && product.animalName === profileAnimalType.value,
    ),
);
const snackProducts = computed(() =>
    personalizedSnackProducts.value.filter(
        (product) => product.type === 'snack' && product.animalName === profileAnimalType.value,
    ),
);
const supplementProducts = computed(() =>
    personalizedSupplementProducts.value.filter(
        (product) => product.type === 'supplement' && product.animalName === profileAnimalType.value,
    ),
);

const navigateToPage = (pageName, type) => {
    router.push({ name: pageName, params: { type } });
};
</script>

<style scoped>
.main-page {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 5px;
    background-color: white;
}

.middle-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    background-color: white;
    padding: 0px;
    border-radius: 8px;
}

.section-item {
    width: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.section-item #title-container {
    display: flex; /* Flex 레이아웃 적용 */
    justify-content: space-between; /* 요소들을 양쪽 끝에 배치 */
    align-items: center; /* 수직 가운데 정렬 */
    padding: 10px 10px;
    /* background-color: #539ee0; */
    background-color: #2376e9;
    color: #fff;
    margin: 0;
    font-size: 14px;
}

#title-img-container {
    display: flex;
    justify-content: flex-end;
}

#title-img-container img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

#title-p-container {
    margin-left: 5px;
}

.section-item img {
    width: 100%;
    max-width: 500px;
    height: 200px;
    object-position: center; /* 이미지의 중심을 기준으로 배치 */
    object-fit: cover;
}

.icon {
    filter: invert(100%) sepia(0%) saturate(7483%) hue-rotate(253deg) brightness(108%) contrast(104%);
}

/* 로딩 컨테이너: 중앙 정렬 */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh; /* 화면 전체 높이 */
    background-color: #ffffff;
}

/* 스피너 스타일 */
.spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #3498db;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 10px;
}

/* 스피너 회전 애니메이션 */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 로딩 메시지 스타일 */
.loading-container p {
    font-size: 18px;
    color: #555;
    margin-top: 10px;
}
</style>

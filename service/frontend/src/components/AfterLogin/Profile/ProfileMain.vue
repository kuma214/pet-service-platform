<template>
    <div id="profile-page">
        <div id="profile-page-title">현재 반려동물 프로필</div>
        <div id="profile-info">
            <div id="profile-img">
                <div id="profile-img-container">
                    <img v-if="contents && contents.pictureUrl" :src="contents.pictureUrl" :alt="contents.name" />
                    <img v-else src="@/assets/jangoon.gif" />
                </div>
            </div>
            <div id="profile-name">
                <!-- Check if contents and name exist before rendering -->
                <p v-if="contents && contents.name">{{ contents.name }}</p>
                <p v-else>Loading...</p>
                <!-- Display fallback text while loading -->
            </div>
            <div id="edit-button">
                <img src="@/assets/icon-edit.svg" alt="Edit Icon" />
            </div>
            <div id="custom-info-reg-button" @click="goToSettings">
                <span
                    style="
                        display: inline-block;
                        text-align: center;
                        vertical-align: middle;
                        line-height: 30px;
                        height: 30px;
                    "
                    >프로필 변경 <img src="@/assets/icon-setting.svg" alt="Setting Icon"
                /></span>
            </div>
        </div>
        <div id="services">
            <div id="main-services">
                <div id="check-delivery">
                    <router-link to="/product/order" class="no-underline">
                        <img class="icon" src="@/assets/icon-delivery.svg" alt="Delivery Icon" />
                        <p class="title">주문배송</p>
                        <p class="subtitle">확인하기</p>
                    </router-link>
                </div>
                <div id="reg-receipt">
                    <img
                        class="icon"
                        src="@/assets/icon-scan.svg"
                        alt="Register Receipt Icon"
                        @click="goToUploadReceipt"
                    />
                    <p class="title">진료영수증</p>
                    <p class="subtitle">등록하기</p>
                </div>
                <div id="find-facilities">
                    <img class="icon" src="@/assets/icon-building.svg" alt="Facilities Icon" @click="goToMaps" />
                    <p class="title">맞춤형</p>
                    <p class="subtitle">시설찾기</p>
                </div>
                <div id="shopping-cart">
                    <img class="icon" src="@/assets/icon-shopping-cart.svg" alt="Shopping Cart Icon" />
                    <p class="title">장바구니</p>
                    <p class="subtitle">확인하기</p>
                </div>
            </div>

            <div id="separating-line"></div>
            <div id="sub-services">
                <div id="medical-history">
                    <img class="icon" src="@/assets/icon-receipt.svg" alt="Medical Receipt Icon" />
                    <div class="title">전체 진료 내역 확인하기</div>
                </div>
                <div id="health-history" @click="goToCurrentHealth">
                    <img class="icon" src="@/assets/icon-health.svg" alt="Medical Receipt Icon" />
                    <div class="title">현재 건강 상태 보기/내보내기</div>
                </div>
            </div>
        </div>
        <div id="supplying-products">
            <div id="supplying-products-title-container">
                <div id="title-p-container">
                    <div id="supplying-products-title">현재 급여중인 상품들</div>
                </div>
                <div id="title-img-container">
                    <img class="icon" src="@/assets/icon-right-arrow.svg" alt="Right Arrow Icon" />
                </div>
            </div>
            <div id="categories-section">
                <div id="categories-container">
                    <div id="feed" @click="selectCategory('feed')">
                        <p>사료</p>
                    </div>
                    <div id="snack" @click="selectCategory('snack')">
                        <p>간식</p>
                    </div>
                    <div id="supplement" @click="selectCategory('supplement')">
                        <p>영양제</p>
                    </div>
                </div>
            </div>
            <div id="section-item">
                <MyPetProductSlider :products="displayedProducts" />
            </div>
        </div>
        <!-- <div id="latest-bought-items"></div> -->
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useCurrentProfileStore } from '@/fetch_datas/currentProfileStore';
import { useProductStore } from '@/stores/productStore';
import { ref, computed, watch, onMounted } from 'vue';
import MyPetProductSlider from './MyPetProductSlider.vue';
import { storeToRefs } from 'pinia';

export default {
    name: 'ProfileMainPage',
    components: {
        MyPetProductSlider,
    },
    setup() {
        const router = useRouter();
        const profileStore = useCurrentProfileStore();
        const productStore = useProductStore();
        const { contents } = storeToRefs(profileStore);
        const { products } = storeToRefs(productStore);

        const selectedCategory = ref(''); // 초기값을 '사료'로 설정
        onMounted(async () => {
            await profileStore.fetchContents();
            await productStore.fetchAllProducts();

            // onMounted에서 기본 카테고리 (feed) 스타일 설정 #71a9db
            const defaultElement = document.getElementById('feed');
            if (defaultElement) {
                defaultElement.style.backgroundColor = '#2376e9';
                defaultElement.style.color = 'white';
            }
            // console.log('Fetched Products:', products.value);
        });

        // 프로필의 동물 타입을 확인하기 위해 animalType을 추출
        const profileAnimalType = computed(() => {
            // contents가 존재하고, animalDetailDTO 및 animalDTO가 존재할 경우 animalDTO의 name을 반환
            return contents.value?.animalDetailDTO?.animalDTO?.name;
        });

        const feedProducts = computed(() =>
            products.value.filter(
                (product) => product.type === 'feed' && product.animalName === profileAnimalType.value,
            ),
        );

        const snackProducts = computed(() =>
            products.value.filter(
                (product) => product.type === 'snack' && product.animalName === profileAnimalType.value,
            ),
        );

        const supplementProducts = computed(() =>
            products.value.filter(
                (product) => product.type === 'supplement' && product.animalName === profileAnimalType.value,
            ),
        );

        const displayedProducts = computed(() => {
            switch (selectedCategory.value) {
                case 'feed':
                    return feedProducts.value;
                case 'snack':
                    return snackProducts.value;
                case 'supplement':
                    return supplementProducts.value;
                default:
                    return feedProducts.value;
            }
        });

        const selectCategory = (category) => {
            selectedCategory.value = category;
        };

        const goToUploadReceipt = () => {
            router.push('/main/upload_receipt');
        };

        const goToMaps = () => {
            router.push('/main/maps');
        };

        const goToCurrentHealth = () => {
            router.push('/main/profile/current-health');
        };

        const goToSettings = () => {
            router.push('/main/settings');
        };
        // selectedCategory가 변경될 때마다 실행되는 watch 함수
        watch(
            selectedCategory,
            (newCategory) => {
                const categories = ['feed', 'snack', 'supplement'];
                categories.forEach((category) => {
                    const element = document.getElementById(category);
                    if (element) {
                        element.style.backgroundColor = category === newCategory ? '#2376e9' : 'white';
                        element.style.color = category === newCategory ? 'white' : 'black';
                    }
                });
            },
            { immediate: true },
        );

        return {
            selectedCategory,
            displayedProducts,
            contents,
            selectCategory,
            goToUploadReceipt,
            goToMaps,
            goToCurrentHealth,
            goToSettings,
        };
    },
};
</script>

<style scoped>
#profile-page {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    /* padding: 20px; */
    box-sizing: border-box;
}

#profile-page-title {
    margin-top: 15px;
    font-size: 20px;
    margin-bottom: 20px;
}

#profile-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #f8f8f8;
    border-radius: 10px;
    width: 95%;
    padding: 10px;
    height: 100px;
    margin-bottom: 20px;
    text-align: left;
    margin-left: 10px;
    margin-right: 10px;
}

#profile-img-container img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
}

#profile-name {
    flex-grow: 1;
    margin-left: 20px;
}

#edit-button {
    margin: 0 10px;
}

#edit-button img {
    width: 20px;
    height: 20px;
}

#custom-info-reg-button img {
    width: 25px;
    height: 25px;
}

#custom-info-reg-button {
    border-radius: 10px;
    border: 1px solid white;
    /* background-color: #539ee0; */
    /* background-color: #1860c3; */
    background-color: #2376e9;
    padding: 2px 6px 2px 10px;
    color: white;
    white-space: nowrap;
}

#profile-name p,
#custom-info-reg-button p {
    margin: 0;
}

#services,
#supplying-products,
#latest-bought-items {
    margin-bottom: 20px;
    /* Add more styles for these sections as needed */
}

#separating-line {
    border-top: 1px solid #ccc;
    margin: 10px 0;
}

#services {
    border-radius: 10px;
    border: 2px solid white;
    width: 95%;
    background-color: white;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
}

#main-services {
    display: flex;
    flex-direction: row; /* 가로로 배치 */
    justify-content: space-between; /* 요소들 간에 균등한 간격 */
    align-items: center;
    border-radius: 10px;
    border: 1px solid white;
    background-color: white;
    width: 100%; /* 전체 너비 차지 */
}

#check-delivery,
#reg-receipt,
#find-facilities,
#shopping-cart {
    flex: 1; /* 각 요소가 동일한 너비를 가짐 */
    margin: 0 10px; /* 요소 간의 간격 */
    text-align: center; /* 요소 안의 내용 중앙 정렬 */
}

#check-delivery img,
#reg-receipt img,
#find-facilities img,
#shopping-cart img {
    width: 50px; /* 이미지 너비 */
    height: 50px; /* 이미지 높이 */
    object-fit: cover; /* 이미지를 잘라내지 않고 비율에 맞춰 표시 */
}

p {
    margin: 5px 0;
}

.title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

.subtitle {
    font-size: 14px;
    color: #555;
}

/* 가운데 구분선 */
#separating-line {
    border-top: 1px solid #71a9db;
    width: 100%;
    margin: 20px 0;
}

#sub-services {
    border-radius: 10px;
    border: 2px solid white;
    background-color: #f9f9f9;
    width: 100%;
    padding: 15px;
    /* height: 1000px; */
}

#medical-history,
#health-history {
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 10px;
    margin-bottom: 10px;
    background-color: #fff;
    border-radius: 5px;
    border: 1px, solid, #71a9db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#medical-history img,
#health-history img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
}

/* invert(77%) sepia(8%) saturate(5399%) hue-rotate(179deg) brightness(90%) contrast(90%)*/
.icon {
    filter: invert(42%) sepia(8%) saturate(5399%) hue-rotate(179deg) brightness(105%) contrast(90%);
}
#supplying-products {
    border-radius: 10px;
    border: 2px solid white;
    width: 95%;
    background-color: white;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
}
#supplying-products-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 5px;
}

#title-p-container {
    width: 90%;
    text-align: left;
    margin-left: 10px;
}
#title-img-container {
    width: 10%;
}

#supplying-products-title-container img {
    width: 20px;
    height: 20px;
}

#categories-section {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 5px;
}
#categories-container {
    display: flex;
    justify-content: space-between;
    width: 80%;
}

#feed,
#snack,
#supplement {
    border-radius: 20px;
    border: 1px solid #71a9db;
    background-color: white;
    width: -moz-fit-content;
    width: 100%;
    padding: 2px;
    font-size: 14px;
    margin-right: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

#section-item {
    position: relative;
    width: 100%;
}

.no-underline {
    text-decoration: none;
}
</style>

<template>
    <div id="topBar2">
        <div id="mgng-back" class="back_btn" @click="goToBack">
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
        </div>
        <div id="mgng-title">
            <div v-if="isSettingPage">주소록 관리</div>
            <div v-if="isAddAddressPage">주소록 추가</div>
            <div v-if="isAddressSearchPage">주소 검색</div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    setup() {
        const route = useRoute(); // 현재 라우트 정보를 얻음
        const router = useRouter(); // 라우터 인스턴스 사용

        // 현재 경로 확인
        const isSettingPage = computed(() => route.path === '/address-setting');
        const isAddAddressPage = computed(() => route.path === '/address-setting/add');
        const isAddressSearchPage = computed(() => route.path === '/address-setting/search');

        // 뒤로가기 함수
        const goToBack = () => {
            router.go(-1);
        };

        return {
            isSettingPage,
            isAddAddressPage,
            isAddressSearchPage,
            goToBack,
        };
    },
};
</script>

<style scoped>
#topBar2 {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: white;
    padding: 15px 10px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1.5px solid #71a9db;
}
#mgng-title {
    font-size: 20px;
}
#mgng-back {
    position: absolute;
    left: 10px;
    background: none;
    border: none;
    cursor: pointer;
}
#mgng-skip {
    text-align: right;
}
.skip_btn {
    color: lightgray;
}
.skip_btn:hover {
    background-color: rgb(150, 150, 150);
}
.back_btn:hover {
    background-color: lightgray;
}
</style>

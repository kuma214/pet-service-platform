<template>
    <div v-if="isAddAddressPage" @click="saveAddress" class="saveAddressBtn">
        <div>&nbsp; 저장하기</div>
    </div>

    <div v-if="isSettingPage" @click="goToAddAddress" class="addAddressBtn">
        <div>&nbsp; 주소 추가 하기</div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
export default {
    props: {
        saveAddress: {
            type: Function, // 함수 타입 지정
            required: true, // 필수 프로퍼티로 지정
        },
    },
    setup() {
        const route = useRoute();
        const router = useRouter();

        // 현재 경로가 '/1'인지를 확인
        const isSettingPage = computed(() => route.path === '/address-setting');
        const isAddAddressPage = computed(() => route.path === '/address-setting/add');
        const isAddressSearchPage = computed(() => route.path === '/address-setting/add/search');
        const goToAddAddress = () => {
            router.push({ name: 'AddAddressPage' });
        };

        return {
            isSettingPage,
            isAddAddressPage,
            isAddressSearchPage,
            goToAddAddress,
        };
    },
    methods: {},
};
</script>

<style>
.saveAddressBtn {
    display: flex;
    justify-content: center;
    height: 70px;
    align-items: center;
    background-color: #539ee0;
    color: white;
    position: absolute;
    width: 100%;
    bottom: 0px;
}
.addAddressBtn {
    display: flex;
    justify-content: center;
    height: 70px;
    align-items: center;
    background-color: #539ee0;
    color: white;
    position: absolute;
    width: 100%;
    bottom: 0px;
}
#bottomBar {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #539ee0;
    color: white;
    height: 80px;
}
/* .nextBtn {
    cursor: pointer;
    border: 1px solid #1860c3;
    font-size: 15px;
    padding: 10px 0px;
    border-radius: 5px;
    width: 50%;
    background-color: #2276e9;
    color: white;
    text-align: center;
}
.nextBtn:hover {
    opacity: 80%;
} */
</style>

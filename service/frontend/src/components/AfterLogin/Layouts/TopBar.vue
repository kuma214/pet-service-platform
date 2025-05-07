<template>
    <div id="topBar">
        <div id="mgng-name" @click="navigateToMain">
            <p>멍지냥지</p>
        </div>
        <div id="mgng-img">
            <div class="image-container">
                <img src="@/assets/mgng.gif" alt="MGNG Logo" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';

// Vue Router 사용을 위해 useRouter 훅을 호출합니다.
const router = useRouter();

// main 페이지로 이동하는 함수
const navigateToMain = () => {
    router.push({ name: 'MainPage' }); // 라우터 네임을 사용하여 이동
};
</script>
<style scoped>
#topBar {
    display: flex;
    border-bottom: 1.5px solid #71a9db;
    justify-content: space-between;
    align-items: center;
    background-color: white;
    height: 80px;
    /* margin-bottom: 5px; */
    padding: 0 15px;
}

#mgng-name {
    text-align: left;
}

#mgng-name p {
    font-family: 'HancomMalangMalang-Regular', sans-serif;
    font-size: 26px;
    font-weight: bold;
    margin: 0;
}

#mgng-img {
    text-align: right;
}

.image-container {
    width: 115px;
    height: 75px;
    overflow: hidden;
    position: relative;
}

.image-container img {
    position: absolute;
    top: -25px;
    left: 0;
    width: 115px;
    height: 120px;
    -o-object-fit: cover;
    object-fit: cover;
}
</style>

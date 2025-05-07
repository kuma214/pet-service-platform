<template>
    <div id="container">
        <div class="mgng-beforeLoginMain">멍지냥지</div>
        <div class="mgng-gif">
            <div class="image-cropper">
                <img :src="require('@/assets/mgng.gif')" alt="mgng gif" />
            </div>
        </div>

        <div id="info-text-container">
            <div class="info-text">
                <vue-typewriter-effect
                    style="font-size: 22px"
                    :strings="['소중한 반려, <br>멍지냥지와 함께 <br>맞춤 관리 하세요!']"
                    :pauseFor="3000"
                />
            </div>
        </div>
        <hr class="horizontal-line" />

        <div class="login-box">
            <div class="login-input-fields">
                <form @submit.prevent="login" class="login-form">
                    <div class="input-container">
                        <div class="input-group">
                            <input
                                type="text"
                                v-model="authStore.username"
                                class="form-control"
                                name="username"
                                placeholder="아이디 입력"
                            />
                            <input
                                type="password"
                                v-model="authStore.password"
                                class="form-control"
                                name="password"
                                placeholder="비밀번호 입력"
                            />
                        </div>
                    </div>
                    <button type="submit" class="submit-btn">로그인</button>
                </form>
                <!-- <button id="signup" class="signup-btn" @click="goToSignup">회원가입</button> -->
                <span class="signup-text" @click="goToSignup">회원가입</span>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/post_datas/loginStore';
import { ref, onMounted } from 'vue';

export default {
    name: 'BeforeLoginMain',
    setup() {
        const authStore = useAuthStore();
        const isMounted = ref(false);

        onMounted(() => {
            isMounted.value = true;
        });

        const goToSignup = () => {
            window.location.href = '/signup';
        };

        return {
            authStore,
            isMounted,
            login: authStore.login,
            goToSignup,
        };
    },
};
</script>

<style scoped>
#login-button,
#signup-button {
    display: flex;
    justify-content: center;
    margin: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.mgng-beforeLoginMain {
    font-family: 'HancomMalangMalang-Regular', sans-serif;
    font-size: xxx-large;
    font-weight: bold;
    margin-top: 20px;
    position: relative;
    top: 60px;
    z-index: 100;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

#info-text-container {
    height: 100px;
    margin-top: 0px;
}

.image-cropper {
    /* height: 100%; */
    height: 500px; /* 371px - 30px top - 30px bottom */
    overflow: hidden;
    position: relative;
    /* margin-top: 20px; */
}

.image-cropper img {
    object-fit: contain;
    object-position: center;
    /* position: relative; */
    /* top: -150px; */
    width: 100%;
    height: 100%;
    top: -50px;
    position: relative;
}

.content-wrapper {
    position: relative;
    width: 100%;
    height: 311px;
}

.mgng-gif {
    width: 100%;
    /* height: 100%; */
    /* height: 311px; */
    overflow: hidden;
}

#info-text-container {
    position: absolute;
    top: 53%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    text-align: center;
    color: black; /* 텍스트 색상을 조정하여 이미지 위에서 잘 보이게 합니다 */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* 텍스트 가독성을 위해 그림자를 추가합니다 */
}
.login-box {
    position: absolute;
    top: 70%;
    left: 50%;
    width: 80%;
    transform: translate(-50%, -50%);
    z-index: 1;
    text-align: center;
    color: black;
}

.login-input-fields {
    width: 100%;
    /* max-width: 400px; */
    /* margin: 20px auto; */
}

.login-input-fields form > * {
    margin-bottom: 10px;
}

/* .form-control::placeholder {
    color: #aaa;
}

.submit-btn {
    margin-top: 10px;
    background-color: #008cff;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 102px;
    height: 45px;
} */

.login-form {
    display: flex;
    justify-content: center; /* 부모 안에서 중앙 정렬 */
}

.input-container {
    display: flex;
    flex-direction: column; /* 입력 필드를 세로로 정렬 */
    gap: 10px; /* 각 필드 사이의 간격 */
    width: 80%; /* 입력 필드 너비 */
    margin-right: 20px;
}

.input-group {
    display: flex;
    align-items: center; /* 세로 가운데 정렬 */
    gap: 15px; /* 입력 필드와 버튼 사이 간격 */
    flex-direction: column;
}

.form-control {
    width: 100%; /* 입력 필드가 부모 요소를 채우도록 */
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.input-group > .form-control {
    position: static !important; /* 기존 position을 덮어쓰기 */
    flex: none !important; /* flex가 적용되지 않도록 수정 */
    width: 100%; /* 입력 필드가 부모의 너비를 채우도록 */
    min-width: auto; /* 최소 너비 제한 해제 */
}

.submit-btn {
    background-color: #008cff;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 100px;
}

.submit-btn:hover {
    background-color: #2376e9;
}

.signup-btn {
    margin-top: 10px;
    background-color: #008cff;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 102px;
    height: 45px;
}

.horizontal-line {
    border: 1.5px solid #939393; /* 줄 색상 */
    margin: 20px 0; /* 상하 여백 */
    width: 80%;
    justify-content: center;
    display: inline-grid;
    position: relative;
    top: -60px;
}

.signup-text {
    color: #616161;
    cursor: pointer;
    text-decoration: underline;
    display: inline-block;
}

.signup-text:hover {
    color: #005bb5;
}
</style>

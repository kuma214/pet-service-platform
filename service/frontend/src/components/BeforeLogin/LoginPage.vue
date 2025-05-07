<template>
<div class="gradient-custom " >
    <section class="d-flex vh-100" style="margin-left:35px;">
        <div class="container-fluid row justify-content-center align-content-center">
            <div class="card bg-dark" style="border-radius: 1rem;">
                <div class="card-body p-5 text-center">
                    <h2 class="text-white">LOGIN</h2>
                    <p class="text-white-50 mt-2 mb-5">서비스를 사용하려면 로그인을 해주세요!</p>

                    <div class="mb-2">
                        <form @submit.prevent="login">
                            <div class="mb-3">
                                <label class="form-label text-white">Username</label>
                                <input type="text" v-model="authStore.username" class="form-control" name="username">
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-white">Password</label>
                                <input type="password" v-model="authStore.password" class="form-control" name="password">
                            </div>
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </form>

                        <button type="button" class="btn btn-secondary mt-3" @click="goToSignup">회원가입</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
</template>

<script>
import { useAuthStore } from '@/post_datas/loginStore'; // 스토어 가져오기

export default {
    setup() {
        const authStore = useAuthStore(); // 스토어 사용

        const goToSignup = () => {
            window.location.href = '/signup'; // 회원가입 페이지로 이동
        };

        return {
            authStore,
            login: authStore.login,
            goToSignup
        };
    }
    //login로직은 loginStore.js에 구현되어있음
}
</script>

<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css';

.gradient-custom {
    background: linear-gradient(to right, rgba(106, 17, 203, 1), rgba(37, 117, 252, 1))
}

</style>

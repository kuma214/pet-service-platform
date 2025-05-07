<template>
    <div>
        <div class="top-bar">
            <!-- 왼쪽에 뒤로가기 버튼 -->
            <button class="back-button" @click="goToBeforeLogin">
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
            </button>

            <!-- 가운데에 '시설 검색' 텍스트 -->
            <div class="search-title">회원 가입</div>
        </div>
        <div style="padding: 10px">
            <form @submit.prevent="submitForm">
                <div class="mb-3" style="text-align: left">
                    <label class="form-label text-dark">사용자 이름을 입력해주세요</label>
                    <input type="text" v-model="name" class="form-control" required />
                </div>
                <div class="mb-3" style="text-align: left">
                    <label class="form-label text-dark">사용하실 아이디를 입력해주세요</label>
                    <input type="text" v-model="username" class="form-control" required />
                    <p v-if="usernameExists" class="text-danger">이미 사용 중인 아이디입니다.</p>
                    <p v-else-if="username" class="text-success">사용 가능한 아이디입니다.</p>
                </div>
                <div class="mb-3" style="text-align: left">
                    <label class="form-label text-dark">이메일을 입력해주세요</label>
                    <input type="email" v-model="email" class="form-control" required />
                </div>
                <div class="mb-3" style="text-align: left">
                    <label class="form-label text-dark">비밀번호를 입력해주세요</label>
                    <input type="password" v-model="password" class="form-control" required />
                </div>
                <div class="mb-3" style="text-align: left">
                    <label class="form-label text-dark">비밀번호를 한번 더 입력해주세요</label>
                    <input type="password" v-model="confirmPassword" class="form-control" required />
                    <div v-if="passwordMismatch" class="text-danger" style="font-size: 0.8em">
                        비밀번호가 일치하지 않습니다.
                    </div>
                </div>
                <div id="verify-email" v-if="!isVerified">
                    <div class="input-group mb-3">
                        <input v-model="email" type="email" class="form-control" placeholder="이메일" required />
                        <button
                            class="btn btn-outline-secondary"
                            type="button"
                            @click="sendVerificationCode"
                            :disabled="emailSent"
                        >
                            {{ emailSent ? '인증코드 전송됨' : '인증코드 받기' }}
                        </button>
                    </div>
                    <div v-if="emailSent" class="input-group mb-3">
                        <input v-model="inputVerificationCode" class="form-control" placeholder="인증코드 입력" />
                        <!-- /{{ verificationCode }}/ -->
                        <button class="btn btn-outline-secondary" type="button" @click="verifyCode">인증하기</button>
                    </div>
                    <button class="btn btn-link" @click="sendVerificationCode" v-if="emailSent">인증코드 재전송</button>
                </div>

                <button type="submit" class="btn btn-primary" :disabled="!isVerified">회원가입</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import https from 'https';
import { send_email } from '@/fetch_datas/send_email';
import { fetch_ids } from '@/fetch_datas/fetch_ids';

export default {
    data() {
        return {
            email: '',
            password: '',
            username: '',
            confirmPassword: '',
            name: '',
            emailSent: false,
            inputVerificationCode: '',
            verificationCode: '',
            isVerified: false,
            userIds: [], // 기존 사용자 아이디 목록 저장
            usernameExists: false,
        };
    },
    async created() {
        const idsStore = fetch_ids(); // 핀아 스토어 호출
        this.userIds = await idsStore.fetchAllUserIds(); // 모든 사용자 아이디 가져오기
    },
    watch: {
        // username 값이 변할 때마다 기존 유저 아이디와 비교
        username(value) {
            if (value) {
                this.usernameExists = this.userIds.includes(value);
            } else {
                this.usernameExists = false;
            }
        },
    },
    computed: {
        passwordMismatch() {
            return this.password && this.confirmPassword && this.password !== this.confirmPassword;
        },
    },
    methods: {
        async sendVerificationCode() {
            try {
                const emailStore = send_email();
                this.verificationCode = await emailStore.sendVerificationEmail(this.email);
                this.emailSent = true;
                alert('인증코드가 이메일로 전송되었습니다.');
            } catch (error) {
                console.error('인증코드 전송 실패:', error);
                alert('인증코드 전송에 실패했습니다. 다시 시도해주세요.');
            }
        },
        verifyCode() {
            if (String(this.inputVerificationCode) === String(this.verificationCode)) {
                this.isVerified = true;
                alert('이메일이 성공적으로 인증되었습니다.');
            } else {
                alert('잘못된 인증코드입니다. 다시 시도해주세요.');
            }
        },
        submitForm() {
            if (this.password !== this.confirmPassword) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            if (!this.isVerified) {
                alert('이메일 인증이 필요합니다.');
                return;
            }

            if (this.usernameExists) {
                alert('이미 사용 중인 아이디입니다.');
                return;
            }

            axios
                .post(
                    'https://localhost:8081/auth/register',
                    {
                        email: this.email,
                        password: this.password,
                        username: this.username,
                        name: this.name,
                    },
                    {
                        httpsAgent: new https.Agent({
                            rejectUnauthorized: false,
                        }),
                    },
                )
                .then(() => {
                    alert('회원가입이 완료되었습니다.');
                    this.$router.push('/');
                })
                .catch((error) => {
                    console.error('회원가입 실패', error);
                    alert('회원가입에 실패했습니다. 다시 시도해주세요.');
                });
        },
        goToBeforeLogin() {
            this.$router.push('/');
        },
    },
};
</script>

<style>
@import '~bootstrap/dist/css/bootstrap.min.css';

.back_btn:hover {
    background-color: lightgray;
}

/* 상단 바 스타일 */
.top-bar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: white;
    padding: 15px 10px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
}

/* 뒤로가기 버튼 스타일 */
.back-button {
    position: absolute;
    left: 10px;
    background: none;
    border: none;
    cursor: pointer;
}

/* 검색 제목 스타일 */
.search-title {
    font-size: 20px;
}
</style>

import { defineStore } from 'pinia';
import axios from 'axios';

const baseUrl = 'https://localhost:8081';

export const useAuthStore = defineStore('auth', {
    state: () => ({

        token: null,
        username: '',
        password: ''
    }),
    actions: {
        async login() {
            try {
                console.log('Logging in with:', { username: this.username, password: this.password }); // 추가된 로그
                const response = await axios.post(`${baseUrl}/auth/login`, {
                    username: this.username,
                    password: this.password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response && response.data && response.data.token) {
                    this.token = response.data.token;
                    localStorage.setItem('token', this.token);
                    this.setAxiosAuthHeader();
                    window.location.href = '/main'; // 로그인 성공 후 메인 페이지로 리다이렉트
                } else {
                    console.error('토큰을 가져오지 못했습니다.');
                }
            } catch (error) {
                if (error.response) {
                    console.error('요청이 만들어졌고 서버가 상태 코드로 응답했습니다', error.response.data);
                    alert(`로그인이 실패했습니다: ${error.response.data.message}`);
                } else {
                    console.error('요청이 만들어지지 않았거나 오류가 발생함', error.message);
                    alert('로그인이 실패했습니다');
                }
            }
        },
        setAxiosAuthHeader() {
            axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        },
        logout() {
            this.token = null;
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
});
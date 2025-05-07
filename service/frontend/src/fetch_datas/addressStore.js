import { defineStore } from 'pinia';
import axios from 'axios';

export const fetchAddressList = defineStore('addressStore', {
    state: () => ({
        contents: null, // null로 초기화 (데이터가 없는 상태를 표현)
        loading: false,
        error: null,
    }),

    actions: {
        async fetchContents() {
            this.loading = true;
            this.error = null;

            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('https://localhost:8081/auth/address/all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // response.data가 null이거나 undefined이면 this.contents도 null이 됨
                this.contents = response.data || null;

                return this.contents;
            } catch (error) {
                this.error = error.message;
                this.contents = null; // 에러 발생시 contents를 null로 설정
                console.error('Failed to fetch profile:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});

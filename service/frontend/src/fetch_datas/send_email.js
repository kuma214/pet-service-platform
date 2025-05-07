import { defineStore } from 'pinia';
import axios from 'axios';

const baseUrl = 'https://localhost:8081/auth';

export const send_email = defineStore('smtp', {
    actions: {
        async sendVerificationEmail(email) {
            try {
                const response = await axios.get(`${baseUrl}/register/email`, {
                    params: { email },
                });
                console.log('email: ', response.data);
                return response.data; // 이는 서버에서 반환된 인증 코드입니다.
            } catch (error) {
                console.error('이메일 전송 실패:', error);
                throw error;
            }
        },
    },
});

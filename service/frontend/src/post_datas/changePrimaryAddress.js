// @/post_datas/changePrimaryAddress.js
import axios from 'axios';

export const changePrimaryAddress = async (addressId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('no token');
        }
        const response = await axios.post(
            'https://localhost:8081/auth/address/change_primary',
            { addressId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            },
        );
        // 서버 응답의 상태 코드가 2xx 범위인 경우에만 성공으로 처리
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Failed to change PRimary address');
        }
    } catch (error) {
        console.error('Failed to change Primary address:', error);
        throw error;
    }
};

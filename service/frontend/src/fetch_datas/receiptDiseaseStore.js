import { defineStore } from 'pinia';
import { useReceiptStore } from '@/stores/receiptStore';
import axios from 'axios';

export const useFetchReceiptDiseaseStore = defineStore('receiptDiseaseStore', {
    state: () => ({
        contents: null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchContents() {
            this.loading = true;
            this.error = null;
            const receiptStore = useReceiptStore();
            const medicalDTOs = receiptStore.receiptInfo.medicalDTOs;

            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('No authentication token found');
                }

                // medicalDTOs가 배열인지 확인하고, 아니라면 배열로 감싸기
                const medicalDTOsArray = Array.isArray(medicalDTOs) ? medicalDTOs : [medicalDTOs];

                console.log('Sending data:', JSON.stringify(medicalDTOsArray)); // 로깅 추가

                const response = await axios.post('https://localhost:8081/api/disease/analysis', medicalDTOsArray, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                this.contents = response.data || null;
                return this.contents;
            } catch (error) {
                this.error = error.message;
                this.contents = null;
                console.error('Failed to fetch disease analysis:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});

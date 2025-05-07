import { defineStore } from 'pinia';
import axios from 'axios';

export const useUnfoundDiseaseStore = defineStore('unfoundDisease', {
    state: () => ({
        analysedDiseases: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchUnfoundDisease(diseaseNames) {
            this.loading = true;
            this.error = null;
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            try {
                console.log('대분류 전송 내용 : ', diseaseNames);
                const response = await axios.post('https://localhost:8081/api/unfound_diseases', diseaseNames, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                if (response.data === 'healthy') {
                    this.analysedDiseases = [];
                } else {
                    this.analysedDiseases = response.data;
                }
            } catch (error) {
                console.error('Error fetching subdiseases:', error);
                this.error = error.response?.data?.message || 'An error occurred while fetching subdiseases';
            } finally {
                this.loading = false;
            }
        },

        clearSubdiseases() {
            this.analysedDiseases = [];
        },
    },
});

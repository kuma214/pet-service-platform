import { defineStore } from 'pinia';
import axios from 'axios';

export const useSubdiseasesStore = defineStore('subdiseases', {
    state: () => ({
        analysedDiseases: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchSubdiseases(diseaseNames) {
            this.loading = true;
            this.error = null;
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('No authentication token found');
            }

            try {
                console.log('대분류 전송 내용 : ', diseaseNames);
                const response = await axios.post('https://localhost:8081/api/fetch_subdiseases', diseaseNames, {
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

    getters: {
        getSubdiseasesByDiseaseName: (state) => (diseaseName) => {
            const disease = state.analysedDiseases.find((d) => d.diseaseName === diseaseName);
            return disease ? disease.subDiseases : [];
        },

        hasSubdiseases: (state) => state.analysedDiseases.length > 0,
    },
});

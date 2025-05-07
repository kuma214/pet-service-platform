// stores/selectedSubDiseaseStore.js
import { defineStore } from 'pinia';

export const useSelectedSubDiseaseStore = defineStore('selectedSubDiseaseStore', {
    state: () => ({
        subDiseaseInfo: null,
    }),
    actions: {
        setsubDiseaseInfo(subDiseaseInfo) {
            this.subDiseaseInfo = subDiseaseInfo;
        },
    },
});

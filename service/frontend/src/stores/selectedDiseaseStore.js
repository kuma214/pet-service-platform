import { defineStore } from 'pinia';

export const useSelectedDiseaseStore = defineStore('selectedDiseaseStore', {
    state: () => ({
        diseaseInfo: null,
    }),
    actions: {
        setDiseaseInfo(diseaseInfo) {
            this.diseaseInfo = diseaseInfo;
            console.log(this.diseaseInfo);
        },
    },
});

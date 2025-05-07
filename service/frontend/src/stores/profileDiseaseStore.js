import { defineStore } from 'pinia';

export const useDiseaseStore = defineStore('profileDiseaseStore', {
    state: () => ({
        isDisease: [], // 선택된 질병 목록 배열
    }),
    actions: {
        toggleDisease(disease) {
            const index = this.isDisease.indexOf(disease);
            if (index > -1) {
                // 이미 선택된 질병이면 배열에서 제거
                this.isDisease.splice(index, 1);
            } else {
                // 선택되지 않은 질병이면 배열에 추가
                this.isDisease.push(disease);
            }
        },
        setDiseases(diseases) {
            this.isDisease = diseases;
        },
        clearDiseases() {
            this.isDisease = []; // 질병 목록 초기화
        },
    },
});

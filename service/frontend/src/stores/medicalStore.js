import { defineStore } from 'pinia';
import axios from 'axios';

export const useMedicalStore = defineStore('medicalStore', {
    state: () => ({
        medicalRecords: [], // 병원 진료 기록 목록
        receiptImgUrl: '', // 영수증 이미지 URL
        loading: false, // 로딩 상태
        error: null, // 에러 메시지
    }),
    actions: {
        // 특정 프로필 ID의 메디컬 기록을 가져오는 함수
        async fetchMedicalRecordsByProfileId(profileId) {
            this.loading = true;
            this.error = null;

            try {
                const token = localStorage.getItem('token'); // 토큰을 가져옴
                const response = await axios.get(`https://localhost:8081/api/medical/profile/${profileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
                    },
                });
                this.medicalRecords = response.data; // 가져온 메디컬 기록을 상태에 저장
            } catch (err) {
                this.error = '메디컬 기록을 가져오는 데 실패했습니다.';
                console.error(err);
            } finally {
                this.loading = false; // 로딩 상태를 false로 설정
            }
        },

        // 특정 메디컬 ID에 해당하는 메디컬 기록을 가져오는 함수
        async fetchMedicalRecordById(medicalId) {
            this.loading = true;
            this.error = null;

            try {
                const token = localStorage.getItem('token'); // 토큰을 가져옴
                const response = await axios.get(`https://localhost:8081/api/medical/${medicalId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
                    },
                });
                // 가져온 메디컬 기록의 영수증 URL을 상태에 저장
                this.receiptImgUrl = response.data.receiptImg;
                return response.data; // 데이터를 반환하여 컴포넌트에서 사용 가능하도록 함
            } catch (err) {
                this.error = '해당 메디컬 기록을 가져오는 데 실패했습니다.';
                console.error(err);
            } finally {
                this.loading = false; // 로딩 상태를 false로 설정
            }
        },

        // 최근 메디컬 기록을 가져오는 함수 추가 (가장 최근 기록을 확인할 때 사용)
        async fetchLatestMedicalRecordByProfileId(profileId) {
            this.loading = true;
            this.error = null;

            try {
                const token = localStorage.getItem('token'); // 토큰을 가져옴
                const response = await axios.get(`https://localhost:8081/api/medical/profile/${profileId}/latest`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // 토큰을 헤더에 추가
                    },
                });
                // 가장 최근 메디컬 기록을 가져와 상태에 저장
                this.receiptImgUrl = response.data.receiptImg;
                return response.data; // 데이터를 반환하여 컴포넌트에서 사용 가능하도록 함
            } catch (err) {
                this.error = '최근 메디컬 기록을 가져오는 데 실패했습니다.';
                console.error(err);
            } finally {
                this.loading = false; // 로딩 상태를 false로 설정
            }
        },
    },
});

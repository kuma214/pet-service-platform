import { defineStore } from 'pinia';
import axios from 'axios';

// Kakao Maps API 데이터 -> HospitalDTO 형태로 변환하는 매핑 함수
const mapKakaoDataToHospitalDTO = (kakaoData) => {
    return {
        name: kakaoData.place_name,
        address: kakaoData.address_name,
        phoneNumber: kakaoData.phone,
        id: kakaoData.id,
        isOurs: false, // 기본적으로 Kakao 데이터는 제휴되지 않은 것으로 가정
    };
};

export const useFacilityStore = defineStore('facilityStore', {
    state: () => ({
        affiliatedFacilities: [], // DB에서 가져온 제휴 병원 데이터를 저장할 배열
        kakaoFacilities: [], // Kakao API에서 가져온 병원 데이터를 저장할 배열
    }),
    actions: {
        // DB에서 제휴 병원 데이터를 가져오는 함수
        async fetchAffiliatedFacilities() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://localhost:8081/api/maps/affiliated-facilities', {
                    headers: {
                        Authorization: `Bearer ${token}`, // 서버에서 요구하는 인증 방식에 맞는 토큰 추가
                    },
                }); // 제휴 병원 데이터를 가져오는 API 호출
                this.affiliatedFacilities = response.data;
                console.log('제휴 병원 데이터:', this.affiliatedFacilities);
            } catch (error) {
                console.error('제휴 병원 데이터를 불러오는 중 오류 발생:', error);
            }
        },

        // Kakao Maps API 데이터와 제휴 병원 데이터를 비교하여 상태 업데이트
        async fetchAndCompareKakaoData(kakaoData) {
            // Kakao Maps API 데이터 -> HospitalDTO 형태로 변환
            const mappedKakaoData = kakaoData.map(mapKakaoDataToHospitalDTO);

            // 제휴 병원 데이터가 아직 로드되지 않았을 경우 로드
            if (this.affiliatedFacilities.length === 0) {
                await this.fetchAffiliatedFacilities();
            }

            // 제휴 여부를 확인하고, 제휴된 병원은 isOurs를 true로 설정
            mappedKakaoData.forEach((facility) => {
                const isAffiliated = this.affiliatedFacilities.some(
                    (affiliated) => affiliated.name === facility.name && affiliated.address === facility.address,
                );
                facility.isOurs = isAffiliated; // 제휴 여부 설정
            });

            // 상태를 업데이트하여 프론트엔드에 반영
            this.kakaoFacilities = mappedKakaoData;
            console.log('Kakao 병원 데이터 (제휴 여부 반영):', this.kakaoFacilities);
        },
    },
});

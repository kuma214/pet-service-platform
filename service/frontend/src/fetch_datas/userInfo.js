import { defineStore } from 'pinia';
import axios from 'axios';

// 유저의 프로필 정보를 관리하는 Pinia Store
export const useUserInfoStore = defineStore('userInfoStore', {
    state: () => ({
        profiles: [], // 프로필 리스트를 저장
        currentProfile: null, // 현재 선택된 프로필 저장
        loading: false, // 로딩 상태 관리
    }),
    actions: {
        // 모든 프로필 정보를 서버에서 가져오는 메서드
        async fetchProfiles() {
            this.loading = true;
            try {
                const token = localStorage.getItem('token'); // 로컬스토리지에서 토큰 가져오기
                const response = await axios.get(`https://localhost:8081/auth/profile/userinfo-all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.profiles = response.data; // 응답 데이터를 상태에 저장
                // 현재 프로필 정보를 설정
                this.currentProfile = this.profiles.find((profile) => profile.isCurrent === 'T') || null;
            } catch (error) {
                console.error('Failed to fetch profiles:', error);
            } finally {
                this.loading = false;
            }
        },

        // 특정 프로필을 선택하는 메서드
        setCurrentProfile(profileId) {
            this.currentProfile = this.profiles.find((profile) => profile.id === profileId) || null;
        },
    },
});

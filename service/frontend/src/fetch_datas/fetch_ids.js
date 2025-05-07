import { defineStore } from 'pinia';
import axios from 'axios';

const baseUrl = 'https://localhost:8081/auth';

export const fetch_ids = defineStore('fetchIds', {
  actions: {
    async fetchAllUserIds() {
      try {
        const response = await axios.get(`${baseUrl}/register/fetch_ids`);
        return response.data; // 서버에서 반환된 모든 사용자 아이디 리스트
      } catch (error) {
        console.error('아이디 목록 가져오기 실패:', error);
        throw error;
      }
    }
  }
});

// // fetch_test.js
// import { defineStore } from 'pinia';
// import axios from 'axios';

// const baseUrl = ''; // 프록시 설정을 사용하기 위해 baseUrl을 빈 문자열로 설정

// export const usePostStore = defineStore('storeId', {
//   state: () => ({
//     contents: [], // 여기에 메시지를 받아오기 위해 다른 state를 추가할 수도 있음.
//   }),
//   actions: {
//     async fetchContents() {
//       try {
//         const res = await axios.get(`${baseUrl}/message`); // 수정: 요청 경로 변경
//         this.contents = res.data; // 데이터 저장
//         console.log('Fetched content:', this.contents); // 확인용 로그
//       } catch (err) {
//         console.error('Fetch ERROR!', err);
//       }
//     }
//   }
// });

import { defineStore } from 'pinia';
import axios from 'axios';

const baseUrl = 'http://localhost:8081';

export const usePostStore = defineStore('storeId',{
	state: () => ({
		contents: [],
	}),
	actions: {
		async createContents(payload){
		// payload는 매개변수로 전달받은 데이터를 의미한다.
			try{
				// post요청시에는 url과 전달할 데이터를 아래와 같이 전송한다.
				const { data } = await axios.post(`${baseUrl}/posts`, payload);
				// 받아온 데이터를 만들어놓은 state에 추가해준다 
				this.contents.push(data);
			} catch (err) {
				console.error('Post ERROR!', err);
			}
		}
	},
});
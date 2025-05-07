<template>
    <div>
        <h1>User Information</h1>
        <div v-if="userInfo">
            <p><strong>Username:</strong> {{ userInfo.username }}</p>
            <p><strong>Email:</strong> {{ userInfo.email }}</p>
            <p><strong>Name:</strong> {{ userInfo.name }}</p>
            <p><strong>Role:</strong> {{ userInfo.role }}</p>
            <p><strong>Phone Number:</strong> {{ userInfo.telNum }}</p>
        </div>
        <div v-else>
            <p>Loading user information...</p>
        </div>

        <h2>Update User Info</h2>
        <form @submit.prevent="updateUserInfo">
            <input type="text" v-model="updatedInfo.name" placeholder="Name" />
            <input type="text" v-model="updatedInfo.email" placeholder="Email" />
            <input type="text" v-model="updatedInfo.telNum" placeholder="Phone Number" />
            <button type="submit">Update Info</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'UserInfo',
    data() {
        return {
            userInfo: null, // 사용자 정보를 저장할 변수
            updatedInfo: {
                name: '',
                email: '',
                telNum: '',
                username: '',
                password: '',
            },
        };
    },
    async mounted() {
        console.log('안녕');
        await this.fetchUserInfo(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
    },
    methods: {
        async fetchUserInfo() {
            console.log('나야');
            const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
            console.log(token);
            try {
                const response = await axios.get('https://localhost:8081/auth/userinfo', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    },
                });

                this.userInfo = response.data; // 사용자 정보 저장
                console.log('User Info:', this.userInfo); // 사용자 정보 출력
            } catch (error) {
                console.error('Failed to fetch user info:', error.response.data);
            }
        },
        async updateUserInfo() {
            const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
            const memberDTO = {
                ...this.updatedInfo, // updatedInfo의 내용을 memberDTO로 사용
                username: this.userInfo.username, // 기존 사용자 이름 유지
            };
            try {
                const response = await axios.post('https://localhost:8081/auth/userinfo/update', memberDTO, {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 포함
                    },
                });

                console.log('User Info Updated:', response.data); // 업데이트된 사용자 정보 출력
                this.fetchUserInfo(); // 사용자 정보 다시 가져오기
            } catch (error) {
                console.error('Failed to update user info:', error.response.data);
            }
        },
    },
};
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다 */
</style>

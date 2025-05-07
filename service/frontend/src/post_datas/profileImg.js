// @/post_datas/profileImg.js

import { defineStore } from 'pinia';
import axios from 'axios';

const baseUrl = 'https://localhost:8081/api/s3/profile';

export const uploadProfileImage = defineStore('profileImgUpload', {
    state: () => ({
        uploadedFiles: [],
    }),
    actions: {
        async uploadFile(payload) {
            const token = localStorage.getItem('token');
            console.log('Token being sent:', token);
            try {
                const { data } = await axios.post(`${baseUrl}`, payload, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });
                this.uploadedFiles.push(data);
                return data;
            } catch (err) {
                console.error('File Upload ERROR!', err);
                throw err;
            }
        },
    },
});

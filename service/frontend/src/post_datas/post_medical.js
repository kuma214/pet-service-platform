// @/post_datas/post_medical.js
import axios from 'axios';
import { useReceiptStore } from '@/stores/receiptStore';
import { useSelectedSubDiseaseStore } from '@/stores/selectedSubDiseaseStore';

export const saveReceipt = async (extraMedical) => {
    const receiptStore = useReceiptStore();
    const selectedSubDiseaseStore = useSelectedSubDiseaseStore();

    console.log('receiptStore.receiptInfo: ', receiptStore.receiptInfo);

    console.log('extraMedical: ', extraMedical);

    const selectedDiseasesArray = Object.keys(selectedSubDiseaseStore.subDiseaseInfo).map((key) => ({
        diseaseName: key,
        subDiseases: selectedSubDiseaseStore.subDiseaseInfo[key],
    }));

    console.log('selectedDiseaseStore.selectedDiseases: ', selectedDiseasesArray);

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            'https://localhost:8081/api/save_receipt',
            {
                extraMedical: extraMedical,
                receiptInfo: receiptStore.receiptInfo,
                selectedDiseases: selectedDiseasesArray,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            },
        );

        // 서버 응답의 상태 코드가 2xx 범위인 경우에만 성공으로 처리
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            throw new Error('Failed to save receipt');
        }
    } catch (error) {
        console.error('Failed to save receipt:', error);
        throw error;
    }
};

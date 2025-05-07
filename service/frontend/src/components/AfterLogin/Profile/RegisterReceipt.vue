<template>
    <div id="main-content">
        <div class="setting-topbar">
            <div class="top-bar">
                <button class="back-button" @click="goBack">
                    <svg
                        width="30px"
                        height="30px"
                        fill="#000000"
                        viewBox="0 0 200 200"
                        data-name="Layer 1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M160,89.75H56l53-53a9.67,9.67,0,0,0,0-14,9.67,9.67,0,0,0-14,0l-56,56a30.18,30.18,0,0,0-8.5,18.5c0,1-.5,1.5-.5,2.5a6.34,6.34,0,0,0,.5,3,31.47,31.47,0,0,0,8.5,18.5l56,56a9.9,9.9,0,0,0,14-14l-52.5-53.5H160a10,10,0,0,0,0-20Z"
                            ></path>
                        </g>
                    </svg>
                </button>
                <div class="title">병원 영수증 추가</div>
            </div>
        </div>

        <div id="photo-upload-camera" v-if="uploadStep && !isLoading">
            <div id="upload-receipt-title">영수증 업로드</div>
            <div id="upload-info">
                병원 영수증을 모두 입력하면<br />
                리워드 포인트가 <span class="highlight-points">+500P</span> !
            </div>
            <div id="upload-btns">
                <div class="file-input-wrapper btn-wrapper">
                    <input type="file" accept="image/*" @change="onFileChange" class="file-input" />
                    <span class="file-input-text">파일 선택</span>
                </div>

                <button class="button btn-wrapper" @click="toggleCamera">
                    {{ isCameraActive ? '카메라 끄기' : '카메라 켜기' }}
                </button>
            </div>

            <div v-if="isCameraActive">
                <video ref="video" autoplay playsinline></video>
                <button class="button" @click="capturePhoto">사진 촬영</button>
            </div>
            <div class="image-preview-container">
                <div class="image-preview">
                    <img v-if="photo" :src="photo" alt="Captured Photo" class="preview-image" />
                </div>
            </div>
            <div id="submit-receipt-btn">
                <button id="submit-button" @click="submitReceipt">영수증 접수</button>
            </div>
        </div>

        <div v-if="isLoading && uploadStep" class="loading-content">
            <img src="@/assets/mgng.gif" />
            <div id="loading">
                멍지냥지가 영수증 사진을 <br />
                텍스트로 추출하고 있어요.<br />잠시만 기다려 주세요
            </div>
        </div>

        <div id="show-ocr-gpt-result" v-if="showStep">
            <div v-if="result" class="receipt-form">
                <div id="hospital-infos">
                    <h3>병원 정보</h3>
                    <div v-for="(value, key) in filteredResult" :key="key" class="form-group">
                        <div class="edit-row">
                            <label
                                ><strong>{{ getFieldLabel(key) }}</strong></label
                            >
                            <div class="value-container">
                                <input
                                    :type="getInputType(key)"
                                    v-model="editedResult[key]"
                                    :disabled="!editMode[key]"
                                    @keyup.enter="saveEdit(key)"
                                    class="edit-input"
                                />
                                <button class="edit-button" @click="toggleEdit(key)">
                                    {{ editMode[key] ? '저장' : '수정' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="medical-list">
                    <h3>진료 내역</h3>
                    <ul>
                        <li v-for="(medicalDTO, index) in result.medicalDTOs" :key="index">
                            <div class="medical-item">
                                <div class="value-container">
                                    <input
                                        v-model="editedResult.medicalDTOs[index].medical_name"
                                        :disabled="!editMode['medical_' + index]"
                                        class="edit-input medical-name"
                                        placeholder="진료 항목"
                                        style="flex: 3.5"
                                    />
                                    <input
                                        type="number"
                                        v-model.number="editedResult.medicalDTOs[index].medical_price"
                                        :disabled="!editMode['medical_' + index]"
                                        class="edit-input medical-price"
                                        style="flex: 1.5"
                                        placeholder="가격"
                                    />
                                    <button class="edit-button" @click="toggleEdit('medical_' + index)">
                                        {{ editMode['medical_' + index] ? '저장' : '수정' }}
                                    </button>
                                    <button class="delete-button" @click="deleteMedicalItem(index)">삭제</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div id="add-info">
                        <button class="add-button" @click="addMedicalItem">진료 내역 추가</button>
                        <p id="info-msg">
                            추가를 한 뒤에는<br />꼭! <span class="highlight-save">저장</span> 버튼을 눌러주세요!
                        </p>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>결과를 불러오는 중에 문제가 발생했습니다. 다시 시도해 주세요.</p>
            </div>
            <div id="buttons-container">
                <button id="againBtn" @click="resetForm">영수증<br />재등록</button>
                <button id="nextBtn" @click="detectDisease">다음</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useFileUploadStore } from '@/post_datas/receiptOCR';
import { useReceiptStore } from '@/stores/receiptStore';

export default {
    name: 'RegisterReceiptPage',
    setup() {
        const router = useRouter();
        const fileUploadStore = useFileUploadStore();
        const receiptStore = useReceiptStore();

        const isCameraActive = ref(false);
        const photo = ref(null);
        const mediaStream = ref(null);
        const file = ref(null);
        const uploadStep = ref(true);
        const showStep = ref(false);
        const result = ref(null);
        const editedResult = ref(null);
        const editMode = reactive({});
        const isLoading = ref(false);
        const error = ref(null);
        const video = ref(null);

        const filteredResult = computed(() => {
            if (!result.value) return {};
            return Object.keys(result.value)
                .filter((key) => key !== 'medicalDTOs' && key !== 'reg_num' && key !== 'receipt_url')
                .reduce((obj, key) => {
                    obj[key] = result.value[key];
                    return obj;
                }, {});
        });

        const goBack = () => {
            router.go(-1);
        };

        const detectDisease = () => {
            // 현재 상태의 영수증 데이터를 저장
            const currentReceiptData = {
                ...result.value,
                medicalDTOs: result.value.medicalDTOs.map((item) => ({ ...item })),
            };

            // receiptStore에 데이터 저장
            receiptStore.setReceiptInfo(currentReceiptData);

            // 다음 페이지로 이동
            router.push('/main/upload_receipt/disease');
        };

        const toggleCamera = () => {
            if (isCameraActive.value) {
                stopCamera();
            } else {
                startCamera();
            }
        };

        const startCamera = () => {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    mediaStream.value = stream;
                    if (video.value) video.value.srcObject = stream;
                    isCameraActive.value = true;
                })
                .catch((err) => {
                    console.error('Error accessing camera: ', err);
                });
        };

        const stopCamera = () => {
            if (mediaStream.value) {
                mediaStream.value.getTracks().forEach((track) => track.stop());
                isCameraActive.value = false;
            }
        };

        const onFileChange = (event) => {
            file.value = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                photo.value = e.target.result;
            };
            reader.readAsDataURL(file.value);
        };

        const capturePhoto = () => {
            const canvas = document.createElement('canvas');
            if (video.value) {
                canvas.width = video.value.videoWidth;
                canvas.height = video.value.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(video.value, 0, 0);
                photo.value = canvas.toDataURL('image/png');
                canvas.toBlob((blob) => {
                    file.value = new File([blob], 'camera_capture.png', { type: 'image/png' });
                }, 'image/png');
            }
        };

        const submitReceipt = async () => {
            if (!file.value) {
                error.value = '파일을 선택해주세요.';
                return;
            }

            const formData = new FormData();
            formData.append('qimage', file.value);

            isLoading.value = true;
            error.value = null;

            try {
                const response = await fileUploadStore.uploadFile(formData);
                result.value = response;
                uploadStep.value = false;
                isLoading.value = false;
                showStep.value = true;
            } catch (err) {
                console.error('Error submitting receipt:', err);
                error.value = '영수증 제출 중 오류가 발생했습니다. 다시 시도해 주세요.';
            } finally {
                isLoading.value = false;
            }
        };

        const formatCurrency = (value) => {
            return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
        };

        const resetForm = () => {
            uploadStep.value = true;
            showStep.value = false;
            result.value = null;
            editedResult.value = null;
            file.value = null;
            photo.value = null;
            error.value = null;
            Object.keys(editMode).forEach((key) => {
                editMode[key] = false;
            });
        };

        const toggleEdit = (field) => {
            if (!editedResult.value) {
                editedResult.value = JSON.parse(JSON.stringify(result.value));
            }
            if (editMode[field]) {
                saveEdit(field);
            } else {
                editMode[field] = !editMode[field];
            }
        };

        const saveEdit = (field) => {
            if (!editMode[field]) return;

            if (field.startsWith('medical_')) {
                const index = parseInt(field.split('_')[1]);
                result.value.medicalDTOs[index] = { ...editedResult.value.medicalDTOs[index] };
            } else {
                result.value[field] = editedResult.value[field];
            }

            editMode[field] = false;

            if (field.startsWith('medical_') || field === 'totalCost') {
                recalculateTotalCost();
            }
        };

        const getFieldLabel = (key) => {
            const labels = {
                hospital_name: '병원 이름',
                hospital_address: '주소',
                hospital_phoneNum: '전화번호',
                visitDate: '방문 날짜',
                totalCost: '총 비용',
            };
            return labels[key] || key;
        };

        const getInputType = (key) => {
            if (key === 'visitDate') return 'date';
            if (key === 'totalCost') return 'number';
            return 'text';
        };

        const formatValue = (key, value) => {
            if (key === 'totalCost') return formatCurrency(value);
            return value;
        };

        const recalculateTotalCost = () => {
            const total = result.value.medicalDTOs.reduce((sum, item) => sum + Number(item.medical_price), 0);
            result.value.totalCost = total;
            if (editedResult.value) {
                editedResult.value.totalCost = total;
            }
        };

        const initializeEditMode = (data) => {
            Object.keys(data).forEach((key) => {
                if (key !== 'medicalDTOs') {
                    editMode[key] = false;
                }
            });
            if (data.medicalDTOs) {
                data.medicalDTOs.forEach((_, index) => {
                    editMode[`medical_${index}`] = false;
                });
            }
        };
        const deleteMedicalItem = (index) => {
            result.value.medicalDTOs.splice(index, 1);
            if (editedResult.value) {
                editedResult.value.medicalDTOs.splice(index, 1);
            }
            recalculateTotalCost();
        };

        const addMedicalItem = () => {
            const newItem = {
                medical_name: '',
                medical_price: 0,
            };
            result.value.medicalDTOs.push(newItem);
            if (editedResult.value) {
                editedResult.value.medicalDTOs.push({ ...newItem });
            }
            const newIndex = result.value.medicalDTOs.length - 1;
            toggleEdit(`medical_${newIndex}`);
        };

        watch(
            result,
            (newValue) => {
                if (newValue) {
                    editedResult.value = JSON.parse(JSON.stringify(newValue));
                    initializeEditMode(newValue);
                }
            },
            { immediate: true },
        );

        onMounted(() => {
            initializeEditMode({});
        });

        onBeforeUnmount(() => {
            if (isCameraActive.value) {
                stopCamera();
            }
        });

        return {
            isCameraActive,
            photo,
            mediaStream,
            file,
            uploadStep,
            showStep,
            result,
            editedResult,
            editMode,
            isLoading,
            error,
            video,
            filteredResult,
            goBack,
            detectDisease,
            toggleCamera,
            onFileChange,
            capturePhoto,
            submitReceipt,
            formatCurrency,
            resetForm,
            toggleEdit,
            saveEdit,
            getFieldLabel,
            getInputType,
            formatValue,
            initializeEditMode,
            deleteMedicalItem,
            addMedicalItem,
        };
    },
};
</script>

<style scoped>
#photo-upload-camera {
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 내용을 위아래로 분산 */
    align-items: center;
    background-color: #cee2f5;
    padding: 10px 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    height: calc(100vh - 60px); /* 상단 바의 높이를 뺀 전체 높이 */
    box-sizing: border-box; /* padding을 높이에 포함 */
}

#upload-btns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    margin-top: 10px;
    max-width: 600px;
}

.btn-wrapper {
    flex: 1; /* 균등한 너비 분배 */
    max-width: calc(50% - 10px); /* 50%에서 간격의 절반을 뺌 */
}

.file-input-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    border-radius: 10px;
    padding: 0; /* 패딩 제거 */
}

.file-input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
}

.file-input-text {
    background-color: #71a9db;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    display: block;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
}

.button {
    background-color: #71a9db;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    width: 100%;
    box-sizing: border-box;
}

#upload-receipt-title {
    font-size: 24px;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 20px;
}

#main-content {
    width: 100%;
    height: 100%;
    background-color: white;
}

.setting-topbar {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* 상단 바 스타일 */
.top-bar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: white;
    padding: 15px 10px;
    font-size: 18px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
    border-bottom: 1.5px solid #71a9db;
}

/* 뒤로가기 버튼 스타일 */
.back-button {
    position: absolute;
    left: 10px;
    background: none;
    border: none;
    cursor: pointer;
}

/* 검색 제목 스타일 */
.title {
    font-size: 20px;
}

input[type='file'] {
    padding: 20px 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.camera-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
}

video {
    width: 100%;
    border-radius: 10px;
    border: 1px solid #ddd;
}

.image-preview-container {
    flex-grow: 1; /* 남은 공간을 모두 차지하도록 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
    margin-top: 20px;
}

/* 이미지 미리보기 영역 스타일 */
.image-preview {
    width: 100%;
    height: 100%;
    border: 2px dashed #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin-top: 10px; */
    margin-bottom: 10px;
    background-color: #f7f7f7;
    border-radius: 10px;
}

.image-preview img {
    max-width: 100%;
    height: 100%;
    border-radius: 10px;
}

.action-btn {
    background-color: #4caf50;
    color: white;
}

.action-btn:hover {
    background-color: #45a049;
}

.toggle-btn {
    background-color: #008cba;
    color: white;
}

.toggle-btn:hover {
    background-color: #007bb5;
}

.submit-btn {
    background-color: #f44336;
    color: white;
}

.submit-btn:hover {
    background-color: #e53935;
}

.reset-btn {
    background-color: #ff9800;
    color: white;
}

.reset-btn:hover {
    background-color: #fb8c00;
}

#show-ocr-gpt-result {
    background-color: white;
    padding: 0px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    overflow-y: auto;
}

#hospital-infos p {
    margin: 5px 0;
}

#medical-list ul {
    list-style: none;
    padding: 0;
}

#medical-list ul li {
    background: #f1f1f1;
    padding: 0px;
    margin-bottom: 5px;
    border-radius: 5px;
}

.edit-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0px;
    background-color: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 8px;
}

.value-container {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 내용과 버튼 사이 간격 최대화 */
    width: 100%;
    padding: 0px;
    background-color: white;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
}

/* 라벨 스타일 */
.edit-row label {
    min-width: 100px; /* 라벨 최소 너비 설정 */
    font-weight: bold;
}

/* 수정 버튼 스타일 개선 */
.edit-button {
    padding: 5px 5px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px; /* 내용과 버튼 사이 간격 */
    white-space: nowrap; /* 버튼 텍스트 줄바꿈 방지 */
    transition: background-color 0.2s;
}
.delete-button {
    padding: 5px 5px;
    background-color: pink;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-left: 10px;
    white-space: nowrap;
    transition: background-color 0.2s;
}

.edit-button:hover {
    background-color: #0056b3;
}

/* 저장 버튼 스타일 */
.save-button {
    padding: 5px 5px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    transition: background-color 0.2s;
}

.save-button:hover {
    background-color: #218838;
}

/* 입력 필드 스타일 개선 */
.edit-input {
    padding: 5px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    width: 100%;
    font-size: 14px;
}

.edit-input medical-price {
    flex: 1;
}

.edit-input:disabled {
    background-color: #f8f9fa;
    border-color: transparent;
}

/* 진료 내역 항목 스타일 개선 */
.medical-item {
    background-color: #f8f9fa;
    padding: 0px;
    border-radius: 6px;
    margin-bottom: 8px;
}

.edit-medical-item {
    display: flex;
    gap: 10px;
    width: 100%;
    align-items: center;
}

.edit-medical-item .edit-input {
    flex: 1;
}

/* 진료 내역 리스트 스타일 */
#medical-list {
    margin-top: 20px;
}

#medical-list h3 {
    margin-bottom: 15px;
    color: #333;
}

#medical-list ul {
    padding: 0;
}

#medical-list li {
    list-style: none;
}

/* 전체 폼 컨테이너 스타일 개선 */
.receipt-form {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    margin: 0 auto;
    overflow-y: auto;
    height: 85%;
}
/* 입력 필드가 수정 모드일 때의 스타일 */
.edit-medical-item {
    display: grid;
    grid-template-columns: 2fr 1fr auto;
    gap: 10px;
    align-items: center;
    width: 100%;
}

#buttons-container {
    display: flex;
    width: 100%;
    height: 75px; /* 고정된 높이 설정 */
}

#againBtn,
#nextBtn {
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s;
    padding: 15px;
}

#againBtn {
    width: 30%;
    background-color: #f0f0f0;
    color: #333;
}

#nextBtn {
    width: 70%;
    background-color: #2376e9;
    color: white;
}

#againBtn:hover {
    background-color: #e0e0e0;
}

#nextBtn:hover {
    background-color: #5b8fc1;
}

#submit-receipt-btn {
    width: 100%;
    margin-top: auto; /* 상단 여백을 자동으로 설정하여 하단에 고정 */
    padding: 10px;
}

#submit-button {
    width: 100%;
    padding: 15px;
    background-color: #2376e9;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
}

.add-button {
    border-radius: 10px;
    border-color: white;
    background-color: #71a9db;
    color: white;
    margin: 10px;
    padding: 10px 15px;
    border-style: hidden;
}

#upload-info {
    margin-top: -10px;
    font-size: 16px;
    color: #333;
    text-align: center;
}

.highlight-points {
    color: red;
    font-weight: bold;
}
#info-msg {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.highlight-save {
    color: red;
    font-weight: bold;
}
</style>

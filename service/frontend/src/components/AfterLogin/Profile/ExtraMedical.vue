<template>
    <div id="main-content">
        <div class="setting-topbar">
            <div class="top-bar">
                <button class="back-button" @click="goBack" aria-label="Go back">
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
                <div class="title">병원 영수증 추가 - 진단명 입력</div>
            </div>
        </div>

        <div class="disease-list">
            <div class="bannerDiv">
                <div class="bannerFlexDiv">
                    <div style="color: gray">진단명 입력하기</div>
                </div>
                멍지냥지는 아직 개발중이라 예측이 틀릴수 있어요<br />
                <br />
                멍지냥지의 예측 외의 병명이 있다면, <br />아래에서 대분류를 선택해 주세요 <br />
                <img class="petwoman" :src="require('@/assets/medicine.png')" alt="" />
            </div>
            <div v-if="analysedDiseases.length > 0" id="extra-container">
                <div
                    v-for="(disease, index) in analysedDiseases"
                    :key="index"
                    class="disease-container"
                    :class="{ selected: disease.selected }"
                    @click="toggleSelection(index)"
                >
                    <div class="disease-header">
                        {{ disease.diseaseName }}
                    </div>
                    <div v-if="disease.selected" class="check-mark">&#10003;</div>
                </div>
            </div>
            <button @click="submitSelections" id="finalBtn">선택 완료</button>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUnfoundDiseaseStore } from '@/fetch_datas/unfoundMedicalStore';
import { saveReceipt } from '@/post_datas/post_medical';

export default {
    name: 'ExtraMedicalPage',
    setup() {
        const router = useRouter();
        const unfoundDiseaseStore = useUnfoundDiseaseStore();
        const { analysedDiseases } = storeToRefs(unfoundDiseaseStore);

        const toggleSelection = (index) => {
            analysedDiseases.value[index].selected = !analysedDiseases.value[index].selected;
        };

        const submitSelections = async () => {
            try {
                const extraMedicals = analysedDiseases.value.map((disease) => ({
                    diseaseName: disease.diseaseName,
                    selected: disease.selected,
                }));

                console.log('Extra Medicals:', extraMedicals);

                // saveReceipt 함수 호출
                const response = await saveReceipt(extraMedicals);

                console.log('Receipt saved successfully:', response);

                router.push('/main');
            } catch (error) {
                console.error('Failed to save receipt:', error);

                // 에러 메시지를 사용자에게 표시
                // 예: alert('영수증 저장에 실패했습니다. 다시 시도해 주세요.');
            }
        };

        const goBack = () => {
            router.go(-1);
        };

        return {
            analysedDiseases,
            toggleSelection,
            submitSelections,
            goBack,
        };
    },
};
</script>

<style scoped>
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
}

/* 뒤로가기 버튼 스타일 */
.back-button {
    position: absolute;
    left: 10px;
    background: none;
    border: none;
    cursor: pointer;
}

.bannerDiv {
    height: 220px;
    background-color: #79bbf4;
    text-align: left;
    padding: 20px 20px;
    position: relative; /* 이미지의 위치를 조정하기 위해 추가 */
}
.bannerFlexDiv {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 12px;
    align-items: center;
}
.petwoman {
    display: block;
    width: 120px;
    height: 120px;
    position: absolute; /* 부모 요소 내에서 위치를 조정 */
    right: 20px; /* 오른쪽으로 이동 */
    bottom: 30px; /* 하단 여백 설정 */
}
.no-diseases {
    text-align: center;
    margin-top: 20px;
    font-style: italic;
}

.submit-button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.disease-container {
    border-style: hidden;
    border-radius: 10px;
    margin: 10px;
    padding: 10px;
    display: flex;
    background-color: #79bbf4;
}

.disease-container:hover {
    background-color: #2376e9;
}

#extra-container {
    text-align: left;
    height: 560px;
    /* border-style: double; */
    overflow-y: auto;
    padding: 10px;
    position: relative; /* 추가: 내부 요소들의 기준점 설정 */
}

#finalBtn {
    border-style: hidden;
    padding: 27px;
    background-color: #2376e9;
    color: white;
    width: 100%;
}

.disease-header {
    flex: 9;
    color: white;
    margin-left: 3px;
}

.check-mark {
    font-weight: bold;
    color: white;
    flex: 1;
}

.disease-container.selected {
    background-color: #2376e9;
}
</style>

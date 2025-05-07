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
                <div class="title">병원 영수증 추가 - 진단명 입력</div>
            </div>
        </div>
        <div id="content">
            <div v-if="diseaseStore.loading" class="loading-content">
                <img src="@/assets/mgng.gif" />
                <div id="loading">
                    멍지냥지가 영수증 내역을 토대로 <br />
                    진단 병명의 대분류들을 분석하고 있어요.<br />잠시만 기다려 주세요
                </div>
            </div>
            <div v-else-if="diseaseStore.error">
                아이가 건강한 것 같아요. 혹시 아니라면, 직접 진료된 병명들을 기입해 주세요.
            </div>
            <div v-else-if="diseaseStore.contents">
                <div class="bannerDiv">
                    <div class="bannerFlexDiv">
                        <div style="color: gray">진단명 입력하기</div>
                    </div>
                    아래는 멍지냥지가 영수증 내역을 토대로 예측해 본 <br />
                    진단 병명의 대분류들 이에요. <br />
                    <br />
                    정확한 내원 기록을 위해, <br />자세한 병명들을 기입해 주세요.
                    <img class="petwoman" :src="require('@/assets/medicine.png')" alt="" />
                </div>
                <div id="result-container">
                    <div v-for="(disease, index) in diseaseStore.contents" :key="index" class="disease-item">
                        <div id="disease-reason-health">
                            <div class="disease-header">
                                <h3>{{ disease.diseaseTitle }}</h3>
                                <div @click="showReasons(index)" class="toggle-button">
                                    <img src="@/assets/icon-question.svg" />
                                </div>
                            </div>
                            <div class="healCheck-subDisease">
                                <div id="healthBtns">
                                    <div
                                        class="diseaseCheckDiv"
                                        :class="{ healthy: isHealthy(disease.diseaseTitle) }"
                                        @click="toggleHealthy(disease.diseaseTitle)"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            class="bi bi-check-circle-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path
                                                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
                                            />
                                        </svg>
                                        건강해요
                                    </div>
                                    <div
                                        class="showSubDiseaseList"
                                        @click="handleshowSubDiseaseList(disease.diseaseTitle)"
                                    >
                                        <img v-if="isSubVisible(disease.diseaseTitle)" src="@/assets/icon-down.svg" />
                                        <img v-else src="@/assets/icon-up.svg" />
                                    </div>
                                </div>
                            </div>

                            <div id="select-subDiseaseNames" v-if="isSubVisible(disease.diseaseTitle)">
                                <ul>
                                    <li
                                        v-for="subDisease in subDiseaseStore.getSubdiseasesByDiseaseName(
                                            disease.diseaseTitle,
                                        )"
                                        :key="subDisease"
                                    >
                                        <label>
                                            <input
                                                type="checkbox"
                                                :value="subDisease"
                                                :checked="isSubDiseaseSelected(disease.diseaseTitle, subDisease)"
                                                @change="toggleSubDisease(disease.diseaseTitle, subDisease)"
                                            />
                                            {{ subDisease }}
                                        </label>
                                    </li>
                                </ul>
                            </div>
                            <div
                                v-if="
                                    selectedSubDiseases[disease.diseaseTitle] &&
                                    selectedSubDiseases[disease.diseaseTitle].length > 0
                                "
                                class="selected-diseases"
                            >
                                <h4>선택된 하위 질병:</h4>
                                <p>{{ getSelectedSubDiseasesString(disease.diseaseTitle) }}</p>
                            </div>
                            <transition name="fade">
                                <div v-if="isReasonVisible(index)" class="reasons-popup">
                                    {{ getCommaSeparatedReasons(disease.reasons) }}
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
                <div id="goExtraMedicalBtn" @click="goExtraMedical">다음</div>
            </div>
            <div v-else>No data available</div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useFetchReceiptDiseaseStore } from '@/fetch_datas/receiptDiseaseStore';
import { useSubdiseasesStore } from '@/fetch_datas/receiptSubDiseaseStore';
import { onMounted, ref, reactive } from 'vue';
import { useUnfoundDiseaseStore } from '@/fetch_datas/unfoundMedicalStore';
import { useSelectedDiseaseStore } from '@/stores/selectedDiseaseStore';

import { useSelectedSubDiseaseStore } from '@/stores/selectedSubDiseaseStore';

export default {
    name: 'RegisterDiseasePage',
    setup() {
        const router = useRouter();
        const diseaseStore = useFetchReceiptDiseaseStore();
        const subDiseaseStore = useSubdiseasesStore();
        const unfoundDiseaseStore = useUnfoundDiseaseStore();
        const selectedDiseaseStore = useSelectedDiseaseStore();
        const visibleReasons = ref({});
        const timeouts = ref({});
        const healthStatus = ref({});
        const diseases = ref([]);
        const selectedSubDiseases = reactive({});
        const showsub = reactive({});
        const selectedSubDiseaseStore = useSelectedSubDiseaseStore();

        const handleshowSubDiseaseList = (diseaseTitle) => {
            showsub[diseaseTitle] = !showsub[diseaseTitle];
        };

        const isSubVisible = (diseaseTitle) => {
            return showsub[diseaseTitle] || false;
        };

        const showReasons = (index) => {
            visibleReasons.value[index] = true;
            if (timeouts.value[index]) {
                clearTimeout(timeouts.value[index]);
            }
            timeouts.value[index] = setTimeout(() => {
                visibleReasons.value[index] = false;
            }, 3000);
        };

        const isReasonVisible = (index) => {
            return visibleReasons.value[index] || false;
        };

        const getCommaSeparatedReasons = (reasons) => {
            return reasons.join(', ');
        };

        const isHealthy = (diseaseTitle) => {
            return healthStatus.value[diseaseTitle] || false;
        };

        const toggleHealthy = (diseaseTitle) => {
            healthStatus.value[diseaseTitle] = !healthStatus.value[diseaseTitle];

            if (healthStatus.value[diseaseTitle]) {
                // "건강해요" 상태가 되면 선택된 하위 질병 초기화
                selectedSubDiseases[diseaseTitle] = [];
            }
        };

        const toggleSubDisease = (diseaseTitle, subDisease) => {
            if (!selectedSubDiseases[diseaseTitle]) {
                selectedSubDiseases[diseaseTitle] = [];
            }
            const index = selectedSubDiseases[diseaseTitle].indexOf(subDisease);
            if (index === -1) {
                selectedSubDiseases[diseaseTitle].push(subDisease);
                // 하위 질병이 선택되면 "건강해요" 상태 해제
                healthStatus.value[diseaseTitle] = false;
            } else {
                selectedSubDiseases[diseaseTitle].splice(index, 1);
            }
        };

        const isSubDiseaseSelected = (diseaseTitle, subDisease) => {
            return selectedSubDiseases[diseaseTitle] && selectedSubDiseases[diseaseTitle].includes(subDisease);
        };

        const fetchDiseaseAnalysis = async () => {
            try {
                // healthStatus.value가 빈 객체로 초기화되어 있는지 확인
                if (!healthStatus.value || !showsub.value) {
                    healthStatus.value = {};
                    showsub.value = {};
                }

                await diseaseStore.fetchContents();

                for (const content of diseaseStore.contents) {
                    // diseaseTitle이 정상적으로 존재하는지 확인
                    if (content.diseaseTitle) {
                        // healthStatus 객체에 diseaseTitle을 키로 추가
                        healthStatus.value[content.diseaseTitle] = false;
                        diseases.value.push(content.diseaseTitle);
                        selectedSubDiseases[content.diseaseTitle] = [];
                        showsub.value[content.diseaseTitle] = true;
                    } else {
                        console.warn('Missing diseaseTitle in content:', content);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch disease analysis:', error);
            }
        };

        const fetchSubDisease = async () => {
            try {
                if (diseases.value.length > 0) {
                    selectedDiseaseStore.setDiseaseInfo(diseases);
                    console.log('fetchSubDisease: ', selectedDiseaseStore.diseaseInfo);
                    await subDiseaseStore.fetchSubdiseases(diseases.value);
                }
            } catch (error) {
                console.error('Failed to fetch sub-diseases:', error);
            }
        };

        const getSelectedSubDiseasesString = (diseaseTitle) => {
            return selectedSubDiseases[diseaseTitle] ? selectedSubDiseases[diseaseTitle].join(', ') : '';
        };

        const goBack = () => {
            router.go(-1);
        };

        const goExtraMedical = () => {
            console.log('selectedSubDiseases', selectedSubDiseases);
            selectedSubDiseaseStore.setsubDiseaseInfo(selectedSubDiseases);
            router.push('/main/upload_receipt/disease/extra');
        };

        const fetchUnfoundDiseases = async () => {
            try {
                await unfoundDiseaseStore.fetchUnfoundDisease(diseases.value);
            } catch (error) {
                console.error('Failed to fetch unfound diseases: ', error);
            }
        };

        onMounted(async () => {
            await fetchDiseaseAnalysis();
            await fetchSubDisease();
            await fetchUnfoundDiseases();
        });

        return {
            diseaseStore,
            subDiseaseStore,
            goBack,
            showReasons,
            isReasonVisible,
            getCommaSeparatedReasons,
            isHealthy,
            toggleHealthy,
            diseases,
            selectedSubDiseases,
            getSelectedSubDiseasesString,
            toggleSubDisease,
            isSubDiseaseSelected,
            handleshowSubDiseaseList,
            showsub,
            isSubVisible,

            // 여기부터 기타질병
            fetchUnfoundDiseases,
            goExtraMedical,
        };
    },
};
</script>

<style>
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

#disease-reason-health {
    position: relative; /* 추가: 팝업의 기준점 설정 */
    margin-bottom: 20px;
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 5px;
}

.reasons-popup {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    z-index: 1000; /* 수정: z-index 값 증가 */
    margin-top: 5px;
    max-width: 100%; /* 추가: 최대 너비 설정 */
    word-wrap: break-word; /* 추가: 긴 텍스트 줄바꿈 */
}

#result-container {
    text-align: left;
    height: 560px;
    /* border-style: double; */
    overflow-y: auto;
    padding: 10px;
    position: relative; /* 추가: 내부 요소들의 기준점 설정 */
}
.disease-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.toggle-button {
    flex-shrink: 0;
    cursor: pointer;
}

.toggle-button img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    filter: invert(42%) sepia(8%) saturate(5399%) hue-rotate(179deg) brightness(105%) contrast(90%);
}

.reasons-container {
    color: #666;
    font-size: 14px;
    margin-top: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 3px;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.health-status {
    border-style: double;
    border-radius: 20px;
    width: max-content;
    padding: 3px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.diseaseCheckDiv {
    cursor: pointer;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    transition: all 0.3s ease;
}

.diseaseCheckDiv svg {
    margin-right: 5px;
    color: #2376e9;
}

.diseaseCheckDiv.healthy svg {
    margin-right: 5px;
    color: white;
}

.diseaseCheckDiv.healthy {
    background-color: #2376e9;
    border-style: solid;
    color: white;
    border-color: #2376e9;
}

.diseaseCheckDiv:not(.healthy) {
    color: #2376e9;
    border-style: solid;
    border-color: #2376e9;
}
.showSubDiseaseList img {
    width: 30px;
    height: 30px;
    margin-top: 10px;
}
#next-Btn {
    background-color: #71a9db;
    width: 100%;
    height: 100%;
    border-style: groove;
    position: fixed;
    text-align: center;
}
#goExtraMedicalBtn {
    border-style: hidden;
    padding: 27px;
    background-color: #2376e9;
    color: white;
}
#healthBtns {
    display: flex;
    gap: 50%;
}

.ol,
ul,
dl {
    margin-top: 0;
    margin-bottom: 1rem;
    list-style: none;
    font-size: 20px;
}

#select-subDiseaseNames {
    margin-top: 10px;
    margin-left: -20px;
}

.selected-diseases {
    margin-top: 10px;
}
</style>

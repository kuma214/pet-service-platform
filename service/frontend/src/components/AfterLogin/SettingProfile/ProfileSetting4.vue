<template>
    <div class="pageContainer">
        <div class="bannerDiv">
            <div class="bannerFlexDiv">
                <div style="color: gray">설정하기</div>
                <div style="color: gray">
                    <span style="background-color: #1860c3; padding: 4px; color: white; border-radius: 5px">4</span>/ 4
                </div>
            </div>
            평소 반려동물의 <br />
            상태는 어떤가요?
            <img class="petwoman" :src="require('@/assets/medicine.png')" alt="" />
        </div>

        <div class="whiteContentDiv">
            <div>
                <img
                    width="15"
                    height="15"
                    src="https://img.icons8.com/fluency-systems-filled/50/dog-footprint.png"
                    alt="dog-footprint"
                />
                관련된 지병이 있으시다면 체크를 해주세요
            </div>
            <div class="diseaseCheckDiv" :style="{ color: isHealthy ? 'black' : 'lightgray' }" @click="toggleHealthy">
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

            <!-- 콤보박스 -->
            <div v-if="diseaseData && Object.keys(diseaseData).length > 0">
                <div
                    v-for="(subDiseaseList, diseaseName) in diseaseData"
                    :key="diseaseName"
                    style="margin-bottom: 10px"
                >
                    <button @click="toggleComboBox(diseaseName)" class="combo-button">
                        {{ diseaseName }}
                        <span class="arrow">{{ isComboOpen[diseaseName] ? '▲' : '▼' }}</span>
                    </button>
                    <div v-if="isComboOpen[diseaseName]" class="checkbox-list">
                        <label v-for="(subDisease, index) in subDiseaseList" :key="index" class="checkbox-item">
                            <input
                                type="checkbox"
                                v-model="checkedItems[diseaseName][subDisease]"
                                class="hidden-checkbox"
                                @change="handleCheckboxChange"
                            />
                            <span class="custom-checkbox">
                                <span v-if="checkedItems[diseaseName][subDisease]" class="checkmark">✓</span>
                            </span>
                            {{ subDisease }}
                        </label>
                    </div>
                </div>
            </div>
            <!-- 기타 -->
            <div>
                <button @click="toggleEtcBox" class="combo-button2">
                    기타<span class="arrow">{{ isEtcOpen ? '▲' : '▼' }}</span>
                </button>
                <div v-if="isEtcOpen" class="checkbox-list">
                    <div class="checkbox-item" style="flex-direction: column; align-items: flex-start">
                        <div style="margin-bottom: 3px">
                            ● 없는 병명일시 병을 추가해주세요
                            <span @click="addEtcDisease">
                                &nbsp;
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-plus-circle"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path
                                        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
                                    />
                                </svg>
                            </span>
                        </div>
                        <div v-for="(diseaseEntry, index) in etcDisease" :key="index" style="margin-bottom: 10px">
                            <span>
                                <svg
                                    @click="removeEtcDisease(index)"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-dash-circle"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                                </svg>
                                &nbsp;
                            </span>
                            <select v-model="diseaseEntry.selectedDisease" style="height: 30px; width: 100px">
                                <!-- diseaseData에서 diseaseName을 반복하여 select option 생성 -->
                                <option
                                    v-for="(diseaseName, nameIndex) in Object.keys(diseaseData)"
                                    :key="nameIndex"
                                    :value="diseaseName"
                                >
                                    {{ diseaseName }}
                                </option>
                            </select>
                            &nbsp;
                            <input
                                type="text"
                                v-model="diseaseEntry.inputData"
                                placeholder="병명을 입력해주세요"
                                style="width: 50%"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- <p v-else>선택된 질병 정보가 없습니다.</p> -->
        </div>
        <div class="endButton">
            <div class="btnContainer">
                <div class="prevBtnDiv" @click="goToBeforeLogin">이전</div>
                <div class="nextBtnDiv" @click="saveProfile">프로필 생성하기</div>
            </div>
        </div>
    </div>
</template>

<script>
import { useDiseaseStore } from '@/stores/profileDiseaseStore';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { usePage2Store } from '@/stores/profilePage2Store';
import { usePetStore } from '@/stores/profilePage1Store';

export default {
    data() {
        return {
            diseaseData: {}, // 서버에서 받은 질병과 하위 질병 데이터를 저장
            isComboOpen: {}, // 각 질병에 대한 콤보박스 열림 상태를 관리
            checkedItems: {}, // 각 질병과 하위 항목에 대한 체크박스 상태를 관리
            isHealthy: false, // 건강 상태 체크 관리
            isEtcOpen: false, // 기타 병명을 추가하는 섹션 열림 상태
            etcDisease: [], // 추가되는 기타 병명을 저장하는 배열 (배열로 초기화)
        };
    },
    components: {},
    setup() {
        // Pinia에서 isDisease 상태를 가져옴
        const diseaseStore = useDiseaseStore();
        const { isDisease } = storeToRefs(diseaseStore);

        return {
            isDisease,
        };
    },
    mounted() {
        this.fetchSubDiseases();
        this.fetchUserInfo(); // 사용자 정보를 가져오기 위해 호출
    },
    methods: {
        toggleComboBox(diseaseName) {
            // 콤보박스 열림 상태를 토글
            this.isComboOpen[diseaseName] = !this.isComboOpen[diseaseName];
        },
        toggleHealthy() {
            this.isHealthy = !this.isHealthy;

            // 건강해요 버튼 클릭 시 체크박스를 모두 초기화
            if (this.isHealthy) {
                for (const diseaseName in this.checkedItems) {
                    for (const subDisease in this.checkedItems[diseaseName]) {
                        this.checkedItems[diseaseName][subDisease] = false;
                    }
                }
            }
        },
        toggleEtcBox() {
            this.isEtcOpen = !this.isEtcOpen;
        },
        addEtcDisease() {
            // 병명 input 필드를 추가할 때 배열에 빈 객체를 추가
            this.etcDisease.push({ selectedDisease: '', inputData: '' });
        },
        removeEtcDisease(index) {
            // 해당 인덱스의 병명 input을 제거
            this.etcDisease.splice(index, 1);
        },
        handleCheckboxChange() {
            // 체크박스가 클릭되면 건강해요 버튼을 lightgray로 변경
            if (this.isHealthy) {
                this.isHealthy = false;
            }
        },
        async fetchSubDiseases() {
            try {
                // isDisease 배열을 서버에 보내고 데이터를 받아옴
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    '/profile/subdiseases',
                    this.isDisease, // pinia에서 가져온 값을 보냄
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // JWT 토큰 포함
                        },
                    },
                );
                // 서버로부터 받은 질병과 하위 질병 데이터를 저장
                this.diseaseData = response.data;
                console.log(this.diseaseData);

                // 각 질병에 대해 상태 초기화
                this.initializeComboState();
            } catch (error) {
                console.error('Error fetching sub disease: ', error);
            }
        },
        initializeComboState() {
            // 받은 데이터에 기반하여 isComboOpen 및 checkedItems를 초기화
            for (const diseaseName in this.diseaseData) {
                // 콤보박스 상태 초기화
                this.isComboOpen[diseaseName] = false;

                // 체크박스 상태 초기화
                this.checkedItems[diseaseName] = {};
                this.diseaseData[diseaseName].forEach((subDisease) => {
                    this.checkedItems[diseaseName][subDisease] = false;
                });
            }
        },
        async fetchUserInfo() {
            const token = localStorage.getItem('token');

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
        async saveProfile() {
            // 데이터 체크 확인
            const isAnyCheckboxChecked = Object.keys(this.checkedItems).some((disease) =>
                Object.values(this.checkedItems[disease]).some((checked) => checked === true),
            );

            const isEtcDiseaseFilled = this.etcDisease.every(
                (diseaseEntry) => diseaseEntry.selectedDisease && diseaseEntry.inputData,
            );

            // 건강해요 버튼이나 체크박스 또는 기타병명 입력 여부 확인
            if (!this.isHealthy && !isAnyCheckboxChecked && !isEtcDiseaseFilled) {
                alert('항목을 체크하거나 병명을 입력해야합니다');
                return; // 프로필 저장을 막음
            }
            //백엔드에 데이터 저장 로직
            const token = localStorage.getItem('token');
            console.log('token' + token);
            try {
                const page2Store = usePage2Store();
                const petStore = usePetStore();

                //페이지2스토어에서 필요한 데이터 가져오기
                const selectedAllergies = Object.keys(page2Store.checkedItems).filter(
                    (item) => page2Store.checkedItems[item],
                );
                console.log(selectedAllergies); // ["우유", "보리", "메밀"]

                //페이지1스토어에서 필요한 데이터 가져오기
                const petImg = petStore.petImg;
                const petName = petStore.petName;
                const petType = petStore.selectedAnimalType;
                const petGender = petStore.maleselected;
                const petBirthDate = petStore.birthDate;
                const petIsNeutered = petStore.neuteredselected;
                const petWillNeutered = petStore.willneutered;

                const diseaseStore = useDiseaseStore();
                const { isDisease } = storeToRefs(diseaseStore);

                const checkedDiseases = this.checkedItems;

                const username = this.userInfo.username;
                const etcDisease = this.etcDisease; // 추가된 기타 병명 데이터

                //백엔드로 보내기 위한 데이터 준비
                const profileData = {
                    petImg,
                    petName,
                    petType,
                    petGender,
                    petBirthDate,
                    petIsNeutered,
                    petWillNeutered,
                    selectedAllergies,
                    isDisease,
                    checkedDiseases,
                    username, // 사용자 정보 추가
                    etcDisease, // 기타 병명 추가
                };

                const response = await axios.post('https://localhost:8081/api/profile/saveProfile', profileData, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    },
                });
                if (response.status === 200) {
                    alert('프로필이 성공적으로 저장되었습니다');

                    // Pinia 스토어의 isDisease 값을 초기화
                    diseaseStore.isDisease = []; // 초기화 (비어 있는 배열 또는 초기 상태로 설정)

                    this.$router.push('/main');
                }
            } catch (error) {
                console.error('프로필 저장 실패: ', error);
            }
        },
        goToBeforeLogin() {
            this.$router.push('/setProfile/3');
        },
    },
};
</script>

<style scoped>
.pageContainer {
    flex-grow: 1;
    overflow-y: auto;
    height: 90%; /* 스크롤바 숨기기 */
    scrollbar-width: none;
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
    right: 50px; /* 오른쪽으로 이동 */
    bottom: 30px; /* 하단 여백 설정 */
}
.whiteContentDiv {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    background-color: white;
    padding: 20px;
    text-align: left;
    height: 100%;
    overflow-y: auto;
}
/* 콤보박스 */
.combo-box {
    font-family: Arial, sans-serif;
    margin-top: 10px;
    width: 100%;
    text-align: center;
}
.combo-button {
    width: 100%;
    padding: 6px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.combo-button2 {
    width: 100%;
    padding: 6px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.arrow {
    font-size: 12px;
}
.checkbox-list {
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
}
.checkbox-item {
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
}
.checkbox-item:hover {
    background-color: #f0f0f0;
}
.hidden-checkbox {
    display: none;
}
.custom-checkbox {
    width: 18px;
    height: 18px;
    border: 1px solid #999;
    border-radius: 3px;
    margin-right: 8px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
.checkmark {
    color: black;
    font-size: 14px;
}
.endButton {
    position: absolute;
    width: 100%;
    bottom: 0;
}
.btnContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    text-align: center;
    align-content: center;
}
.prevBtnDiv {
    flex: 1;
    background-color: #d9d9d9;
    align-content: center;
    cursor: pointer;
    text-align: center;
    height: inherit;
    font-size: 15px;
}
.nextBtnDiv {
    flex: 1.5;
    background-color: #ffbf6b;
    height: inherit;
    color: black;
    align-content: center;
    cursor: pointer;
    text-align: center;
    font-size: 15px;
}
.prevBtnDiv:hover {
    opacity: 80%;
}
.nextBtnDiv:hover {
    opacity: 80%;
}
.diseaseCheckDiv {
    margin-top: 5px;
    padding: 5px;
    border: 1px solid black;
    border-radius: 10px;
    width: 50%;
    justify-content: space-around;
    margin-bottom: 10px;
}
</style>

<template>
    <div class="pageContainer">
        <div class="bannerDiv">
            <div class="bannerFlexDiv">
                <div style="color: gray">설정하기</div>
                <div style="color: gray">
                    <span style="background-color: #1860c3; padding: 4px; color: white; border-radius: 5px">2</span>/ 4
                </div>
            </div>
            평소 반려동물에게 <br />
            가려야할 음식이 있나요?
            <img class="petwoman" :src="require('@/assets/food.png')" alt="" />
        </div>

        <div class="whiteContentDiv">
            <div>
                <img
                    width="15"
                    height="15"
                    src="https://img.icons8.com/fluency-systems-filled/50/dog-footprint.png"
                    alt="dog-footprint"
                />
                반려동물에게 알레르기가 있나요?
            </div>
            <div class="searchDiv">
                <div style="margin-left: 20px; margin-right: 20px">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-search"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                        />
                    </svg>
                </div>
                <input
                    class="searchInput"
                    type="text"
                    v-model="searchKeyword"
                    placeholder="알레르기원을 검색하세요"
                    @input="handleSearch"
                />
            </div>
            <!-- 알레르기가 없어요 -->
            <div
                class="allergyDiv"
                @click="toggleAllergy"
                :style="{ color: anyChecked ? 'lightgray' : 'black' }"
                style="display: flex"
            >
                <div v-if="isAllergy === 'y'">
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
                    <span>&nbsp;알레르기가 없어요</span>
                </div>
                <div v-else style="color: lightgray">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-check-circle"
                        viewBox="0 0 16 16"
                    >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path
                            d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"
                        />
                    </svg>
                    <span>&nbsp;알레르기가 없어요</span>
                </div>
            </div>
            <!-- 드롭다운 -->
            <div class="combo-box" v-for="(allergyItems, type) in groupedAllergies" :key="type">
                <button @click="toggleComboBox(type)" class="combo-button">
                    {{ type }}
                    <span class="arrow">{{ isOpen === type ? '▲' : '▼' }}</span>
                </button>
                <div v-if="isOpen === type" class="checkbox-list">
                    <label v-for="(allergy, index) in allergyItems" :key="index" class="checkbox-item">
                        <input
                            type="checkbox"
                            v-model="checkedItems[allergy.name]"
                            class="hidden-checkbox"
                            @change="updateAllergyStatus"
                        />
                        <span class="custom-checkbox">
                            <span v-if="checkedItems[allergy.name]" class="checkmark">✓</span>
                        </span>
                        {{ allergy.name }}
                    </label>
                </div>
            </div>
        </div>
        <div class="prevNextButton">
            <div class="btnContainer">
                <div class="prevBtnDiv" @click="goToBeforeLogin">이전</div>
                <div class="nextBtnDiv" @click="handlePrevNextButton">다음</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { usePage2Store } from '@/stores/profilePage2Store';

export default {
    mounted() {
        this.getAllergies(); // 페이지가 로드될 때 알레르기 목록을 가져옵니다.
    },
    data() {
        return {
            isAllergy: 'n',
            isOpen: null, // 각 콤보박스의 열림 상태를 관리
            checkedItems: {}, // 알레르기 항목들이 동적으로 추가될 예정
            allergies: [], // 알레르기 목록을 저장할 배열
            searchKeyword: '', // 사용자가 입력한 검색어
        };
    },
    computed: {
        filteredAllergies() {
            // 검색어를 기준으로 알레르기 목록을 필터링합니다.
            if (!this.searchKeyword) {
                return this.allergies;
            }
            return this.allergies.filter((allergy) =>
                allergy.name.toLowerCase().includes(this.searchKeyword.toLowerCase()),
            );
        },
        groupedAllergies() {
            // allergy.type을 기준으로 그룹화합니다.
            return this.filteredAllergies.reduce((groups, allergy) => {
                const type = allergy.type;
                if (!groups[type]) {
                    groups[type] = [];
                }
                groups[type].push(allergy);
                return groups;
            }, {});
        },
        anyChecked() {
            // 하나 이상의 체크박스가 체크되었는지 확인하는 로직
            return Object.values(this.checkedItems).some((value) => value === true);
        },
    },
    methods: {
        toggleAllergy() {
            this.isAllergy = this.isAllergy === 'y' ? 'n' : 'y';

            if (this.isAllergy === 'y') {
                // 알레르기 체크박스들을 모두 해제
                Object.keys(this.checkedItems).forEach((key) => {
                    this.checkedItems[key] = false;
                });
            }
        },
        toggleComboBox(type) {
            this.isOpen = this.isOpen === type ? null : type;
        },
        async getAllergies() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://localhost:8081/api/profile/allergies', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    },
                });
                this.allergies = response.data;
                this.initializeCheckedItems(); // checkedItems 초기화
            } catch (error) {
                console.error('알러지 정보를 가져오는데 실패함', error);
            }
        },
        // checkedItems 객체를 알레르기 목록으로 초기화
        initializeCheckedItems() {
            this.allergies.forEach((allergy) => {
                this.checkedItems[allergy.name] = false; // 모든 알레르기 항목을 false로 초기화
            });
        },
        updateAllergyStatus() {
            // 체크박스 상태가 변경될 때 호출되는 함수
            if (this.anyChecked) {
                this.isAllergy = 'n'; // 알레르기가 하나라도 체크되면 "알레르기가 없어요" 상태를 끔
            }
        },
        // 검색할 때 관련된 콤보박스를 자동으로 엽니다.
        handleSearch() {
            const filtered = this.filteredAllergies;
            if (filtered.length > 0) {
                const firstType = filtered[0].type; // 첫 번째 필터된 항목의 타입을 기준으로 콤보박스를 엽니다.
                this.isOpen = firstType;
            } else {
                this.isOpen = null; // 검색 결과가 없으면 모든 콤보박스를 닫습니다.
            }
        },
        async handlePrevNextButton() {
            const page2Store = usePage2Store();
            page2Store.setCheckedItems({
                checkedItems: this.checkedItems,
            });
            console.log('안녕하세요 page2예요' + JSON.stringify(page2Store.checkedItems, null, 2));

            // 아무 알레르기 항목도 체크되지 않았고, '알레르기가 없습니다' 버튼도 누르지 않았을 경우
            if (!this.anyChecked && this.isAllergy === 'n') {
                alert('알레르기 여부를 선택해주세요.');
            } else {
                this.$router.push('/setProfile/3');
            }
        },
        goToBeforeLogin() {
            this.$router.push('/setProfile/1');
        },
    },
    components: {},
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
    right: 30px; /* 오른쪽으로 이동 */
    bottom: 30px; /* 하단 여백 설정 */
}
.whiteContentDiv {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    background-color: white;
    padding: 20px;
    text-align: left;
}
/* 서치 */
.searchDiv {
    display: flex;
    align-items: center;
    justify-items: center;
    border-radius: 40px;
    border: 1px solid #79bbf4;
    height: 40px;
    background-color: #89c6fc;
    margin-top: 10px;
}
.searchInput {
    border-width: 0;
    height: 30px;
    width: 80%;
    outline: none;
    font-size: 15px;
    background-color: #89c6fc;
}
.searchInput::placeholder {
    color: white;
}
.checked {
    background-color: black;
    color: white;
}
/* 알러지 */
.allergyDiv {
    margin-top: 10px;
    padding: 5px;
    border: 1px solid black;
    border-radius: 10px;
    width: 50%;
    justify-content: space-around;
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
.arrow {
    font-size: 12px;
}
.checkbox-list {
    border: 1px solid #ccc;
    border-radius: 0 0 4px 4px;
    height: auto;
    overflow-y: auto;
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
.prevNextButton {
    position: absolute;
    bottom: 0;
    width: 100%;
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
    background-color: #1860c3;
    height: inherit;
    color: white;
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
</style>

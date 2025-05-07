<template>
    <div class="pageContainer">
        <div class="bannerDiv">
            <div class="bannerFlexDiv">
                <div style="color: gray">설정하기</div>
                <div style="color: gray">
                    <span style="background-color: #1860c3; padding: 4px; color: white; border-radius: 5px">1</span>/ 4
                </div>
            </div>
            함께하고있는<br />
            반려동물은 어떤 아이인가요?
            <div class="profilePhotoDiv">
                <div class="photoDiv" @click="selectImage">
                    <img v-if="imagePreview" :src="imagePreview" alt="미리보기" class="previewImage" />
                    <span v-else>◕ ᴥ ◕</span>
                </div>
                <div class="photoplusDiv" @click="selectImage">+</div>
                <!--  @click="uploadImage" -->
            </div>
        </div>

        <div class="whiteContentDiv">
            <div>
                <img
                    width="15"
                    height="15"
                    src="https://img.icons8.com/fluency-systems-filled/50/dog-footprint.png"
                    alt="dog-footprint"
                />
                이름
            </div>
            <input
                type="text"
                style="outline: none; border: none; border-bottom: 1px solid gray; margin-top: 10px"
                placeholder="반려동물의 이름을 알려주세요"
                v-model="petName"
            />

            <div class="questionDiv">
                <img
                    width="15"
                    height="15"
                    src="https://img.icons8.com/fluency-systems-filled/50/dog-footprint.png"
                    alt="dog-footprint"
                />
                성별
            </div>
            <!-- 남자여자 버튼 -->
            <div style="display: flex; border: 1px solid #ddd; overflow: hidden; border-radius: 10px">
                <button
                    :class="['consumer-button', { selected: maleselected === 'male' }]"
                    @click="selectConsumer('male')"
                >
                    남아
                </button>
                <button
                    :class="['consumer-button', { selected: maleselected === 'female' }]"
                    @click="selectConsumer('female')"
                >
                    여아
                </button>
            </div>
            <div class="questionDiv">
                <img
                    width="15"
                    height="15"
                    src="https://img.icons8.com/fluency-systems-filled/50/dog-footprint.png"
                    alt="dog-footprint"
                />
                종류
            </div>
            <div class="searchDiv" @click="openModal">
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
                    placeholder="반려동물의 종류는 무엇인가요?"
                    v-model="inputValue"
                />
            </div>

            <!-- 종류를 누르면 팟하고 나오는 창 -->
            <transition name="fade">
                <div v-if="isModalOpen" class="modalOverlay" @click="closeModal">
                    <div class="modalContent" @click.stop>
                        <div style="display: flex; align-items: center; border-radius: 10px; position: relative">
                            <button
                                @click="closeModal"
                                style="
                                    text-align: left;
                                    border: none;
                                    background-color: white;
                                    border-radius: 10px;
                                    padding: 15px;
                                    margin-left: auto;
                                "
                            >
                                x
                            </button>
                            <div style="position: absolute; left: 50%; transform: translateX(-50%)">
                                반려동물 종류 검색
                            </div>
                        </div>
                        <!-- 여기 원하는 내용을 추가하세요 -->
                        <div class="modalTabDiv">
                            <div @click="decideAnimalType('dog')" :class="{ active: selectedAnimalType === 'dog' }">
                                강아지
                            </div>
                            <div @click="decideAnimalType('cat')" :class="{ active: selectedAnimalType === 'cat' }">
                                고양이
                            </div>
                            <div style="color: lightgray">기타</div>
                        </div>
                        <!-- 강아지일때 -->
                        <div v-if="selectedAnimalType === 'dog'">
                            <div class="searchDiv" style="margin-top: 10px; margin-left: 10px; margin-right: 10px">
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
                                    v-model="searchTerm"
                                    class="searchInput"
                                    type="text"
                                    placeholder="강아지 종류는 무엇인가요?"
                                />
                            </div>
                            <ul style="padding: 10px 20px; height: 400px; overflow-y: auto">
                                <li v-for="(dog, index) in filteredDogs" :key="index" @click="selectAnimal(dog)">
                                    {{ dog }}
                                </li>
                            </ul>
                        </div>
                        <!-- 고양이일때 -->
                        <div v-if="selectedAnimalType === 'cat'">
                            <div class="searchDiv" style="margin-top: 10px; margin-left: 10px; margin-right: 10px">
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
                                    v-model="searchCatTerm"
                                    class="searchInput"
                                    type="text"
                                    placeholder="고양이 종류는 무엇인가요?"
                                />
                            </div>
                            <ul style="padding: 10px 20px; height: 400px; overflow-y: auto">
                                <li v-for="(cat, index) in filteredCats" :key="index" @click="selectAnimal(cat)">
                                    {{ cat }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="questionDiv">
                <img
                    width="15"
                    height="15"
                    src="https://img.icons8.com/fluency-systems-filled/50/dog-footprint.png"
                    alt="dog-footprint"
                />
                생일

                <div
                    style="
                        display: flex;
                        border: 1px solid #ddd;
                        overflow: hidden;
                        border-radius: 10px;
                        margin-bottom: 10px;
                    "
                >
                    <button
                        :class="['consumer-button', { selected: birthType === 'date' }]"
                        @click="selectBirthType('date')"
                    >
                        알아요
                    </button>
                    <button
                        :class="['consumer-button', { selected: birthType === 'age' }]"
                        @click="selectBirthType('age')"
                    >
                        잘 모르겠어요
                    </button>
                </div>
                <!-- input -->
                <!-- 생일을 아는 경우: input type="date" -->
                <div
                    v-if="birthType === 'date'"
                    style="align-items: center; display: flex; align-content: center; flex-direction: row"
                >
                    <div
                        style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 40px;
                            border: 1px solid lightgray;
                            height: 40px;
                            width: 100%;
                        "
                    >
                        <input
                            type="date"
                            style="border-width: 0; height: 30px; text-align: center; outline: none"
                            v-model="birthDate"
                        />
                    </div>
                </div>

                <!-- 생일을 모르는 경우: input type="number" -->
                <div
                    v-if="birthType === 'age'"
                    style="align-items: center; display: flex; align-content: center; flex-direction: row"
                >
                    <div
                        style="
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 40px;
                            border: 1px solid lightgray;
                            height: 40px;
                            width: 100%;
                        "
                    >
                        <input
                            type="number"
                            placeholder="대략적인 나이를 입력해주세요"
                            v-model="approximateAge"
                            @input="convertAgeToDate"
                            style="outline: none; border: none; border-bottom: 1px solid gray; text-align: center"
                            class="age-input"
                        />
                        살
                    </div>
                </div>
            </div>
            <div class="questionDiv">
                <img
                    width="15"
                    height="15"
                    src="https://img.icons8.com/fluency-systems-filled/50/dog-footprint.png"
                    alt="dog-footprint"
                />
                중성화
            </div>
            <div style="display: flex; border: 1px solid #ddd; overflow: hidden; border-radius: 10px">
                <button
                    :class="['consumer-button', { selected: neuteredselected === 'isneutured' }]"
                    @click="selectNeutered('isneutured')"
                >
                    했다
                </button>
                <button
                    :class="['consumer-button', { selected: neuteredselected === 'notneutured' }]"
                    @click="selectNeutered('notneutured')"
                >
                    안했다
                </button>
            </div>
            <!-- 안했다를 누를시 -->
            <div v-if="neuteredselected === 'notneutured'">
                <div class="questionDiv">
                    <img
                        width="15"
                        height="15"
                        src="https://img.icons8.com/fluency-systems-filled/50/dog-footprint.png"
                        alt="dog-footprint"
                    />
                    중성화를 할 예정이?
                </div>
                <div style="display: flex; border: 1px solid #ddd; overflow: hidden; border-radius: 10px">
                    <button
                        :class="['consumer-button', { selected: willneutered === 'y' }]"
                        @click="willneutered = 'y'"
                    >
                        있다
                    </button>
                    <button
                        :class="['consumer-button', { selected: willneutered === 'n' }]"
                        @click="willneutered = 'n'"
                    >
                        없다
                    </button>
                </div>
            </div>
        </div>

        <NextButton class="nextButton" @click="handleNextButton" />
    </div>
</template>

<script>
import NextButton from './NextButton.vue';
import { usePetStore } from '@/stores/profilePage1Store';
import { uploadProfileImage } from '@/post_datas/profileImg';

import axios from 'axios';

export default {
    name: 'setProfilePage1',
    setup() {},
    mounted() {
        this.getInfoAnimalType();
    },
    components: {
        NextButton,
    },
    data() {
        return {
            imagePreview: null, // 미리보기를 위한 이미지 URL 상태
            selectedFile: null, //선택된 파일 상태
            petName: '',
            maleselected: '',
            neuteredselected: '', //
            isModalOpen: false, // 모달의 열림 상태 관리
            selectedAnimalType: 'dog', // 선택된 동물 유형을 저장
            inputValue: '', // 입력값
            searchTerm: '', // 강아지 검색어 저장
            searchCatTerm: '', // 고양이 검색어 저장
            willneutered: '',
            dogs: [],
            cats: [],
            birthDate: '',
            showError: false, // 에러 메시지 표시 여부
            approximateAge: '', // 대략적인 나이를 입력하는 필드
            birthType: '', // 생일을 아는지 모르는지 상태값
            profileImg: '',
        };
    },
    computed: {
        filteredDogs() {
            // 강아지 검색어를 기준으로 강아지 종류 필터링
            return this.dogs.filter((dog) => dog.toLowerCase().includes(this.searchTerm.toLowerCase()));
        },
        filteredCats() {
            // 고양이 검색어를 기준으로 고양이 종류 필터링
            return this.cats.filter((cat) => cat.toLowerCase().includes(this.searchCatTerm.toLowerCase()));
        },
    },
    methods: {
        selectBirthType(type) {
            this.birthType = type;
        },
        convertAgeToDate() {
            if (this.approximateAge) {
                const currentYear = new Date().getFullYear();
                const birthYear = currentYear - this.approximateAge;
                this.birthDate = `${birthYear}-01-01`; // 대략적인 나이를 기준으로 생일을 추정하여 설정
            }
        },
        goToBeforeLogin() {
            this.$router.push('/');
        },
        // 성별 선택 메소드
        selectConsumer(type) {
            this.maleselected = type;
        },
        // 중성화 선택 메소드
        selectNeutered(type) {
            this.neuteredselected = type;
            this.showError = false; // 선택 시 에러 메시지 숨김
        },
        openModal() {
            this.isModalOpen = true; // 클릭하면 모달 열림
        },
        closeModal() {
            this.isModalOpen = false; // 모달 닫기
        },
        decideAnimalType(animalType) {
            this.selectedAnimalType = animalType; // 클릭한 동물 유형을 저장
            this.inputValue = ''; // 입력값 초기화
        },
        selectAnimal(animal) {
            this.inputValue = animal; // 선택한 동물 이름을 input에 설정
            this.closeModal(); // 모달 닫기
        },
        selectImage() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';

            fileInput.onchange = (event) => {
                const file = event.target.files[0];
                if (file) {
                    // 미리보기 URL 생성
                    this.imagePreview = URL.createObjectURL(file);
                    this.selectedFile = file; // 선택된 파일 저장
                }
            };

            // 파일 선택 대화상자 열기
            fileInput.click();
        },

        async uploadImage() {
            if (!this.selectedFile) {
                return;
            }

            try {
                const formData = new FormData();
                formData.append('file', this.selectedFile); // 'qimage' 대신 'file'로 변경
                const store = uploadProfileImage();
                const response = await store.uploadFile(formData);
                console.log('이미지 업로드 성공:', response);
                this.profileImg = response;
            } catch (error) {
                console.error('이미지 업로드 실패:', error);
            }
        },
        async getInfoAnimalType() {
            try {
                console.log('나 불러지고 있어요');
                const token = localStorage.getItem('token');

                const response = await axios.get('https://localhost:8081/api/profile/animalDetails', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Authorization 헤더에 토큰 추가
                    },
                });
                this.dogs = response.data.dogs;
                this.cats = response.data.cats;
            } catch (error) {
                console.error('품종정보가져오는거 실패', error);
            }
        },
        async handleNextButton() {
            const petStore = usePetStore();

            if (!(this.neuteredselected && this.petName && this.birthDate && this.inputValue && this.maleselected)) {
                alert('값을 다 입력해주세요');
                return;
            }

            try {
                // 이미지 업로드 시도
                if (this.selectedFile) {
                    await this.uploadImage();
                }

                // 스토어에 데이터 저장
                petStore.setPetProfile({
                    petImg: this.profileImg,
                    petName: this.petName,
                    maleselected: this.maleselected,
                    selectedAnimalType: this.inputValue,
                    birthDate: this.birthDate,
                    neuteredselected: this.neuteredselected,
                    willneutered: this.willneutered,
                });

                console.log('안녕하세요' + petStore.petName);

                // 다음 페이지로 이동
                this.$router.push('/setProfile/2');
            } catch (error) {
                console.error('프로필 설정 중 오류 발생:', error);
                alert('프로필 설정 중 문제가 발생했습니다. 다시 시도해 주세요.');
            }
        },
    },
};
</script>

<style scoped>
.bannerDiv {
    height: 220px;
    background-color: #79bbf4;
    text-align: left;
    padding: 20px 20px;
}
.bannerFlexDiv {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 12px;
    align-items: center;
}
.profilePhotoDiv {
    display: flex;
    justify-content: center;
    position: relative;
}
.photoDiv {
    border-radius: 50%; /* 원형으로 설정 */
    background-color: #f7dcd5;
    padding: 10px;
    width: 90px; /* 원하는 너비 */
    height: 90px; /* 원하는 높이 */
    margin: 15px auto; /* 중앙 정렬을 위한 여백 */
    text-align: center;
    position: relative; /* 자식 요소의 절대 위치 설정을 위해 */
    overflow: hidden; /* 자식 요소가 부모를 넘지 않도록 잘림 */
    display: flex; /* Flexbox를 사용하여 중앙 정렬 */
    justify-content: center; /* 수평 중앙 정렬 */
    align-items: center; /* 수직 중앙 정렬 */
}
.whiteContentDiv {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    background-color: white;
    padding: 20px;
    text-align: left;
}
.pageContainer {
    flex-grow: 1;
    overflow-y: auto;
    height: 90%; /* 스크롤바 숨기기 */
    scrollbar-width: none;
}
/* .cardBoard {
    font-size: 15px;
    padding: 20px;
    border: 1px solid lightgray;
    margin: 10px;
    border-radius: 10px;
    background-color: white;
} */
.nameInput {
    border-radius: 10px;
    border: 1px solid #71a9db;
    margin-top: 5px;
    text-align: center;
}
.nameInput::placeholder {
    color: #eaeaea;
}
.button-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
.photoplusDiv {
    height: 30px;
    width: 30px;
    background-color: black;
    margin: 70px auto;
    border-radius: 30px;
    position: absolute;
    top: 10px; /* 원의 위치를 조정 */
    left: 200px; /* X축에서의 위치 조정 */
    color: white;
    text-align: center;
    align-content: center;
    cursor: pointer;
}
.previewImage {
    width: 100%; /* 부모 div의 너비에 맞춤 */
    height: 100%; /* 부모 div의 높이에 맞춤 */
    object-fit: cover; /* 비율을 유지하면서 중앙을 기준으로 잘림 */
    border-radius: 50%; /* 이미지도 원형으로 표시되도록 설정 */
}

.button {
    padding: 10px 20px;
    border: 1px solid #95c1e7;
    background-color: #79bbf4;
    color: white;
    text-align: center;
    cursor: pointer;
}

.left {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}

.right {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-left: none; /* 가운데에 경계선을 없애기 위해 사용 */
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
/* 남아 여아 */
.consumer-button {
    flex: 1;
    border: none;
    background-color: white;
    padding: 8px 15px;
    cursor: pointer;
    border-radius: 10px;
    border-left: 1px solid lightgray;
    border-right: 1px solid lightgray;
}

.selected {
    background-color: #f1f1f1;
    border: 1px solid #1860c3;
    color: #1860c3;
    border-radius: 10px;
}
.questionDiv {
    margin-top: 25px;
}
/* 모달 애니메이션 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.9); /* 창이 작게 튀어나오는 효과 */
}

/* 전체 창을 덮는 모달 스타일 */
.modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* 배경 어둡게 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modalContent {
    background: white;
    border-radius: 10px;
    max-width: 500px;
    width: 90%;
}
.modalTabDiv {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 10px;
    padding-bottom: 5px;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid lightgray;
}
.modalTabDiv div {
    cursor: pointer; /* 마우스 커서를 포인터로 변경 */
    padding: 10px; /* 적절한 여백 추가 */
}

.modalTabDiv div.active {
    border-bottom: 1px solid black; /* 선택된 항목에 스타일 적용 */
}
li {
    list-style: none;
}
.nextButton {
    position: absolute;
    bottom: 0;
    width: 100%;
}
.age-input::placeholder {
    color: rgb(233, 233, 233);
}
</style>

<template>
    <div class="pageContainer">
        <div class="bannerDiv">
            <div class="bannerFlexDiv">
                <div style="color: gray">설정하기</div>
                <div style="color: gray">
                    <span style="background-color: #1860c3; padding: 4px; color: white; border-radius: 5px">3</span>/ 4
                </div>
            </div>
            평소 반려동물의 <br />
            어떤 부위를 <br />
            신경써주는 편이신가요?
            <img class="petwoman" :src="require('@/assets/doctor.png')" alt="" />
        </div>
        <div class="whiteContentDiv">
            <div style="align-content: center; text-align: center">
                평소 신경쓰는 반려동물의 부위가 있나요?<br />
                (중복선택 가능)
            </div>
            <div class="icon-grid">
                <div
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('피부계통(귀)') }"
                    @click="toggleDisease('피부계통(귀)')"
                >
                    <img src="@/assets/skin.png" alt="피부계통" />
                    <p>피부(귀)</p>
                    <img
                        v-if="isDisease.includes('피부계통(귀)')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('눈') }"
                    @click="toggleDisease('눈')"
                >
                    <img src="@/assets/eye.png" alt="눈" />
                    <p>눈</p>
                    <img
                        v-if="isDisease.includes('눈')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('소화기계통') }"
                    @click="toggleDisease('소화기계통')"
                >
                    <img src="@/assets/stomach.png" alt="소화기" />
                    <p>소화기</p>
                    <img
                        v-if="isDisease.includes('소화기계통')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('근골격계통') }"
                    @click="toggleDisease('근골격계통')"
                >
                    <img src="@/assets/muscle.png" alt="근골격" />
                    <p>근골격</p>
                    <img
                        v-if="isDisease.includes('근골격계통')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('신경계통') }"
                    @click="toggleDisease('신경계통')"
                >
                    <img src="@/assets/nerve.png" alt="신경" />
                    <p>신경</p>
                    <img
                        v-if="isDisease.includes('신경계통')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('대사계통') }"
                    @click="toggleDisease('대사계통')"
                >
                    <img width="50" height="50" src="https://img.icons8.com/ios/50/fat-dog.png" alt="fat-dog" />
                    <p>대사(비만)</p>
                    <img
                        v-if="isDisease.includes('대사계통')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>

                <div
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('순환계통(심장)') }"
                    @click="toggleDisease('순환계통(심장)')"
                >
                    <img src="@/assets/heart.png" alt="심장" />
                    <p>심장</p>
                    <img
                        v-if="isDisease.includes('순환계통(심장)')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('구강') }"
                    @click="toggleDisease('구강')"
                >
                    <img src="@/assets/mouth.png" alt="구강" />
                    <p>구강</p>
                    <img
                        v-if="isDisease.includes('구강')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('호흡기계통') }"
                    @click="toggleDisease('호흡기계통')"
                >
                    <img src="@/assets/lung.png" alt="호흡기" />
                    <p>호흡기</p>
                    <img
                        v-if="isDisease.includes('호흡기계통')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div v-if="!showAdditionalIcons" class="icon-item" @click="toggleView">
                    <img src="@/assets/plus.png" alt="전체보기" />
                    <p>전체보기</p>
                </div>

                <div
                    v-else
                    class="icon-item"
                    :class="{ 'active-border': isDisease.includes('비뇨생식계통') }"
                    @click="toggleDisease('비뇨생식계통')"
                >
                    <img src="@/assets/kidney.png" alt="비뇨생식" />
                    <p>비뇨생식</p>
                    <img
                        v-if="isDisease.includes('비뇨생식계통')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div
                    class="icon-item"
                    v-if="showAdditionalIcons"
                    :class="{ 'active-border': isDisease.includes('종양성') }"
                    @click="toggleDisease('종양성')"
                >
                    <img
                        width="50"
                        height="50"
                        src="https://img.icons8.com/external-ddara-lineal-ddara/64/external-tumor-cell-medical-marijuana-medicine-cannabis-indica-medical-marijuana-ddara-lineal-ddara.png"
                        alt="external-tumor-cell-medical-marijuana-medicine-cannabis-indica-medical-marijuana-ddara-lineal-ddara"
                    />
                    <p>종양</p>
                    <img
                        v-if="isDisease.includes('종양성')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div
                    class="icon-item"
                    v-if="showAdditionalIcons"
                    :class="{ 'active-border': isDisease.includes('내분비(호르몬)계통') }"
                    @click="toggleDisease('내분비(호르몬)계통')"
                >
                    <img
                        width="50"
                        height="50"
                        src="https://img.icons8.com/external-victoruler-outline-victoruler/64/external-thyroid-gland-internal-human-organs-victoruler-outline-victoruler.png"
                        alt="external-thyroid-gland-internal-human-organs-victoruler-outline-victoruler"
                    />
                    <p>호르몬</p>
                    <img
                        v-if="isDisease.includes('내분비(호르몬)계통')"
                        class="check-icon"
                        src="https://img.icons8.com/emoji/48/check-mark-emoji.png"
                        alt="check-mark"
                    />
                </div>
                <div class="icon-item hidden" v-if="showAdditionalIcons"></div>
                <div class="icon-item hidden" v-if="showAdditionalIcons"></div>
                <div class="icon-item hidden" v-if="showAdditionalIcons"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { useDiseaseStore } from '@/stores/profileDiseaseStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue'; // ref를 import

export default {
    setup() {
        const diseaseStore = useDiseaseStore();
        const { isDisease } = storeToRefs(diseaseStore);
        const showAdditionalIcons = ref(false); // showAdditionalIcons를 ref로 선언

        const toggleDisease = (disease) => {
            diseaseStore.toggleDisease(disease);
        };

        const toggleView = () => {
            showAdditionalIcons.value = !showAdditionalIcons.value;
        };

        return { isDisease, toggleDisease, showAdditionalIcons, toggleView };
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
    height: 140px;
    position: absolute; /* 부모 요소 내에서 위치를 조정 */
    right: 45px; /* 오른쪽으로 이동 */
    bottom: 20px; /* 하단 여백 설정 */
}
.whiteContentDiv {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    background-color: white;
    padding: 20px;
    text-align: left;
}
.diseaseBox {
    flex: 0 1 18%;
    border: 1px solid black;
    box-sizing: border-box;
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background-color: rgb(239, 239, 239);
}
.hidden {
    visibility: hidden;
}
.icon-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 10px;
}

.icon-item {
    position: relative; /* 자식 요소인 check-icon의 위치를 설정하기 위해 relative 사용 */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 20%;
    margin: 10px 0;
}

.icon-item img {
    width: 50px;
    height: 50px;
}

.icon-item p {
    margin-top: 8px;
    font-size: 14px;
    text-align: center;
}
/* .icon-item.active-border {
    border-color: red; 
} */
.check-icon {
    position: absolute;
    top: -5px;
    right: -5px;
}
</style>

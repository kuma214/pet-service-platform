<template>
    <div id="buttomBar">
        <div id="left-button">
            <img src="@/assets/icon-home.svg" @click="goToMain" />
            <p>메인화면</p>
        </div>

        <!-- contents가 null이거나 비어있으면 반려동물 추가 버튼 표시 -->
        <div id="center-button" v-if="!contents" @click="goToCreateProfile">
            <img src="@/assets/jangoon.gif" />
            <p>반려동물 추가</p>
        </div>

        <!-- contents가 존재하면 프로필 정보 표시 -->
        <div id="center-button" v-else @click="goToProfile(contents)">
            <img :src="contents.pictureUrl" :alt="contents.name" />
            <p>{{ contents.name }}</p>
        </div>

        <div id="right-button">
            <!-- <img src="@/assets/icon-my-page.svg" @click="goToSettings" />
            <p>환경설정</p> -->
            <img class="icon" src="@/assets/icon-building.svg" alt="Facilities Icon" @click="goToMaps" />
            <p class="title">시설찾기</p>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCurrentProfileStore } from '@/fetch_datas/currentProfileStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
    name: 'BottomBar',
    setup() {
        const router = useRouter();
        const store = useCurrentProfileStore();
        const { contents } = storeToRefs(store);

        // Navigation functions
        const goToProfile = (contents) => {
            if (contents) {
                router.push({
                    name: 'ProfileMainPage', // 해당 페이지의 라우트 이름
                    params: { profileData: contents },
                });
            }
        };

        const goToMain = () => router.push('/main');
        const goToSettings = () => router.push('/main/settings');
        const goToCreateProfile = () => router.push('/setProfile/1');
        const goToMaps = () => router.push('/main/maps');
        // Fetch profile data when component is mounted
        onMounted(async () => {
            await store.fetchContents();
        });

        return {
            contents,
            goToProfile,
            goToMain,
            goToSettings,
            goToCreateProfile,
            goToMaps,
        };
    },
});
</script>

<style scoped>
#buttomBar {
    display: flex;
    justify-content: space-between; /* 요소들 사이에 공간을 균등하게 분배 */
    align-items: center; /* 세로축 가운데 정렬 */
    background-color: #f8f8f8; /* 배경색 */
    padding: 10px; /* 여백 */
    height: 80px;
    margin-bottom: 5px;
    border-top: 1px solid #bbb;
    z-index: 100;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
}

#buttomBar div {
    flex: 1; /* 모든 버튼이 동일한 비율로 차지 */
    text-align: center; /* 텍스트 가운데 정렬 */
}
#center-button {
    margin-top: 15px;
}
#center-button p {
    margin-top: 2px;
    font-size: 12px;
}

#center-button img {
    max-width: 90px; /* 이미지 크기 제한 */
    height: 55px;
    width: 55px;
    border-radius: 50%;
    margin-top: 8px;
}

#right-button,
#left-button {
    margin-top: 20px;
}

#right-button img {
    max-width: 35px;
}
#left-button img {
    max-width: 30px;
}
#left-button p {
    margin-top: 10px;
    font-size: 12px;
}

#right-button p {
    margin-top: 5px;
    font-size: 12px;
}
</style>

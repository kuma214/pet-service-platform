<template>
    <div id="settings-title">계정 관리</div>
    <div id="setting-container">
        <div class="member-info" v-if="memberInfo">
            <p class="info-text">
                <span>{{ memberInfo.name }} 님, 안녕하세요!</span>
                <span class="points-box">
                    포인트 : 500
                    <svg
                        version="1.1"
                        id="_x32_"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 512 512"
                        xml:space="preserve"
                        fill="#ffcc00"
                        width="20"
                        height="20"
                        class="svg-icon"
                    >
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <g>
                                <path
                                    class="st0"
                                    d="M256,64c105.875,0,192,86.125,192,192s-86.125,192-192,192c-105.859,0-192-86.125-192-192S150.141,64,256,64 M256,0C114.625,0,0,114.625,0,256c0,141.391,114.625,256,256,256s256-114.609,256-256C512,114.625,397.375,0,256,0z"
                                ></path>
                                <path
                                    class="st0"
                                    d="M264.375,170.594h-54.5c-8.703,0-15.75,7.031-15.75,15.719V347c0,8.688,7.047,15.719,15.75,15.719h7.906 c8.688,0,15.734-7.031,15.734-15.719v-45.25h30.859c41.266,0,74.844-29.406,74.844-65.594 C339.219,200,305.641,170.594,264.375,170.594z M264.375,267.219h-30.859v-62.125h30.859c19.547,0,35.438,13.938,35.438,31.063 S283.922,267.219,264.375,267.219z"
                                ></path>
                            </g>
                        </g>
                    </svg>
                </span>
            </p>
        </div>

        <div id="settings-container">
            <div id="delivery-info-setting" @click="addressSettingsPage">
                <img class="icon" src="@/assets/icon-home2.svg" alt="Address Icon" />
                <p class="title">배달지 정보</p>
                <p class="sstitle">관리하기</p>
            </div>

            <div id="account-setting">
                <img class="icon" src="@/assets/icon-account.svg" alt="Account Icon" />
                <p class="title">개인 정보</p>
                <p class="sstitle">관리하기</p>
            </div>

            <div id="change-pwd">
                <img class="icon" src="@/assets/icon-password.svg" alt="Password Icon" />
                <p class="title">비밀번호</p>
                <p class="sstitle">변경하기</p>
            </div>

            <div id="logout" @click="handleLogout">
                <img class="icon" src="@/assets/icon-logout.svg" alt="Logout Icon" />
                <p class="title">로그아웃</p>
                <p class="sstitle">하기</p>
            </div>
        </div>

        <div id="separating-line"></div>

        <p class="ttitle">우리집 아이들</p>
        <p class="subtitle">반려동물 프로필을 클릭하면</p>
        <p class="subtitle">현재 계정 프로필이 선택한 프로필로 변경됩니다.</p>

        <div id="mypets-container">
            <div id="mypet-profiles">
                <div id="profiles" v-if="profiles && profiles.length > 0">
                    <div
                        class="profile"
                        v-for="profile in profiles"
                        :key="profile.id"
                        @click="handleProfileSelect(profile)"
                    >
                        <img :src="profile.pictureUrl" :alt="profile.name" />
                        <p>{{ profile.name }}</p>
                    </div>
                </div>
                <div id="add-profile">
                    <div class="add-profile" @click="handleAddProfile">
                        <img src="@/assets/jangoon.gif" alt="Strong Jangoon" />
                        <p>반려동물 추가</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/post_datas/loginStore';
import { useUserAllInfoStore } from '@/fetch_datas/userAllInfoStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
    name: 'SettingsMainPage',

    setup() {
        const router = useRouter();
        const authStore = useAuthStore();
        const userAllInfoStore = useUserAllInfoStore();

        // Pinia store에서 반응형 데이터 가져오기
        const { userInfo, loading } = storeToRefs(userAllInfoStore);

        // 컴퓨티드 속성으로 프로필과 멤버 정보 관리
        const profiles = computed(() => userAllInfoStore.getAllProfiles);
        const memberInfo = computed(() => userAllInfoStore.getMemberInfo);

        // 컴포넌트 마운트 시 데이터 로드
        onMounted(async () => {
            try {
                await userAllInfoStore.fetchUserAllInfo();
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                console.log(userAllInfoStore.getMemberInfo);
                // 에러 처리 로직 추가 가능
            }
        });

        // 이벤트 핸들러들
        const handleLogout = async () => {
            try {
                await authStore.logout();
                userAllInfoStore.clearStore(); // 사용자 정보 클리어
                router.push('/');
            } catch (error) {
                console.error('Logout error:', error);
                // 에러 처리 로직 추가 가능
            }
        };

        const handleProfileSelect = async (profile) => {
            try {
                const success = await userAllInfoStore.changeCurrentProfile(profile.id);
                if (success) {
                    router.push('/main');
                } else {
                    console.error('Failed to change profile:', userAllInfoStore.error);
                    // 여기에 사용자에게 에러를 표시하는 로직을 추가할 수 있습니다.
                }
            } catch (error) {
                console.error('Error in handleProfileSelect:', error);
                // 여기에 사용자에게 에러를 표시하는 로직을 추가할 수 있습니다.
            }
        };

        const handleAddProfile = () => {
            router.push({ name: 'setProfilePage1' });
        };

        const addressSettingsPage = () => {
            router.push({ name: 'AddressSettingMain' });
        };

        return {
            // 상태
            profiles,
            memberInfo,
            userInfo,
            loading,

            // 메소드
            handleLogout,
            handleProfileSelect,
            handleAddProfile,
            addressSettingsPage,
        };
    },
});
</script>

<style scoped>
#settings-title {
    font-size: 20px;
    margin-bottom: 15px;
    margin-top: 15px;
}
#setting-container {
    border-radius: 10px;
    border: 1px solid #71a9db;
    background-color: white;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    width: 95%;
    padding: 10px;
}
#settings-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 10px;
    border: 1px solid white;
    background-color: white;
    width: 100%;
}
#separating-line {
    border-top: 1.5px solid #2376e9;
    margin: 10px 0;
}

#delivery-info-setting,
#account-setting,
#change-pwd,
#logout {
    flex: 1; /* 각 요소가 동일한 너비를 가짐 */
    margin: 0 10px; /* 요소 간의 간격 */
    text-align: center; /* 요소 안의 내용 중앙 정렬 */
}

#delivery-info-setting img,
#account-setting img,
#change-pwd img,
#logout img {
    width: 50px; /* 이미지 너비 */
    height: 50px; /* 이미지 높이 */
    object-fit: cover; /* 이미지를 잘라내지 않고 비율에 맞춰 표시 */
}

p {
    margin: 5px 0;
}

.title {
    font-size: 14px;
    font-weight: bold;
    color: #333;
}

.ttitle {
    font-size: 16px;
    font-weight: bold;
    color: #333;
}
.sstitle {
    font-size: 14px;
    color: #555;
}
.subtitle {
    font-size: 12px;
    color: #555;
}

#mypets-container {
    padding: 20px;
}

#mypet-profiles {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.profile,
#add-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.profile img,
#add-profile img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #2376e9;
}

#profiles {
    display: contents;
}

#add-profile {
    cursor: pointer;
}

/* 프로필 개수가 홀수일 때 추가 버튼을 오른쪽으로 밀기 */
#profiles:has(~ #add-profile:nth-child(even)) {
    grid-column: 1;
}

/* #add-profile:nth-child(even) {
    grid-column: 1;
} */

.icon {
    /* filter: invert(77%) sepia(8%) saturate(5399%) hue-rotate(179deg) brightness(90%) contrast(90%); */
    filter: invert(50%) sepia(8%) saturate(5399%) hue-rotate(179deg) brightness(90%) contrast(90%);
}

.info-text {
    display: flex;
    justify-content: space-between; /* 양쪽 끝에 배치 */
    align-items: center; /* 세로 가운데 정렬 */
    margin: 0; /* 기본 p 태그 여백 제거 */
    padding: 5px;
}

.points-box {
    display: flex; /* 인라인 요소처럼 동작하면서 Flexbox 사용 */
    align-items: center; /* 세로 중앙 정렬 */
    padding: 5px 10px;
    background-color: #f2f2f2;
    color: black;
    border-radius: 10px;
    font-size: 14px;
    line-height: 2; /* 줄 높이를 1로 설정 */
    height: 35px; /* 높이를 명확히 지정 */
}

.points-box svg {
    margin-left: 5px;
}
</style>

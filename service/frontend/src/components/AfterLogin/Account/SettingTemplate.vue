<template>
    <div id="afterLoginMain">
        <SettingTopBar />

        <div id="router-pages">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import SettingTopBar from './SettingTopBar.vue';

export default {
    components: {
        SettingTopBar,
    },
    data() {
        return {};
    },
    setup() {
        const route = useRoute();

        // 현재 경로가 특정 경로인지를 확인
        const isPageOne = computed(() => route.path === '/setProfile/1');

        // 가상의 주소 저장 로직 (이 로직을 AddAddressPage에서 전달받아 호출합니다)
        const saveAddress = async () => {
            try {
                // 실제 주소 저장 로직 구현부 (API 호출 등)
                alert('주소가 성공적으로 저장되었습니다!');
            } catch (error) {
                console.error('주소 저장 오류:', error);
                alert('주소 저장 중 오류가 발생했습니다.');
            }
        };

        return {
            isPageOne,
            saveAddress, // 저장 로직을 반환
        };
    },
};
</script>

<style scoped>
#afterLoginMain {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100vh; /* 전체 화면을 차지 */
}
#router-pages {
    background-color: #cee2f5;
    flex-grow: 1;
    overflow-y: auto;
    height: -webkit-fill-available;
    /* 스크롤바 숨기기 */
    scrollbar-width: none;
}
</style>

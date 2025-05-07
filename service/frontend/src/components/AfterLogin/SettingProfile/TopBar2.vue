<template>
    <div id="topBar2">
        <div id="mgng-back" class="back_btn" @click="goToBeforeLogin">
            <img class="back-btn" :src="require('@/assets/icon-home.svg')" alt="" style="width: 30px; height: 30px" />
        </div>
        <div id="mgng-title">프로필 추가</div>
        <!-- <div id="mgng-skip" class="skip_btn">건너뛰기</div> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            //현재 경로를 이전 경로로 매핑
            routeMap: {
                '/setProfile/1': '/main/settings', //맨처음에서 메인 페이지로 돌아감
                '/setProfile/2': '/main/settings',
                '/setProfile/3': '/main/settings',
                '/setProfile/4': '/main/settings',
            },
        };
    },
    methods: {
        goToBeforeLogin() {
            //현재 경로에 따라 이전 경로 설정
            const currentPath = this.$route.path;

            //현재 경로에 맞는 이전 경로로 이동(매핑된경로가 없으면 기본값으로 첫경로로 이동)
            const beforePath = this.routeMap[currentPath] || '';
            this.$router.push(beforePath);
        },
    },
};
</script>

<style scoped>
#topBar2 {
    display: flex;
    align-items: center;
    background-color: white;
    height: 70px;
    margin-bottom: 5px;
    padding: 0 15px;
}
#mgng-title {
    flex: 4;
}
#mgng-back {
    text-align: left;
}
#mgng-skip {
    text-align: right;
}
.skip_btn {
    color: lightgray;
}
.skip_btn:hover {
    background-color: rgb(150, 150, 150);
}
.back_btn:hover {
    background-color: lightgray;
}
</style>

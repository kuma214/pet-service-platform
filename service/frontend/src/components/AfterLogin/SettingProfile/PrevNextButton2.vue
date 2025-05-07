<template>
    <div>
        <div class="btnContainer">
            <div class="prevBtnDiv" @click="goToBeforeLogin">이전</div>
            <div class="nextBtnDiv" @click="goToNextPage">다음</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        goToNextPage() {
            this.$router.push({ path: '/setProfile/4', state: { diseases: this.isDisease } });
        },
        goToBeforeLogin() {
            this.$router.push('/setProfile/2');
        },
    },
};
</script>

<style scoped>
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

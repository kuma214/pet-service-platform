<template>
    <div class="btnContainer">
        <div class="nextBtn">
            &nbsp; 다음
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                fill="currentColor"
                class="bi bi-chevron-right"
                viewBox="0 0 16 16"
            >
                <path
                    fill-rule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                />
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //현재 경로를 다음 경로로 매핑
        };
    },
    methods: {},
};
</script>

<style scoped>
.btnContainer {
    display: flex;
    justify-content: center;
    height: 60px;
    align-items: center;
    background-color: #1860c3;
    color: white;
}
#bottomBar {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1860c3;
    color: white;
    height: 80px;
}
/* .nextBtn {
    cursor: pointer;
    border: 1px solid #1860c3;
    font-size: 15px;
    padding: 10px 0px;
    border-radius: 5px;
    width: 50%;
    background-color: #2276e9;
    color: white;
    text-align: center;
}
.nextBtn:hover {
    opacity: 80%;
} */
</style>

<template>
    <div id="daum-postcode">
        <div id="address-search-container"></div>
    </div>
</template>

<script>
export default {
    mounted() {
        this.loadDaumPostcode();
    },
    methods: {
        loadDaumPostcode() {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    // 주소 검색이 완료되었을 때 처리 로직
                    this.returnAddress(data.address);
                },
            }).embed(document.getElementById('address-search-container'));
        },
        returnAddress(address) {
            // 이전 페이지로 주소를 전달하고 돌아감
            this.$router.push({ name: 'AddAddressPage', params: { selectedAddress: address } });
        },
        goBack() {
            // 뒤로가기 버튼을 눌렀을 때
            this.$router.go(-1);
        },
    },
};
</script>

<style scoped>
#daum-postcode {
    width: 100%;
}

#address-search-container {
    display: flex;
    justify-content: center; /* Centers content horizontally */
}

#back-button {
    display: block;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f0f0f0;
    border: none;
    cursor: pointer;
}

#__daum__layer_5 {
    height: 850px !important;
}
</style>

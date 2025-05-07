<template>
    <div id="info-inputs">
        <div id="address-field" @click="goToSearchPage">
            <img src="@/assets/icon-search-address.svg" alt="Search Location Icon" />
            <input type="text" id="search-result" v-model="address" placeholder="주소 검색" readonly />
        </div>
        <div id="detailed-address-field">
            <img src="@/assets/icon-detail.svg" alt="Detail Icon" hidden="true" />
            <input type="text" id="detailed-address" v-model="detailedAddress" placeholder="상세 주소 입력" />
        </div>
        <div id="personal-info" v-if="detailedAddress.length > 0">
            <div id="receiptant-name-field">
                <img src="@/assets/icon-person.svg" alt="Person Icon" />
                <input id="receiptant-name" v-model="receiptantName" placeholder="받는 사람 이름" />
            </div>
            <div id="receiptant-telNum-field">
                <img src="@/assets/icon-telephone.svg" alt="Telephone Icon" />
                <input id="receiptant-telNum" v-model="receiptantTelNum" placeholder="받는 사람 전화번호" />
            </div>
        </div>
    </div>

    <BottomButton :saveAddress="saveAddress" />
</template>

<script>
import { addAddress } from '@/post_datas/addAddress';
import BottomButton from './BottomButton.vue'; // BottomButton 컴포넌트 가져오기

export default {
    name: 'AddAddressPage',
    components: { BottomButton },
    data() {
        return {
            address: '',
            detailedAddress: '',
            receiptantName: '',
            receiptantTelNum: '',
        };
    },
    mounted() {
        if (this.$route.params.selectedAddress) {
            this.address = this.$route.params.selectedAddress;
        }
    },
    methods: {
        goToSearchPage() {
            this.$router.push({ name: 'AddressSearchPage' });
        },
        async saveAddress() {
            if (!this.address || !this.detailedAddress || !this.receiptantName || !this.receiptantTelNum) {
                alert('모든 필드를 입력해주세요.');
                return;
            }

            const addressData = {
                address: `${this.address} ${this.detailedAddress}`,
                receipientName: this.receiptantName,
                receipientTellNum: this.receiptantTelNum,
            };

            try {
                await addAddress(addressData);
                alert('주소가 성공적으로 저장되었습니다.');
                this.$router.push({ name: 'AddressSettingMain' });
            } catch (error) {
                console.error('Error details:', error);
                alert(error.message || '주소 저장 중 오류가 발생했습니다.');
                // 에러가 발생했을 때는 페이지 이동을 하지 않음
            }
        },
    },
};
</script>

<style>
#info-inputs {
    margin-top: 10px;
}
#add-address-title {
    font-size: 20px;
    margin-bottom: 20px;
}
#receiptant-name-field {
    flex-direction: row;
    width: 100%;
    margin-top: 10px;
}
#receiptant-name-field img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
}
#receiptant-name {
    width: 80%;
}
#address-field {
    flex-direction: row;
    width: 100%;
}
#address-field img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
}
#search-result {
    height: 30px;
    width: 80%;
}
#detailed-address-field {
    flex-direction: row;
    width: 100%;
}

#detailed-address-field img {
    width: 20px;
    height: 20px;
    margin-right: 20px;
}

#detailed-address {
    width: 80%;
    height: 30px; /* Ensure it matches the height of the box */
    margin-left: 40px;
}

#receiptant-telNum-field {
    flex-direction: row;
    width: 100%;
    margin-top: 10px;
}
#receiptant-telNum-field img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
}
#receiptant-telNum {
    width: 80%;
}
</style>

<template>
    <div id="addresses-container" v-if="addresses.length > 0">
        <div id="addresses" v-for="address in addresses" :key="address.id">
            <div id="contents">
                <div id="infos">
                    <div style="margin-bottom: 5px" id="address">주소 : {{ address.address }}</div>
                    <div style="margin-bottom: 5px" id="receiptant_name">
                        수령자 이름 : {{ address.receipientName }}
                    </div>
                    <div style="margin-bottom: 5px" id="receiptant_telNum">
                        수령자 연락처 : {{ address.receipientTellNum }}
                    </div>
                </div>
                <div id="buttonsAndTag">
                    <div style="width: 126.68px" id="primary-tag" v-if="address.isPrimary === 'T'">대표 배송지</div>
                    <div
                        id="change-to-primary-btn"
                        v-if="address.isPrimary === 'F'"
                        @click="changePrimaryAddress(address.id)"
                    >
                        대표 배송지 설정
                    </div>
                    <div id="delete-btn" v-if="address.isPrimary === 'F'">삭제</div>
                </div>
            </div>
        </div>
    </div>
    <div id="No address" v-else>
        <p>저장된 배송지 주소가 없습니다. 추가해 주세요!</p>
    </div>
    <!-- BottomButton에 props로 주소 상태와 저장 로직 전달 -->
    <BottomButton :hasAddress="addresses.length > 0" :saveAddress="saveAddress" />
</template>

<script>
import { useRouter } from 'vue-router';
import { fetchAddressList } from '@/fetch_datas/addressStore';
import { changePrimaryAddress } from '@/post_datas/changePrimaryAddress';
import BottomButton from './BottomButton.vue';

export default {
    name: 'AddressSettingPage',
    components: { BottomButton },
    setup() {
        const router = useRouter();
        const addressStore = fetchAddressList();

        return { router, addressStore };
    },
    data() {
        return {
            addresses: [],
        };
    },
    async created() {
        try {
            await this.addressStore.fetchContents();
            this.addresses = this.addressStore.contents; // 서버에서 가져온 주소 데이터를 설정
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    },
    methods: {
        async changePrimaryAddress(newPrimaryId) {
            try {
                // 서버로 대표 배송지 변경 요청
                await changePrimaryAddress(newPrimaryId);

                // 로컬에서 기존의 대표 배송지를 찾아 비활성화
                const oldPrimary = this.addresses.find((addr) => addr.isPrimary === 'T');
                if (oldPrimary) {
                    oldPrimary.isPrimary = 'F';
                }

                // 선택한 주소를 새로운 대표 배송지로 설정
                const newPrimary = this.addresses.find((addr) => addr.id === newPrimaryId);
                if (newPrimary) {
                    newPrimary.isPrimary = 'T';
                }

                console.log('대표 배송지가 변경되었습니다.');
            } catch (error) {
                console.error('Failed to change primary address:', error);
            }
        },
        async saveAddress() {
            try {
                alert('주소가 성공적으로 저장되었습니다!');
            } catch (error) {
                console.error('주소 저장 오류:', error);
                alert('주소 저장 중 오류가 발생했습니다.');
            }
        },
    },
};
</script>

<style>
#addresses-container {
    padding: 10px;
}
#address-setting-title {
    font-size: 20px;
    margin-bottom: 20px;
}
#add-new-address img {
    width: 50px;
    height: 50px;
}
#addresses {
    text-align: left;
    border-style: solid;
    border-radius: 10px;
    padding: 5px;
    margin-bottom: 10px;
    background-color: white;
    font-size: 14px;
    border-color: white;
}
#primary-tag {
    border-style: double;
    border-radius: 10px;
    /* border-color: #71a9db; */
    border-color: #2c8ce0;
    text-align: center;
    position: unset;
    padding: 5px 10px;
    background-color: #2c8ce0;
    color: white;
}
#change-to-primary-btn,
#delete-btn {
    display: flex;
    border-style: double;
    border-radius: 10px;
    border-color: #2c8ce0;
    text-align: center;
    position: unset;
    padding: 5px 10px;
    background-color: #2c8ce0;
    color: white;
    margin-bottom: 10px;
}
#contents {
    display: flex;
    justify-content: space-between; /* 좌우로 배치 */
    align-items: flex-start; /* 위쪽에 정렬 */
    padding: 10px 5px; /* 여백 추가 */
}
#infos {
    flex: 0.9; /* 왼쪽이 더 넓어지게 설정 (필요시) */
    text-align: left; /* 왼쪽 정렬 */
}

#buttonsAndTag {
    display: flex;
    flex-direction: column; /* 버튼과 태그를 위아래로 배치 */
    align-items: flex-end; /* 오른쪽 정렬 */
}
</style>

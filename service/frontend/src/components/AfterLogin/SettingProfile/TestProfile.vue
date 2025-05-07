<template>
    <div>
        <input type="text" v-model="searchTerm" placeholder="검색어를 입력하세요" />
        <ul>
            <li v-for="(item, index) in filteredList" :key="index">{{ item }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            searchTerm: '',
            itemList: ['사과', '바나나', '체리', '오렌지', '포도', '사과상자', '사자'],
        };
    },
    computed: {
        filteredList() {
            if (!this.searchTerm) {
                return this.itemList; // 검색어가 없으면 전체 리스트 반환
            }
            const keyword = this.searchTerm.toLowerCase(); // 소문자로 변환
            return this.itemList.filter((item) => item.toLowerCase().includes(keyword)); // 검색어가 포함된 아이템만 반환
        },
    },
};
</script>

<style scoped>
/* 추가적인 스타일을 원하시면 여기에 작성하세요 */
</style>

<template>
    <div>
        <!-- 안쓰는 콤보박스 -->
        <div
            ref="toggleHeader"
            @click="toggleContent"
            style="
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border-bottom: 1px solid lightgray;
                border-top: 1px solid lightgray;
                background-color: lightgray;
            "
        >
            <span>&nbsp;등록</span>
            <span :class="{ 'toggle-arrow': true, open: isOpen }">▼</span>
        </div>
        <div v-if="isOpen" class="content">
            <p style="text-align: left; margin-bottom: 5px !important">&nbsp;이름</p>
            <input
                type="text"
                style="outline: none; border: none; border-bottom: 1px solid gray"
                placeholder="&nbsp;반려동물의 이름을 알려주세요"
            />
        </div>

        <!-- 쓰는 드롭다운박스 -->
        <div class="combo-box">
            <button @click="toggleComboBox" class="combo-button">
                우유/계란
                <span class="arrow">{{ isOpen ? '▲' : '▼' }}</span>
            </button>
            <div v-if="isOpen" class="checkbox-list">
                <label v-for="(isChecked, item) in checkedItems" :key="item" class="checkbox-item">
                    <input type="checkbox" v-model="checkedItems[item]" class="hidden-checkbox" />
                    <span class="custom-checkbox">
                        <span v-if="isChecked" class="checkmark">✓</span>
                    </span>
                    {{ item }}
                </label>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isOpen: true,
        };
    },
    methods: {
        toggleContent() {
            this.isOpen = !this.isOpen;

            // 콘텐츠를 접으면 스크롤 원래 위치로 이동
            if (!this.isOpen) {
                this.$refs.toggleHeader.scrollIntoView({ behavior: 'smooth' });
            }
        },
    },
};
</script>

<style scoped>
.content {
    background-color: white;
    padding: 10px;
    display: flex;
    justify-content: left;
    flex-direction: column;
}

.toggle-arrow {
    transition: transform 0.3s ease;
}

.open {
    transform: rotate(180deg);
}

/* 콤보박스 */
.combo-box {
    font-family: Arial, sans-serif;
    margin-top: 10px;
    width: 100%;
    text-align: center;
}
.combo-button {
    width: 100%;
    padding: 6px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.arrow {
    font-size: 12px;
}
.checkbox-list {
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
}
.checkbox-item {
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
}
.checkbox-item:hover {
    background-color: #f0f0f0;
}
.hidden-checkbox {
    display: none;
}
.custom-checkbox {
    width: 18px;
    height: 18px;
    border: 1px solid #999;
    border-radius: 3px;
    margin-right: 8px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
}
.checkmark {
    color: black;
    font-size: 14px;
}
</style>

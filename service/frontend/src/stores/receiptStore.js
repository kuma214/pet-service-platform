// stores/receiptStore.js
import { defineStore } from 'pinia';

export const useReceiptStore = defineStore('receiptStore', {
    state: () => ({
        receiptInfo: null,
    }),
    actions: {
        setReceiptInfo(receiptInfo) {
            this.receiptInfo = receiptInfo;
        },
    },
});

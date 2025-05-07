import { defineStore } from 'pinia';

export const usePage2Store = defineStore('profilePage2Store', {
    state: () => ({
        checkedItems: {},
    }),
    actions: {
        setCheckedItems(items) {
            this.checkedItems = items.checkedItems;
        },
    },
});

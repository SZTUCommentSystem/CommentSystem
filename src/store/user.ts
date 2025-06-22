import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: {} as any,
        selectClass: {} as any,
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUserInfo(userInfo: object) {
            this.userInfo = userInfo;
        },
        setSelectClass(selectClass: object) {
            this.selectClass = selectClass;
        },
        clearSelectClass() {
            this.selectClass = {};
        },
        clearUser() {
            this.token = '';
            this.userInfo = {};
            this.selectClass = {};
        },
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
    persist: {
        // enabled: true,
        storage: sessionStorage
    },
});
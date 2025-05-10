import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: null,
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
        },
        setUserInfo(userInfo: any) {
            this.userInfo = userInfo;
        },
        clearUser() {
            this.token = '';
            this.userInfo = null;
        },
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
    },

});
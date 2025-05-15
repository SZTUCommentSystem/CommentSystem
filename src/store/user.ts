import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: null,
        selectClass: '',
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
            Cookies.set('token', token, { expires: 7 });
        },
        setUserInfo(userInfo: any) {
            this.userInfo = userInfo;
        },
        setSelectClass(selectClass: string) {
            this.selectClass = selectClass;
        },
        clearUser() {
            this.token = '';
            this.userInfo = null;
            this.selectClass = '';
            Cookies.remove('token');
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
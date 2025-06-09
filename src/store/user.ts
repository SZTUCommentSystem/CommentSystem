import { defineStore } from 'pinia';
import Cookies from 'js-cookie';


export const useUserStore = defineStore('user', {
    state: () => ({
        token: '',
        userInfo: {} as any,
        selectClass: {} as any,
    }),
    actions: {
        setToken(token: string) {
            this.token = token;
            Cookies.set('token', token, { expires: 7 });
        },
        setUserInfo(userInfo: object) {
            this.userInfo = userInfo;
        },
        setSelectClass(selectClass: object) {
            this.selectClass = selectClass;
        },
        clearUser() {
            this.token = '';
            this.userInfo = {};
            this.selectClass = {};
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
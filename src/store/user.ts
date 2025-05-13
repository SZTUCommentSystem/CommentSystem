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
            Cookies.set('token', token, { expires: 7 }); // 设置cookie过期时间为7天
            console.log('Token set:', token);
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
            Cookies.remove('token'); // 清除cookie
        },
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
    }
});
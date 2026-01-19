import Cookies from "js-cookie";

const Token = {
    getToken: (key: string): string | undefined => Cookies.get(key),

    setToken: (key: string, token: string): void => {
        Cookies.set(key, token, {});
    },

    removeToken: (key: string): void => {
        Cookies.remove(key);
    },
};

export default Token;
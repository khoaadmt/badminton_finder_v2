import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AuthService from "../../services/auth/AuthService";
const authService = new AuthService();

const refreshToken = async (): Promise<{ accessToken: string }> => {
    try {
        const response = await authService.refreshToken();

        return response.data;
    } catch (err) {
        console.error("err:", err);
        throw err;
    }
};
export const createAxios = (user: any, dispatch: any, stateSuccess: any) => {
    const newInstance = axios.create();

    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwtDecode(user.accessToken) as { [key: string]: any };

            if (decodedToken.exp < date.getTime() / 1000) {
                try {
                    const data = await refreshToken();
                    const newAccessToken = data.accessToken;

                    config.headers["Authorization"] = `${newAccessToken}`;
                    const refreshUser = { ...user, accessToken: newAccessToken };
                    dispatch(stateSuccess(refreshUser));
                } catch (error) {
                    console.error("Unable to refresh access token", error);
                }
            }

            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    return newInstance;
};

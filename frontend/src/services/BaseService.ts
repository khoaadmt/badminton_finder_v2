import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { showLoading, hideLoading } from "../redux/loadingSlice";
import { store } from "../redux/store";

class BaseService {
  private readonly baseUrl: string;
  private readonly http: AxiosInstance;
  private readonly configHeaders: any;

  constructor(baseUrl: string, configHeaders: any) {
    this.http = axios.create({
      baseURL: baseUrl,
      timeout: 100000,
      withCredentials: true,
    });

    this.baseUrl = baseUrl;
    this.configHeaders = configHeaders;

    this.http.interceptors.request.use((config) => {
      (config as any).delayTimer = setTimeout(() => {
        store.dispatch(showLoading("Máy chủ đang khởi động, vui lòng chờ..."));
      }, 3000);
      return config;
    });

    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config as any;
        if (config?.delayTimer) clearTimeout(config.delayTimer);
        store.dispatch(hideLoading());
        return response.data;
      },
      (error: AxiosError) => {
        const config = error.config as any;
        if (config?.delayTimer) clearTimeout(config.delayTimer);
        store.dispatch(hideLoading());

        const { response } = error;
        if (response) {
          const originalUrl = config?.url || "";

          switch (response.status) {
            case 401:
              if (originalUrl.includes("login")) return Promise.reject(error);

              localStorage.clear();
              window.location.href = "/login";
              return;
            default:
              return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  setConfigHeaders(token?: string) {
    const headers: any = {
      "Content-Type": "application/json",
      ...this.configHeaders,
    };
    if (token) headers.Authorization = `${token}`;
    return { headers };
  }

  get(url: string, configHeaders: any = {}, token?: string) {
    return this.http.get(url, {
      ...this.setConfigHeaders(token),
      ...configHeaders,
    });
  }

  post(url: string, data: any, configHeaders: any = {}, token?: string) {
    return this.http.post(url, data, {
      ...this.setConfigHeaders(token),
      ...configHeaders,
    });
  }

  put(url: string, data: any, configHeaders: any = {}, token?: string) {
    return this.http.put(url, data, {
      ...this.setConfigHeaders(token),
      ...configHeaders,
    });
  }

  delete(url: string, configHeaders: any = {}, token?: string) {
    return this.http.delete(url, {
      ...this.setConfigHeaders(token),
      ...configHeaders,
    });
  }
}

export default BaseService;

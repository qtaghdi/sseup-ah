import axios from "axios";
import { requestInterceptor } from "./request-interceptor";
import { responseErrorInterceptor } from "./response-error-interceptor";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const BigtabletAxios = axios.create({
	baseURL: SERVER_URL,
	withCredentials: false,
});

BigtabletAxios.interceptors.request.use(requestInterceptor, (e) => Promise.reject(e));

BigtabletAxios.interceptors.response.use((r) => r, responseErrorInterceptor);

export default BigtabletAxios;

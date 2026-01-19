import axios, { type AxiosError } from "axios";

export const responseErrorInterceptor = async (error: AxiosError) => {
	if (axios.isCancel(error)) {
		return Promise.resolve(null);
	}

	return Promise.reject(error);
};
import type { z } from "zod";
import { BigtabletAxios } from "src/shared/libs/api/axios";
import {parseAxiosError} from "src/shared/libs/api/axios/parsed";

type AxiosConfig = Record<string, unknown>;

/**
 * @description
 * GET 요청을 수행하고 응답 데이터를 전달받은 zod 스키마로 파싱한다.
 *
 * @template S zod 스키마 타입
 * @param url 요청 URL
 * @param schema 응답 검증용 zod 스키마
 * @param config Axios 요청 설정
 * @returns zod 스키마로 파싱된 응답 데이터
 */
export const getParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	try {
		const response = await BigtabletAxios.get<unknown>(url, config);
		return schema.parse(response.data);
	} catch (error) {
		return parseAxiosError(error);
	}
};

/**
 * @description
 * POST 요청을 수행하고 응답 데이터를 전달받은 zod 스키마로 파싱한다.
 *
 * @template S zod 스키마 타입
 * @param url 요청 URL
 * @param schema 응답 검증용 zod 스키마
 * @param body 요청 바디
 * @param config Axios 요청 설정
 * @returns zod 스키마로 파싱된 응답 데이터
 */
export const postParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	try {
		const response = await BigtabletAxios.post<unknown>(url, body, config);
		return schema.parse(response.data);
	} catch (error) {
		return parseAxiosError(error);
	}
};

/**
 * @description
 * PUT 요청을 수행하고 응답 데이터를 전달받은 zod 스키마로 파싱한다.
 *
 * @template S zod 스키마 타입
 * @param url 요청 URL
 * @param schema 응답 검증용 zod 스키마
 * @param body 요청 바디
 * @param config Axios 요청 설정
 * @returns zod 스키마로 파싱된 응답 데이터
 */
export const putParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	try {
		const response = await BigtabletAxios.put<unknown>(url, body, config);
		return schema.parse(response.data);
	} catch (error) {
		return parseAxiosError(error);
	}
};

/**
 * @description
 * PATCH 요청을 수행하고 응답 데이터를 전달받은 zod 스키마로 파싱한다.
 *
 * @template S zod 스키마 타입
 * @param url 요청 URL
 * @param schema 응답 검증용 zod 스키마
 * @param body 요청 바디
 * @param config Axios 요청 설정
 * @returns zod 스키마로 파싱된 응답 데이터
 */
export const patchParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	body?: unknown,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	try {
		const response = await BigtabletAxios.patch<unknown>(url, body, config);
		return schema.parse(response.data);
	} catch (error) {
		return parseAxiosError(error);
	}
};

/**
 * @description
 * DELETE 요청을 수행하고 응답 데이터를 전달받은 zod 스키마로 파싱한다.
 *
 * @template S zod 스키마 타입
 * @param url 요청 URL
 * @param schema 응답 검증용 zod 스키마
 * @param config Axios 요청 설정
 * @returns zod 스키마로 파싱된 응답 데이터
 */
export const deleteParsed = async <S extends z.ZodTypeAny>(
	url: string,
	schema: S,
	config?: AxiosConfig,
): Promise<z.infer<S>> => {
	try {
		const response = await BigtabletAxios.delete<unknown>(url, config);
		return schema.parse(response.data);
	} catch (error) {
		return parseAxiosError(error);
	}
};
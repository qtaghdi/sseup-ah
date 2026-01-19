import { AxiosError } from "axios";
import { ErrorResponseParsedSchema } from "src/shared/schema/error/parsed";

/**
 * @description
 * Axios 요청 중 발생한 에러를 ErrorResponseParsed 스키마 기준으로 정규화한다.
 *
 * - 서버 에러 응답이 스키마와 일치할 경우 그대로 throw
 * - 스키마 파싱에 실패할 경우 기본 서버 에러 메시지 반환
 * - AxiosError가 아닐 경우 네트워크 오류로 처리
 */
export const parseAxiosError = (error: unknown): never => {
    if (error instanceof AxiosError) {
        const responseData = error.response?.data;

        try {
            throw ErrorResponseParsedSchema.parse(responseData);
        } catch {
            throw {
                message: "알 수 없는 서버 오류가 발생했습니다.",
                status: error.response?.status ?? 500,
            };
        }
    }

    throw {
        message: "네트워크 오류가 발생했습니다.",
        status: 0,
    };
};
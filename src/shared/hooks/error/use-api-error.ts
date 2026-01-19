import { useToast } from "@bigtablet/design-system";
import type { ErrorResponseParsed } from "src/shared/schema/error/parsed";

const statusMessageMap: Record<number, string> = {
    400: "잘못된 요청입니다.",
    401: "로그인이 필요합니다.",
    403: "접근 권한이 없습니다.",
    404: "요청한 리소스를 찾을 수 없습니다.",
    409: "이미 처리된 요청입니다.",
    422: "입력값을 다시 확인해 주세요.",
    500: "서버 오류가 발생했습니다.",
    502: "서버 응답이 지연되고 있습니다.",
    503: "현재 서비스를 이용할 수 없습니다.",
};

/**
 * @description
 * API 에러(ErrorResponseParsed)를 받아 사용자에게 토스트로 노출하는 공통 훅
 */
export const useApiErrorToast = () => {
    const toast = useToast();

    return (error: unknown) => {
        const parsedError =
            typeof error === "object" && error !== null
                ? (error as Partial<ErrorResponseParsed>)
                : {};

        const status = parsedError.status ?? 0;

        /** 401은 interceptor에서 처리 */
        if (status === 401) return;

        const message =
            statusMessageMap[status] ??
            parsedError.message ??
            "알 수 없는 오류가 발생했습니다.";

        toast.error(message);
    };
};
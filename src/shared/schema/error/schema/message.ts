/**
 * @param target 사용된 스키마 속성의 형식명
 * @returns ${target} 형식이 올바르지 않습니다!
 * @example "이메일 형식이 올바르지 않습니다!"
 */
export const message = (target: string) => {
    return `형식은 ${target} 이어야 합니다.`;
};

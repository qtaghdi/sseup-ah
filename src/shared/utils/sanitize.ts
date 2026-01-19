/**
 * 중국어 문자를 제거하는 유틸리티
 * 모든 CJK 한자를 제거하는 엄격한 모드
 */

// CJK 한자 범위 (모든 한자)
const CJK_CHARACTERS = /[\u4e00-\u9fff\u3400-\u4dbf]/g;

/**
 * 텍스트에서 모든 한자와 중국어 문장부호를 제거
 */
export const removeChinese = (text: string): string => {
	let result = text;

	// 1. 모든 CJK 한자 제거
	result = result.replace(CJK_CHARACTERS, '');

	// 2. 중국어 문장부호를 한국어/영어 문장부호로 변환
	result = result
		.replace(/，/g, ',')
		.replace(/。/g, '.')
		.replace(/！/g, '!')
		.replace(/？/g, '?')
		.replace(/、/g, ',')
		.replace(/；/g, ';')
		.replace(/：/g, ':')
		.replace(/"/g, '"')
		.replace(/"/g, '"')
		.replace(/'/g, "'")
		.replace(/'/g, "'")
		.replace(/（/g, '(')
		.replace(/）/g, ')')
		.replace(/【/g, '[')
		.replace(/】/g, ']')
		.replace(/《/g, '<')
		.replace(/》/g, '>');

	return result;
};

/**
 * AI 응답 정제 - 중국어 제거 + 마크다운 포맷 정리
 */
export const sanitizeAIResponse = (text: string): string => {
	let result = removeChinese(text);

	// 1. 과도한 별표/헤딩 정리
	result = result
		.replace(/\*{3,}/g, '')
		.replace(/#{4,}/g, '###');

	// 2. 각 줄 단위로 처리 (줄바꿈 보존)
	const lines = result.split('\n');
	const processedLines: string[] = [];

	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];

		// 줄 내 연속 공백만 정리 (한 칸으로)
		line = line.replace(/ {2,}/g, ' ').trim();

		// ## 헤딩 앞에 빈 줄 추가 (첫 줄이 아닌 경우)
		if (line.startsWith('## ') && i > 0 && processedLines.length > 0) {
			const lastLine = processedLines[processedLines.length - 1];
			if (lastLine !== '') {
				processedLines.push('');
			}
		}

		processedLines.push(line);
	}

	// 3. 연속 빈 줄은 최대 2개로 제한
	result = processedLines.join('\n').replace(/\n{4,}/g, '\n\n\n');

	return result.trim();
};

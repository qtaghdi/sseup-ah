/**
 * AI 응답 정제 유틸리티
 * 한글, 영어, 숫자, 기본 문장부호만 허용
 */

// 허용할 문자: 한글, 영어, 숫자, 기본 문장부호, 마크다운 문법
const ALLOWED_CHARS = /[가-힣a-zA-Z0-9\s.,!?:;'"()\[\]{}<>@#$%^&*+=\-_/\\|`~\n\r]/g;

/**
 * 한글, 영어, 숫자, 기본 문장부호만 남기고 모두 제거
 */
export const sanitizeToKoreanEnglish = (text: string): string => {
	// 허용된 문자만 추출
	const matches = text.match(ALLOWED_CHARS);
	return matches ? matches.join('') : '';
};

/**
 * AI 응답 정제 - 허용 문자만 남기고 마크다운 포맷 정리
 */
export const sanitizeAIResponse = (text: string): string => {
	// 1. 한글, 영어, 숫자, 기본 문장부호만 남기기
	let result = sanitizeToKoreanEnglish(text);

	// 2. 과도한 별표/헤딩 정리
	result = result
		.replace(/\*{3,}/g, '')
		.replace(/#{4,}/g, '###');

	// 3. 각 줄 단위로 처리 (줄바꿈 보존)
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

		// 리스트 항목(-) 앞에 빈 줄이 없으면 추가 (헤딩 바로 다음은 제외)
		if (line.startsWith('- ') && processedLines.length > 0) {
			const lastLine = processedLines[processedLines.length - 1];
			// 이전 줄이 헤딩이 아니고, 빈 줄도 아니고, 리스트도 아닌 경우 빈 줄 추가
			if (lastLine !== '' && !lastLine.startsWith('## ') && !lastLine.startsWith('- ')) {
				processedLines.push('');
			}
		}

		// 일반 텍스트가 리스트 다음에 오면 빈 줄 추가
		if (line !== '' && !line.startsWith('- ') && !line.startsWith('## ') && processedLines.length > 0) {
			const lastLine = processedLines[processedLines.length - 1];
			if (lastLine.startsWith('- ')) {
				processedLines.push('');
			}
		}

		processedLines.push(line);
	}

	// 4. 연속 빈 줄은 최대 1개로 제한 (더 깔끔하게)
	result = processedLines.join('\n').replace(/\n{3,}/g, '\n\n');

	return result.trim();
};

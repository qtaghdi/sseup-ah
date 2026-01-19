# 씁.. 아...

> 프로젝트 피드백, 친구처럼 솔직하게

AI 기반 프로젝트 피드백 서비스입니다. 프로젝트 정보를 입력하거나 GitHub 레포지토리 URL을 제출하면, 경험 많은 개발자 친구처럼 솔직한 피드백을 제공합니다.

## 주요 기능

### 입력 방식
- **직접 입력**: 프로젝트 설명, 기술 스택, 팀 규모, 개발 기간을 직접 입력
- **GitHub 분석**: GitHub 레포지토리 URL을 입력하면 README, 파일 구조, 의존성 등을 자동 분석

### 피드백 모드
- **멘탈 보호 모드**: 부드러운 표현으로 칭찬을 먼저 하고 개선점을 완곡하게 전달
- **솔직 모드**: 10년차 선배가 훈수두듯 직설적으로 팩트 폭격

### 피드백 내용
- 한 줄 총평
- 잘한 점
- 개선이 필요한 부분
- 예상되는 문제 상황
- 현실적인 조언

## 기술 스택

- **Frontend**: Next.js 16, React, TypeScript, SCSS Modules
- **Backend**: Next.js API Routes
- **AI**: Groq API (Llama 3.3 70B)
- **External API**: GitHub REST API

## 시작하기

### 환경 변수 설정

`.env.local` 파일을 생성하고 아래 내용을 추가하세요:

```env
# Groq API Key (필수)
# https://console.groq.com/keys 에서 발급
GROQ_API_KEY=your_groq_api_key_here

# GitHub API Token (선택)
# 없어도 공개 레포 분석 가능, 있으면 API 호출 제한 완화 (60회/시간 → 5000회/시간)
# https://github.com/settings/tokens 에서 발급
GITHUB_TOKEN=your_github_token_here
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

### 배포

Vercel에서 바로 배포 가능합니다:

1. GitHub 레포지토리 연결
2. Environment Variables에 `GROQ_API_KEY`, `GITHUB_TOKEN` 추가
3. Deploy

## GitHub 분석 한계

현재 GitHub API로 분석 가능한 정보:
- README 내용
- 루트 폴더 파일/폴더 목록
- package.json (의존성)
- 사용 언어 비율
- Stars, Forks, Issues 수

실제 소스 코드 내용, 하위 폴더 구조, 코드 품질 분석은 API 제한으로 지원하지 않습니다.

## 라이선스

This project is open source and available under the [MIT License](LICENSE.md).
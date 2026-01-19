# CLAUDE.md - 씁.. 아… 프로젝트

## 프로젝트 개요
"씁.. 아…"는 프로젝트를 진행 중인 사용자가 자신의 프로젝트 정보를 입력하면, 현실적이고 직설적인 말투로 피드백을 제공하는 AI 기반 프로젝트 피드백 서비스입니다.

## 기술 스택
- **프레임워크**: Next.js 16.1.0 (App Router)
- **언어**: TypeScript
- **UI 라이브러리**: React 19.2.0
- **디자인 시스템**: @bigtablet/design-system
- **상태 관리**: TanStack Query (React Query) v5
- **HTTP 클라이언트**: Axios
- **스타일링**: Sass, CSS
- **폰트**: Pretendard
- **코드 품질**: Biome (lint & format)
- **AI**: OpenAI API (서버리스 함수를 통해 연동)

## 프로젝트 아키텍처
Feature-Sliced Design (FSD) 아키텍처를 따릅니다:

```
src/
├── app/              # Next.js App Router 페이지 및 레이아웃
├── processes/        # 비즈니스 프로세스 (현재 미사용)
├── features/         # 사용자 시나리오별 기능 단위
├── entities/         # 비즈니스 엔티티 (데이터 모델)
├── widgets/          # 독립적인 UI 블록
└── shared/           # 공유 유틸리티, 훅, API 설정
    ├── hooks/        # 커스텀 훅
    ├── libs/         # 라이브러리 및 API 설정
    └── schema/       # Zod 스키마 및 타입 정의
```

## 주요 명령어
```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # Biome으로 린트 검사
npm run format   # Biome으로 코드 포맷팅
```

## 핵심 기능 명세

### 1. 프로젝트 정보 입력
- 프로젝트 설명 (텍스트)
- 사용 기술 스택 (텍스트)
- 팀 규모 (숫자)
- 예상 개발 기간 (텍스트)

### 2. AI 피드백 생성
OpenAI API를 통해 다음 구조의 피드백 생성:
- 한 줄 총평
- 잘한 점
- 개선이 필요한 부분
- 예상되는 문제 상황 및 리스크
- 현실적인 조언

### 3. 피드백 톤 조절
- **멘탈 보호 모드**: 부드러운 표현 위주
- **솔직 모드**: 직설적인 표현, 현실적 문제점 강조

### 4. 예외 처리
- API 호출 실패 시 안내 메시지
- 응답 지연 시 대체 문구: "씁.. 아… 지금 생각이 좀 많네. 다시 한 번 눌러봐."

## 환경 변수
```env
OPENAI_API_KEY=your_openai_api_key
```

## 코딩 컨벤션
- Biome 설정을 따름
- 컴포넌트: PascalCase
- 훅: camelCase (use 접두사)
- 타입: PascalCase
- 상수: SCREAMING_SNAKE_CASE
- 파일명: kebab-case 또는 PascalCase (컴포넌트)

## 주의사항
- 데이터베이스 및 인증 시스템 없음 (MVP)
- 입력값은 저장되지 않음
- 발표용 MVP 수준으로 핵심 기능만 구현

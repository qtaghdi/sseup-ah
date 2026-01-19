import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { sanitizeAIResponse } from "src/shared/utils/sanitize";

const getGroqClient = () => {
	return new Groq({
		apiKey: process.env.GROQ_API_KEY,
	});
};

type FeedbackMode = "protect" | "honest";

interface GitHubRequest {
	repoUrl: string;
	mode: FeedbackMode;
}

interface RepoInfo {
	name: string;
	description: string | null;
	language: string | null;
	languages: Record<string, number>;
	stars: number;
	forks: number;
	openIssues: number;
	readme: string | null;
	fileStructure: string[];
	packageJson: Record<string, unknown> | null;
}

const parseGitHubUrl = (url: string): { owner: string; repo: string } | null => {
	const patterns = [
		/github\.com\/([^\/]+)\/([^\/]+)/,
		/^([^\/]+)\/([^\/]+)$/,
	];

	for (const pattern of patterns) {
		const match = url.match(pattern);
		if (match) {
			return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
		}
	}
	return null;
};

const fetchGitHubData = async (owner: string, repo: string): Promise<RepoInfo> => {
	const headers: HeadersInit = {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": "sseup-ah-feedback",
	};

	if (process.env.GITHUB_TOKEN) {
		headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
	}

	const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
	if (!repoRes.ok) {
		throw new Error("레포지토리를 찾을 수 없어. URL을 다시 확인해봐.");
	}
	const repoData = await repoRes.json();

	const [languagesRes, contentsRes, readmeRes] = await Promise.all([
		fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers }),
		fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers }),
		fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers }),
	]);

	const languages = languagesRes.ok ? await languagesRes.json() : {};

	let fileStructure: string[] = [];
	if (contentsRes.ok) {
		const contents = await contentsRes.json();
		fileStructure = Array.isArray(contents)
			? contents.map((item: { name: string; type: string }) => `${item.type === "dir" ? "📁" : "📄"} ${item.name}`)
			: [];
	}

	let readme: string | null = null;
	if (readmeRes.ok) {
		const readmeData = await readmeRes.json();
		if (readmeData.content) {
			readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
			if (readme.length > 3000) {
				readme = `${readme.substring(0, 3000)}...(생략)`;
			}
		}
	}

	let packageJson: Record<string, unknown> | null = null;
	const packageRes = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
		{ headers }
	);
	if (packageRes.ok) {
		const packageData = await packageRes.json();
		if (packageData.content) {
			try {
				packageJson = JSON.parse(Buffer.from(packageData.content, "base64").toString("utf-8"));
			} catch {
				packageJson = null;
			}
		}
	}

	return {
		name: repoData.name,
		description: repoData.description,
		language: repoData.language,
		languages,
		stars: repoData.stargazers_count,
		forks: repoData.forks_count,
		openIssues: repoData.open_issues_count,
		readme,
		fileStructure,
		packageJson,
	};
};

const getSystemPrompt = (mode: FeedbackMode): string => {
	const basePrompt = `너는 수많은 프로젝트를 경험해본 개발자 친구야. 사용자가 GitHub 레포지토리 정보를 공유하면, 코드 구조와 프로젝트 설정을 분석해서 친구처럼 솔직하게 피드백을 줘.

반드시 아래 마크다운 형식으로 답변해줘. 각 섹션은 반드시 분리해서 작성해:

## 한 줄 총평

짧고 임팩트 있는 한 문장만 작성해. 절대 길게 쓰지 마.

## 잘한 점

- 첫 번째 잘한 점
- 두 번째 잘한 점
- 세 번째 잘한 점

(리스트 형식으로 작성)

## 개선이 필요한 부분

- 첫 번째 개선점
- 두 번째 개선점
- 세 번째 개선점

(리스트 형식으로 작성)

## 예상되는 문제 상황

- 첫 번째 리스크
- 두 번째 리스크

(리스트 형식으로 작성)

## 현실적인 조언

구체적인 조언을 단락으로 나눠서 작성해.

중요한 규칙:
- 반드시 한국어로만 답변해. 중국어, 일본어, 영어 절대 사용 금지
- 반말로 말해
- 각 섹션 사이에 빈 줄을 넣어서 구분해
- "한 줄 총평"은 정말 한 문장만! 길게 쓰면 안 돼
- 리스트는 반드시 "- " 형식으로 작성해
- 파일 구조, 의존성, README 등 실제 데이터를 기반으로 구체적으로 피드백해`;

	if (mode === "protect") {
		return `${basePrompt}

추가 규칙 (멘탈 보호 모드):
- 비교적 부드러운 표현을 사용해
- 직설적인 표현은 최소화해
- 칭찬을 먼저 하고 개선점을 부드럽게 말해
- "근데", "그래도" 같은 완충 표현을 자주 사용해`;
	}

	return `${basePrompt}

추가 규칙 (솔직 모드 - 훈수쟁이 선배 스타일):
- 10년차 개발자가 후배한테 훈수두는 것처럼 말해
- "아 그거 왜 그렇게 해?", "그건 좀 아닌데", "진짜 그렇게 할 거야?" 같은 표현 사용
- 한숨 쉬는 느낌으로 "하아...", "음...", "야..." 같은 감탄사 자주 써
- "내가 해봐서 아는데", "경험상 그건" 같은 꼰대력 발휘
- 살짝 짜증 섞인 말투로 "솔직히 이건 좀...", "이거 누가 봐도..."
- 잘한 점도 인정하긴 하는데 "뭐 그건 당연한 거고" 이런 식으로 쿨하게
- 조언할 때는 "내 말 안 들으면 나중에 고생해", "걍 내 말대로 해" 같은 느낌
- 마지막에 "근데 뭐 어떻게 하든 니 맘이지만" 같은 투로 마무리`;
};

export async function POST(request: NextRequest) {
	try {
		const body: GitHubRequest = await request.json();
		const { repoUrl, mode } = body;

		if (!repoUrl) {
			return NextResponse.json(
				{ error: "GitHub URL을 입력해줘." },
				{ status: 400 }
			);
		}

		const parsed = parseGitHubUrl(repoUrl);
		if (!parsed) {
			return NextResponse.json(
				{ error: "올바른 GitHub URL 형식이 아니야. 예: https://github.com/owner/repo" },
				{ status: 400 }
			);
		}

		const repoInfo = await fetchGitHubData(parsed.owner, parsed.repo);

		const languageList = Object.entries(repoInfo.languages)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 5)
			.map(([lang, bytes]) => `${lang}: ${Math.round(bytes / 1024)}KB`)
			.join(", ");

		const dependencies = repoInfo.packageJson
			? Object.keys((repoInfo.packageJson as { dependencies?: Record<string, string> }).dependencies || {}).join(", ")
			: "확인 불가";

		const devDependencies = repoInfo.packageJson
			? Object.keys((repoInfo.packageJson as { devDependencies?: Record<string, string> }).devDependencies || {}).join(", ")
			: "확인 불가";

		const userMessage = `GitHub 레포지토리 분석 요청:

📌 기본 정보:
- 이름: ${repoInfo.name}
- 설명: ${repoInfo.description || "없음"}
- 주요 언어: ${repoInfo.language || "확인 불가"}
- Stars: ${repoInfo.stars} / Forks: ${repoInfo.forks} / Open Issues: ${repoInfo.openIssues}

📁 파일 구조 (루트):
${repoInfo.fileStructure.join("\n")}

🛠 사용 언어 비율:
${languageList || "확인 불가"}

📦 Dependencies:
${dependencies}

📦 DevDependencies:
${devDependencies}

📄 README 내용:
${repoInfo.readme || "README가 없어"}

이 프로젝트에 대해 피드백 부탁해!`;

		const groq = getGroqClient();
		const completion = await groq.chat.completions.create({
			model: "llama-3.3-70b-versatile",
			messages: [
				{ role: "system", content: getSystemPrompt(mode) },
				{ role: "user", content: userMessage },
			],
			max_tokens: 2500,
			temperature: 0.8,
		});

		const rawFeedback = completion.choices[0]?.message?.content;

		if (!rawFeedback) {
			return NextResponse.json(
				{ error: "씁.. 아… 지금 생각이 좀 많네. 다시 한 번 눌러봐." },
				{ status: 500 }
			);
		}

		const feedback = sanitizeAIResponse(rawFeedback);
		return NextResponse.json({
			feedback,
			repoInfo: {
				name: repoInfo.name,
				description: repoInfo.description,
				language: repoInfo.language,
				stars: repoInfo.stars,
			},
		});
	} catch (error) {
		console.error("GitHub API Error:", error);
		const message = error instanceof Error ? error.message : "씁.. 아… 지금 생각이 좀 많네. 다시 한 번 눌러봐.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

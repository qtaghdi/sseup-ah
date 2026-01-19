"use client";

import { useState } from "react";
import styles from "./page.module.scss";

type FeedbackMode = "protect" | "honest";
type InputMode = "manual" | "github";

interface FormData {
	description: string;
	techStack: string;
	teamSize: string;
	duration: string;
}

interface RepoInfo {
	name: string;
	description: string | null;
	language: string | null;
	stars: number;
}

export default function Home() {
	const [inputMode, setInputMode] = useState<InputMode>("manual");
	const [formData, setFormData] = useState<FormData>({
		description: "",
		techStack: "",
		teamSize: "",
		duration: "",
	});
	const [githubUrl, setGithubUrl] = useState("");
	const [mode, setMode] = useState<FeedbackMode>("protect");
	const [feedback, setFeedback] = useState<string>("");
	const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleManualSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setFeedback("");
		setRepoInfo(null);

		try {
			const response = await fetch("/api/feedback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					teamSize: Number(formData.teamSize),
					mode,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "피드백 생성에 실패했어.");
			}

			setFeedback(data.feedback);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "씁.. 아… 지금 생각이 좀 많네. 다시 한 번 눌러봐.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGitHubSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setFeedback("");
		setRepoInfo(null);

		try {
			const response = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ repoUrl: githubUrl, mode }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "피드백 생성에 실패했어.");
			}

			setFeedback(data.feedback);
			setRepoInfo(data.repoInfo);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "씁.. 아… 지금 생각이 좀 많네. 다시 한 번 눌러봐.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const isManualFormValid =
		formData.description.trim() !== "" &&
		formData.techStack.trim() !== "" &&
		formData.teamSize.trim() !== "" &&
		formData.duration.trim() !== "";

	const isGitHubFormValid = githubUrl.trim() !== "";

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<header className={styles.header}>
					<h1 className={styles.title}>씁.. 아…</h1>
					<p className={styles.subtitle}>
						프로젝트 피드백, 친구처럼 솔직하게
					</p>
				</header>

				<div className={styles.inputModeSelector}>
					<button
						type="button"
						className={`${styles.inputModeButton} ${inputMode === "manual" ? styles.active : ""}`}
						onClick={() => setInputMode("manual")}
					>
						직접 입력
					</button>
					<button
						type="button"
						className={`${styles.inputModeButton} ${inputMode === "github" ? styles.active : ""}`}
						onClick={() => setInputMode("github")}
					>
						GitHub 분석
					</button>
				</div>

				<div className={styles.form}>
					<div className={styles.modeSelector}>
						<button
							type="button"
							className={`${styles.modeButton} ${mode === "protect" ? styles.active : ""}`}
							onClick={() => setMode("protect")}
						>
							멘탈 보호 모드
						</button>
						<button
							type="button"
							className={`${styles.modeButton} ${mode === "honest" ? styles.active : ""}`}
							onClick={() => setMode("honest")}
						>
							솔직 모드
						</button>
					</div>

					{inputMode === "manual" ? (
						<form onSubmit={handleManualSubmit}>
							<div className={styles.inputGroup}>
								<label htmlFor="description" className={styles.label}>
									프로젝트 설명
								</label>
								<textarea
									id="description"
									name="description"
									className={styles.textarea}
									placeholder="어떤 프로젝트야? 뭘 만들려고 하는지 설명해봐"
									value={formData.description}
									onChange={handleInputChange}
									rows={4}
								/>
							</div>

							<div className={styles.inputGroup}>
								<label htmlFor="techStack" className={styles.label}>
									기술 스택
								</label>
								<input
									type="text"
									id="techStack"
									name="techStack"
									className={styles.input}
									placeholder="예: React, Node.js, PostgreSQL"
									value={formData.techStack}
									onChange={handleInputChange}
								/>
							</div>

							<div className={styles.row}>
								<div className={styles.inputGroup}>
									<label htmlFor="teamSize" className={styles.label}>
										팀 규모
									</label>
									<input
										type="number"
										id="teamSize"
										name="teamSize"
										className={styles.input}
										placeholder="몇 명?"
										min="1"
										value={formData.teamSize}
										onChange={handleInputChange}
									/>
								</div>

								<div className={styles.inputGroup}>
									<label htmlFor="duration" className={styles.label}>
										예상 개발 기간
									</label>
									<input
										type="text"
										id="duration"
										name="duration"
										className={styles.input}
										placeholder="예: 2주, 1개월"
										value={formData.duration}
										onChange={handleInputChange}
									/>
								</div>
							</div>

							<button
								type="submit"
								className={styles.submitButton}
								disabled={!isManualFormValid || isLoading}
							>
								{isLoading ? "생각 중..." : "피드백 받기"}
							</button>
						</form>
					) : (
						<form onSubmit={handleGitHubSubmit}>
							<div className={styles.inputGroup}>
								<label htmlFor="githubUrl" className={styles.label}>
									GitHub 레포지토리 URL
								</label>
								<input
									type="text"
									id="githubUrl"
									className={styles.input}
									placeholder="https://github.com/owner/repo"
									value={githubUrl}
									onChange={(e) => setGithubUrl(e.target.value)}
								/>
								<p className={styles.hint}>
									공개 레포지토리만 분석할 수 있어
								</p>
							</div>

							<button
								type="submit"
								className={styles.submitButton}
								disabled={!isGitHubFormValid || isLoading}
							>
								{isLoading ? "분석 중..." : "레포 분석하기"}
							</button>
						</form>
					)}
				</div>

				{isLoading && (
					<div className={styles.loadingSection}>
						<div className={styles.loadingSpinner} />
						<p className={styles.loadingText}>
							{inputMode === "github"
								? "레포지토리 뜯어보는 중..."
								: "음… 잠깐만, 프로젝트 좀 살펴볼게"}
						</p>
					</div>
				)}

				{error && (
					<div className={styles.errorSection}>
						<p className={styles.errorText}>{error}</p>
					</div>
				)}

				{feedback && !isLoading && (
					<div className={styles.feedbackSection}>
						{repoInfo && (
							<div className={styles.repoInfoBadge}>
								<span className={styles.repoName}>{repoInfo.name}</span>
								{repoInfo.language && (
									<span className={styles.repoLanguage}>{repoInfo.language}</span>
								)}
								<span className={styles.repoStars}>⭐ {repoInfo.stars}</span>
							</div>
						)}
						<h2 className={styles.feedbackTitle}>피드백</h2>
						<div className={styles.feedbackContent}>
							{feedback.split("\n").map((line, index) => {
								if (line.startsWith("## ")) {
									return (
										<h3 key={index} className={styles.feedbackHeading}>
											{line.replace("## ", "")}
										</h3>
									);
								}
								if (line.trim() === "") {
									return <br key={index} />;
								}
								return (
									<p key={index} className={styles.feedbackParagraph}>
										{line}
									</p>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</main>
	);
}

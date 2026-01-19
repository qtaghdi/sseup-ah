"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";

type FeedbackMode = "protect" | "honest";
type InputMode = "manual" | "github";

export default function Home() {
	const [inputMode, setInputMode] = useState<InputMode>("github");
	const [mode, setMode] = useState<FeedbackMode>("protect");
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Manual input
	const [description, setDescription] = useState("");
	const [techStack, setTechStack] = useState("");
	const [teamSize, setTeamSize] = useState(1);
	const [duration, setDuration] = useState("");

	// GitHub input
	const [repoUrl, setRepoUrl] = useState("");

	const handleManualSubmit = async () => {
		if (!description || !techStack || !duration) {
			setError("모든 필드를 입력해줘.");
			return;
		}

		setLoading(true);
		setError(null);
		setFeedback(null);

		try {
			const res = await fetch("/api/feedback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ description, techStack, teamSize, duration, mode }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "피드백 생성 실패");
			}

			setFeedback(data.feedback);
		} catch (err) {
			setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어.");
		} finally {
			setLoading(false);
		}
	};

	const handleGitHubSubmit = async () => {
		if (!repoUrl) {
			setError("GitHub URL을 입력해줘.");
			return;
		}

		setLoading(true);
		setError(null);
		setFeedback(null);

		try {
			const res = await fetch("/api/github", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ repoUrl, mode }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.error || "피드백 생성 실패");
			}

			setFeedback(data.feedback);
		} catch (err) {
			setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했어.");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = () => {
		if (inputMode === "manual") {
			handleManualSubmit();
		} else {
			handleGitHubSubmit();
		}
	};

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<header className={styles.header}>
					<h1 className={styles.title}>씁.. 아...</h1>
					<p className={styles.subtitle}>솔직한 프로젝트 피드백 서비스</p>
				</header>

				<div className={styles.inputModeToggle}>
					<button
						type="button"
						className={`${styles.toggleBtn} ${inputMode === "github" ? styles.active : ""}`}
						onClick={() => setInputMode("github")}
					>
						GitHub 분석
					</button>
					<button
						type="button"
						className={`${styles.toggleBtn} ${inputMode === "manual" ? styles.active : ""}`}
						onClick={() => setInputMode("manual")}
					>
						직접 입력
					</button>
				</div>

				<div className={styles.modeSelector}>
					<button
						type="button"
						className={`${styles.modeBtn} ${mode === "protect" ? styles.active : ""}`}
						onClick={() => setMode("protect")}
					>
						멘탈 보호 모드
					</button>
					<button
						type="button"
						className={`${styles.modeBtn} ${mode === "honest" ? styles.active : ""}`}
						onClick={() => setMode("honest")}
					>
						솔직 모드
					</button>
				</div>

				{inputMode === "github" ? (
					<div className={styles.form}>
						<div className={styles.field}>
							<label htmlFor="repoUrl">GitHub URL</label>
							<input
								id="repoUrl"
								type="text"
								placeholder="https://github.com/username/repo"
								value={repoUrl}
								onChange={(e) => setRepoUrl(e.target.value)}
							/>
						</div>
					</div>
				) : (
					<div className={styles.form}>
						<div className={styles.field}>
							<label htmlFor="description">프로젝트 설명</label>
							<textarea
								id="description"
								placeholder="어떤 프로젝트인지 설명해줘"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								rows={4}
							/>
						</div>
						<div className={styles.field}>
							<label htmlFor="techStack">기술 스택</label>
							<input
								id="techStack"
								type="text"
								placeholder="React, TypeScript, Node.js..."
								value={techStack}
								onChange={(e) => setTechStack(e.target.value)}
							/>
						</div>
						<div className={styles.row}>
							<div className={styles.field}>
								<label htmlFor="teamSize">팀 규모</label>
								<input
									id="teamSize"
									type="number"
									min={1}
									value={teamSize}
									onChange={(e) => setTeamSize(Number(e.target.value))}
								/>
							</div>
							<div className={styles.field}>
								<label htmlFor="duration">개발 기간</label>
								<input
									id="duration"
									type="text"
									placeholder="2주, 1개월..."
									value={duration}
									onChange={(e) => setDuration(e.target.value)}
								/>
							</div>
						</div>
					</div>
				)}

				<button
					type="button"
					className={styles.submitBtn}
					onClick={handleSubmit}
					disabled={loading}
				>
					{loading ? "분석 중..." : "피드백 받기"}
				</button>

				{error && <div className={styles.error}>{error}</div>}

				{feedback && (
					<div className={styles.feedback}>
						<ReactMarkdown>{feedback}</ReactMarkdown>
					</div>
				)}
			</div>
		</main>
	);
}

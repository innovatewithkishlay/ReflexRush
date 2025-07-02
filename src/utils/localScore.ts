const HIGH_SCORE_KEY = "reflexrush_highscore";

export function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(HIGH_SCORE_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export function setHighScore(score: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HIGH_SCORE_KEY, String(score));
}

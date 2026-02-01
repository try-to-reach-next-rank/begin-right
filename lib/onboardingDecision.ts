// lib/onboardingDecision.ts
// Quyết định level & chế độ dựa trên câu trả lời onboarding (MVP đơn giản)

import type {
  FitnessGrade,
  OnboardingAnswers,
  OnboardingDecision,
  Level,
} from "./storage";

function gradeToScore(g: FitnessGrade): number {
  // A tốt nhất -> 3, D thấp nhất -> 0
  if (g === "A") return 3;
  if (g === "B") return 2;
  if (g === "C") return 1;
  return 0;
}

function fitnessStats(answers: OnboardingAnswers): { avg: number; min: number } {
  const scores = [
    gradeToScore(answers.fitnessCheck.squat),
    gradeToScore(answers.fitnessCheck.push),
    gradeToScore(answers.fitnessCheck.balance),
  ];
  const sum = scores.reduce((a, b) => a + b, 0);
  return { avg: sum / scores.length, min: Math.min(...scores) };
}

export function decideOnboarding(
  answers: OnboardingAnswers
): OnboardingDecision {

  const { healthGroup, fitnessCheck, sessionLength, levelSelfCheck } = answers;

  // 1) STOP nếu "bệnh nền hoặc vấn đề khác"
  if (healthGroup === "other") {
    return {
      resultType: "stop",
      reason:
        "Bạn chọn tình trạng bệnh nền hoặc vấn đề khác. Begin Right không thể đảm bảo an toàn cho trường hợp này."
    };
  }

  // 2) STOP nếu có bất kỳ mức D
  const grades = [
    fitnessCheck.squat,
    fitnessCheck.push,
    fitnessCheck.balance
  ];

  const hasD = grades.some(g => g === "D");

  if (hasD) {
    return {
      resultType: "stop",
      reason:
        "Kết quả fitness check cho thấy bạn chọn mức D. Hãy ưu tiên đánh giá thêm hoặc bắt đầu với hướng dẫn cơ bản."
    };
  }

  // 3) Nếu form chưa ok -> Safety
  if (levelSelfCheck === "not_ok") {
    return {
      resultType: "safety",
      reason:
        "Bạn chưa tự tin về kỹ thuật. Hãy bắt đầu với các biến thể dễ để đảm bảo an toàn."
    };
  }

  // 4) Chỉ A/B/C -> Training
  const { avg } = fitnessStats(answers);

  const level =
    avg >= 2.4 && sessionLength !== 15
      ? "beginner_plus"
      : "beginner";

  const healthPreset =
    healthGroup === "knee"
      ? "knee_safe"
      : healthGroup === "back"
      ? "back_safe"
      : "normal";

  return {
    resultType: "training",
    level,
    healthPreset
  };
}

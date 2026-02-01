"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { OnboardingAnswers } from "@/lib/storage";
import { setOnboarding } from "@/lib/storage";
import { decideOnboarding } from "@/lib/onboardingDecision";

export default function OnboardingPage() {
  const router = useRouter();

  const [answers, setAnswers] = useState<OnboardingAnswers>({
    sessionLength: 15,
    levelSelfCheck: "ok",
    healthGroup: "healthy",
    fitnessCheck: {
      squat: "B",
      push: "B",
      balance: "B",
    },
  });


  function submit() {
    const decision = decideOnboarding(answers);
    setOnboarding(answers, decision);

    if (decision.resultType === "stop") {
      router.replace("/stop");
      return;
    }
    // Với training / safety: đi qua trang kết quả để giải thích rõ lý do & gợi ý.
    router.replace("/results");
  }

  return (
    <main style={{ minHeight: "100vh", padding: 16 }}>
      <div style={{ maxWidth: 420, margin: "0 auto" }}>
        <div style={{ opacity: 0.7, fontSize: 14 }}>Begin Right · Onboarding</div>

        <h1 style={{ fontSize: 26, marginTop: 8 }}>Thiết lập nhanh</h1>

        <p style={{ opacity: 0.8, marginTop: 8 }}>
          Chúng tôi hỏi vài câu để chọn nhịp tập phù hợp. Không cần tài khoản.
          Thiết lập sẽ được lưu trên thiết bị của bạn.
        </p>

        {/* Q1: session length */}
        <section style={cardStyle}>
          <div style={titleStyle}>1) Bạn có thể tập mỗi buổi bao lâu?</div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 }}>
            {[15, 25, 40].map((v) => (
              <button
                key={v}
                onClick={() => setAnswers((p) => ({ ...p, sessionLength: v as 15 | 25 | 40 }))}
                style={pillStyle(answers.sessionLength === v)}
              >
                {v} phút
              </button>
            ))}
          </div>
        </section>

        {/* Q2: self check */}
        <section style={cardStyle}>
          <div style={titleStyle}>2) Bạn có tự tin giữ form cơ bản không?</div>
          <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
            Ví dụ: lưng không gù quá, gối không sụp vào trong, bạn biết dừng lại khi thấy sai.
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            <button
              onClick={() => setAnswers((p) => ({ ...p, levelSelfCheck: "ok" }))}
              style={rowStyle(answers.levelSelfCheck === "ok")}
            >
              Mình làm được cơ bản
            </button>

            <button
              onClick={() => setAnswers((p) => ({ ...p, levelSelfCheck: "not_ok" }))}
              style={rowStyle(answers.levelSelfCheck === "not_ok")}
            >
              Mình chưa chắc / hay làm sai
            </button>
          </div>
        </section>

        {/* Q3: health */}
        <section style={cardStyle}>
          <div style={titleStyle}>3) Sức khỏe & khớp</div>
          <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
            Chọn phương án đúng nhất. Nếu không chắc, hãy chọn thận trọng hơn.
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            <button
              onClick={() => setAnswers((p) => ({ ...p, healthGroup: "healthy" }))}
              style={rowStyle(answers.healthGroup === "healthy")}
            >
              Hoàn toàn khỏe mạnh
            </button>

            <button
              onClick={() => setAnswers((p) => ({ ...p, healthGroup: "knee" }))}
              style={rowStyle(answers.healthGroup === "knee")}
            >
              Đầu gối nhạy / khó chịu nhẹ
            </button>

            <button
              onClick={() => setAnswers((p) => ({ ...p, healthGroup: "back" }))}
              style={rowStyle(answers.healthGroup === "back")}
            >
              Lưng dưới nhạy / căng nhẹ
            </button>

            <button
              onClick={() => setAnswers((p) => ({ ...p, healthGroup: "other" }))}
              style={rowStyle(answers.healthGroup === "other")}
            >
              Bệnh nền / vấn đề khác (Begin Right không hỗ trợ)
            </button>
          </div>
        </section>
<section style={cardStyle}>
  <div style={titleStyle}>4) Khả năng hiện tại (nhẹ, không áp lực)</div>
  <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
    Không có đáp án “tốt/kém”. Chúng tôi chỉ dùng để chọn nhịp tập an toàn.
  </div>

  {/* 4.1 Squat */}
  <div style={{ marginTop: 12, fontWeight: 700 }}>4.1) Squat chậm 5 lần liên tiếp</div>
  <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
    Xuống–lên chậm 3–4 giây, ưu tiên giữ form.
  </div>
  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
    {[
      ["A", "Làm được, khá thoải mái"],
      ["B", "Làm được nhưng mỏi nhanh / hơi mất thăng bằng"],
      ["C", "Khó giữ form / thấy căng gối–lưng"],
      ["D", "Không squat được"],
    ].map(([k, label]) => (
      <button
        key={k}
        onClick={() =>
          setAnswers((p) => ({
            ...p,
            fitnessCheck: { ...p.fitnessCheck, squat: k as any },
          }))
        }
        style={rowStyle(answers.fitnessCheck.squat === (k as any))}
      >
        {k}. {label}
      </button>
    ))}
  </div>

  {/* 4.2 Push */}
  <div style={{ marginTop: 14, fontWeight: 700 }}>4.2) Chống đẩy cao (tay lên bàn/ghế)</div>
  <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
    Làm liên tục với form tương đối ổn.
  </div>
  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
    {[
      ["A", "8 cái trở lên"],
      ["B", "4–7 cái"],
      ["C", "Dưới 4 cái / rất mỏi tay"],
      ["D", "Không làm được"],
    ].map(([k, label]) => (
      <button
        key={k}
        onClick={() =>
          setAnswers((p) => ({
            ...p,
            fitnessCheck: { ...p.fitnessCheck, push: k as any },
          }))
        }
        style={rowStyle(answers.fitnessCheck.push === (k as any))}
      >
        {k}. {label}
      </button>
    ))}
  </div>

  {/* 4.3 Balance */}
  <div style={{ marginTop: 14, fontWeight: 700 }}>4.3) Đứng 1 chân 10 giây (mỗi bên)</div>
  <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>
    Chỉ cần gần đúng. Nếu phân vân, chọn phương án thận trọng hơn.
  </div>
  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
    {[
      ["A", "Ổn định, giữ được dễ dàng"],
      ["B", "Hơi rung, phải tập trung"],
      ["C", "Rất khó giữ thăng bằng"],
      ["D", "Không giữ được"],
    ].map(([k, label]) => (
      <button
        key={k}
        onClick={() =>
          setAnswers((p) => ({
            ...p,
            fitnessCheck: { ...p.fitnessCheck, balance: k as any },
          }))
        }
        style={rowStyle(answers.fitnessCheck.balance === (k as any))}
      >
        {k}. {label}
      </button>
    ))}
  </div>
</section>

        <button onClick={submit} style={primaryBtn}>
          Xem đề xuất của chúng tôi
        </button>

        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 12 }}>
          Nội dung mang tính tham khảo, không thay thế tư vấn y tế.
        </div>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: 14,
  marginTop: 14,
};

const titleStyle: React.CSSProperties = {
  fontWeight: 700,
};

function pillStyle(active: boolean): React.CSSProperties {
  return {
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: "10px 10px",
    background: active ? "rgba(255,255,255,0.12)" : "transparent",
    cursor: "pointer",
  };
}

function rowStyle(active: boolean): React.CSSProperties {
  return {
    textAlign: "left",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 14,
    padding: "12px 12px",
    background: active ? "rgba(255,255,255,0.12)" : "transparent",
    cursor: "pointer",
  };
}

const primaryBtn: React.CSSProperties = {
  width: "100%",
  marginTop: 14,
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: "12px 14px",
  cursor: "pointer",
};

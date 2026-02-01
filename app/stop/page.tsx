"use client";

import { useRouter } from "next/navigation";
import { loadState, resetAll } from "@/lib/storage";

export default function StopPage() {
  const router = useRouter();
  const state = typeof window !== "undefined" ? loadState() : null;
  const reason = state?.onboarding?.decision?.resultType === "stop" ? state.onboarding.decision.reason : null;

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-xl">
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          Begin Right · Stop
        </div>
        <h1 className="mt-2 text-3xl font-semibold">Chúng tôi cần dừng lại ở đây</h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Begin Right chưa được thiết kế để hỗ trợ tình trạng bạn chọn. Để đảm bảo an toàn, chúng tôi không thể đề xuất lộ trình tập luyện.
        </p>

        {reason ? (
          <div className="mt-4 rounded-xl p-4" style={{ background: "var(--teal-soft)", border: "1px solid var(--border)" }}>
            <div className="text-sm font-semibold">Lý do</div>
            <p className="mt-1" style={{ color: "var(--muted)" }}>
              {reason}
            </p>
          </div>
        ) : null}

        <section className="mt-6 br-card p-5">
          <div className="text-lg font-semibold">Bạn có thể làm gì tiếp theo?</div>
          <ul className="mt-3 list-disc pl-5" style={{ color: "var(--muted)" }}>
            <li>Tham khảo ý kiến bác sĩ hoặc chuyên gia phục hồi chức năng.</li>
            <li>Hỏi rõ: “Tôi có thể vận động bodyweight mức nhẹ không?”</li>
            <li>Nếu có đau nhói/lan/tê, hãy ưu tiên kiểm tra y tế.</li>
          </ul>
        </section>

        <div className="mt-5 grid gap-2">
          <button
            className="br-focus w-full rounded-xl px-4 py-3"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
            onClick={() => router.push("/")}
          >
            Về trang chủ
          </button>

          <button
            className="br-focus w-full rounded-xl px-4 py-3 font-semibold"
            style={{ background: "var(--teal)", color: "#041014" }}
            onClick={() => {
              resetAll();
              router.replace("/onboarding");
            }}
          >
            Làm lại onboarding
          </button>
        </div>

        <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
          Nội dung mang tính tham khảo, không thay thế tư vấn y tế.
        </p>
      </div>
    </main>
  );
}

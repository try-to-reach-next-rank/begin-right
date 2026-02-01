"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loadState, resetAll } from "@/lib/storage";
import type { FitnessGrade } from "@/lib/storage";

function gradeLabel(g: FitnessGrade): string {
  if (g === "A") return "A (tốt)";
  if (g === "B") return "B (ổn)";
  if (g === "C") return "C (cần nhẹ hơn)";
  return "D (chưa làm được)";
}

export default function ResultsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<ReturnType<typeof loadState> | null>(null);

  useEffect(() => {
    const s = loadState();
    setState(s);
    setReady(true);
  }, []);

  const onboarding = state?.onboarding;
  const decision = onboarding?.decision;
  const answers = onboarding?.answers;

  const title = useMemo(() => {
    if (!decision) return "Chưa có kết quả";
    if (decision.resultType === "training") {
      return decision.level === "beginner_plus" ? "Bạn phù hợp nhịp: Beginner+" : "Bạn phù hợp nhịp: Beginner";
    }
    return decision.resultType === "safety" ? "Ưu tiên an toàn trước" : "Không đủ dữ kiện an toàn";
  }, [decision]);

  if (!ready) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-xl br-card p-6">Đang tải…</div>
      </main>
    );
  }

  if (!decision || !answers) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-xl br-card p-6">
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            Begin Right
          </div>
          <h1 className="mt-2 text-2xl font-semibold">Bạn chưa làm onboarding</h1>
          <p className="mt-2" style={{ color: "var(--muted)" }}>
            Hãy trả lời vài câu để Begin Right gợi ý nhịp tập phù hợp.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              className="br-focus rounded-xl px-4 py-2 font-semibold"
              style={{ background: "var(--teal)", color: "#041014" }}
              href="/onboarding"
            >
              Bắt đầu onboarding
            </Link>
            <Link
              className="br-focus rounded-xl px-4 py-2"
              style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
              href="/"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-xl">
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          Begin Right · Kết quả
        </div>

        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Chặng hành trình dài bắt đầu bằng những bước đầu tiên.
        </p>

        <section className="mt-6 br-card p-5">
          <div className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
            Tóm tắt
          </div>
          <div className="mt-3 grid gap-3">
            <div className="br-card-strong p-4">
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Thời lượng buổi tập
              </div>
              <div className="mt-1 text-lg font-semibold">{answers.sessionLength} phút</div>
            </div>

            <div className="br-card-strong p-4">
              <div className="text-sm" style={{ color: "var(--muted)" }}>
                Fitness check
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div style={{ color: "var(--muted)" }}>Squat</div>
                  <div className="font-semibold">{gradeLabel(answers.fitnessCheck.squat)}</div>
                </div>
                <div>
                  <div style={{ color: "var(--muted)" }}>Push</div>
                  <div className="font-semibold">{gradeLabel(answers.fitnessCheck.push)}</div>
                </div>
                <div>
                  <div style={{ color: "var(--muted)" }}>Balance</div>
                  <div className="font-semibold">{gradeLabel(answers.fitnessCheck.balance)}</div>
                </div>
              </div>
            </div>
          </div>

          {"reason" in decision ? (
            <div className="mt-4 rounded-xl p-4" style={{ background: "var(--teal-soft)", border: "1px solid var(--border)" }}>
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                Vì sao?
              </div>
              <p className="mt-1" style={{ color: "var(--muted)" }}>
                {decision.reason}
              </p>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {decision.resultType === "training" ? (
              <button
                className="br-focus rounded-xl px-4 py-2 font-semibold"
                style={{ background: "var(--teal)", color: "#041014" }}
                onClick={() => router.push("/day/1")}
              >
                Bắt đầu ngày 1
              </button>
            ) : (
              <button
                className="br-focus rounded-xl px-4 py-2 font-semibold"
                style={{ background: "var(--teal)", color: "#041014" }}
                onClick={() => router.push("/safety")}
              >
                Xem hướng dẫn an toàn
              </button>
            )}

            <Link
              className="br-focus rounded-xl px-4 py-2"
              style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
              href="/sources"
            >
              Nguồn tham khảo
            </Link>

            <button
              className="br-focus rounded-xl px-4 py-2"
              style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
              onClick={() => {
                resetAll();
                router.replace("/onboarding");
              }}
            >
              Làm lại
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

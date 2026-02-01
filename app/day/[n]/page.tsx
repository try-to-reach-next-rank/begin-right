"use client";

import CoachTimerOverlay, { type CoachTimerPlan } from "@/components/CoachTimerOverlay";
import ExerciseAnimation from "@/components/ExerciseAnimation";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { loadState, markDayComplete } from "@/lib/storage";
import { PLAN_14_DAYS, adjustForSessionLength, applyFitnessCheckPreset, applyHealthPreset } from "@/lib/plan14";
import { mediaForExerciseTitle } from "@/lib/exerciseMedia";

export default function DayPage() {
  const router = useRouter();
  const params = useParams<{ n: string }>();

  const day = Number(params.n);
  const [ready, setReady] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerPlan, setTimerPlan] = useState<CoachTimerPlan | null>(null);

  useEffect(() => setReady(true), []);

  const state = useMemo(() => (ready ? loadState() : null), [ready]);

  const resolved = useMemo(() => {
    if (!state) return null;

    const decision = state.onboarding?.decision;
    const answers = state.onboarding?.answers;

    if (!decision || !answers) return null;

    const base = PLAN_14_DAYS.find((d) => d.day === day);
    if (!base) return null;

    if (decision.resultType !== "training") return null;

    // health preset
    let plan = applyHealthPreset(base, decision.healthPreset);

    // fitness check preset (ưu tiên biến thể dễ hơn khi cần)
    plan = applyFitnessCheckPreset(plan, answers);

    // fitnessCheck preset (C/D -> biến thể dễ hơn)
    plan = applyFitnessCheckPreset(plan, answers);

    // session length (chỉ áp cho ngày work)
    if (plan.type === "work") {
      plan = {
        ...plan,
        exercises: plan.exercises.map((ex) => adjustForSessionLength(ex, answers.sessionLength)),
      };
    }

    return plan;
  }, [state, day]);

  useEffect(() => {
    if (!ready) return;

    if (!Number.isFinite(day) || day < 1 || day > 14) {
      router.replace("/");
      return;
    }

    const s = loadState();
    const decision = s.onboarding?.decision;

    if (!decision) {
      router.replace("/onboarding");
      return;
    }
    if (decision.resultType === "stop") {
      router.replace("/stop");
      return;
    }
    if (decision.resultType === "safety") {
      router.replace("/safety");
      return;
    }
  }, [day, ready, router]);

  if (!ready || !state) {
    return (
      <main style={{ minHeight: "100vh", padding: 16 }}>
        <div style={{ maxWidth: 420, margin: "0 auto", opacity: 0.7 }}>Đang tải…</div>
      </main>
    );
  }

  if (!resolved) {
    return (
      <main style={{ minHeight: "100vh", padding: 16 }}>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div style={{ opacity: 0.7 }}>Không tìm thấy kế hoạch cho ngày này.</div>
          <button onClick={() => router.push("/")} style={btnPrimary}>Về Home</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-xl">
        <div className="flex items-center justify-between gap-2">
          <button onClick={() => router.push("/")} className="br-focus rounded-xl px-3 py-2 text-sm" style={{ border: "1px solid var(--border)" }}>
            Home
          </button>
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            Ngày {day}/14
          </div>
          <button onClick={() => router.push("/results")} className="br-focus rounded-xl px-3 py-2 text-sm" style={{ border: "1px solid var(--border)" }}>
            Kết quả
          </button>
        </div>

        <h1 className="mt-4 text-3xl font-semibold">{resolved.title}</h1>

        <section className="mt-4 br-card p-5">
          <div className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
            Vì sao hôm nay tập như vậy?
          </div>
          <p className="mt-2" style={{ color: "var(--muted)" }}>
            {resolved.why}
          </p>
        </section>

        {resolved.type === "recovery" ? (
            <section className="mt-4 br-card p-5">
            <div className="text-lg font-semibold">Hôm nay là ngày hồi phục</div>
            <ul className="mt-3 list-disc pl-5" style={{ color: "var(--muted)" }}>
              {resolved.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <button
              onClick={() => {
                markDayComplete(day);
                router.push(`/day/${Math.min(day + 1, 14)}`);
              }}
              className="br-focus mt-4 w-full rounded-xl px-4 py-3 font-semibold"
              style={{ background: "var(--teal)", color: "#041014" }}
            >
              Hoàn thành ngày hôm nay
            </button>
          </section>
        ) : (
          <>
            <section className="mt-4 grid gap-4">
              {resolved.exercises.map((ex, idx) => (
                <article
                  key={idx}
                  className="br-card p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{ex.title}</div>
                      <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                        {ex.sets} hiệp · {ex.reps} · nghỉ {ex.rest}
                      </div>
                    </div>
                    <div className="shrink-0">
                      <ExerciseAnimation {...mediaForExerciseTitle(ex.title)} size="sm" />
                    </div>
                  </div>

                  <details className="mt-4" style={details}>
                    <summary className="cursor-pointer" style={{ color: "var(--foreground)" }}>Cách thực hiện</summary>
                    <div className="mt-3 grid gap-3" style={{ color: "var(--muted)" }}>
                      <Block title="Bắt đầu" items={ex.how.start} />
                      <Block title="Chuyển động" items={ex.how.move} />
                      <Block title="Nhịp thở" items={ex.how.breathe} />
                      <Block title="An toàn" items={ex.how.safety} />
                    </div>
                  </details>

                  <button
                    onClick={() => {
                      const r = parseInt(ex.rest, 10) || 60;
                      const repsText = ex.reps.toLowerCase();
                      const isTime = repsText.includes("s");
                      const target = parseInt(repsText, 10) || (isTime ? 20 : 8);

                      setTimerPlan({
                        title: ex.title,
                        sets: ex.sets,
                        mode: isTime ? "time" : "reps",
                        workTarget: target,
                        restSeconds: r,
                      });
                      setTimerOpen(true);
                    }}
                    className="br-focus mt-4 w-full rounded-xl px-4 py-3 font-semibold"
                    style={{ border: "1px solid var(--border)", background: "var(--card-strong)" }}
                  >
                    Bắt đầu bài này
                  </button>

                </article>
              ))}
            </section>

            <button
              onClick={() => {
                markDayComplete(day);
                router.push(`/day/${Math.min(day + 1, 14)}`);
              }}
              className="br-focus mt-5 w-full rounded-xl px-4 py-3 font-semibold"
              style={{ background: "var(--teal)", color: "#041014" }}
            >
              Hoàn thành ngày hôm nay
            </button>
          </>
        )}

        <div className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
          Nếu đau nhói/choáng/tê, hãy dừng và ưu tiên an toàn.
        </div>
      </div>

      <CoachTimerOverlay
        open={timerOpen}
        plan={timerPlan}
        onClose={() => {
          setTimerOpen(false);
          setTimerPlan(null);
        }}
      />
    </main>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <ul style={{ marginTop: 6, paddingLeft: 18 }}>
        {items && Array.isArray(items) &&
          items.map((item, i) => (
            <li key={i}>{item}</li>
          ))
        }
      </ul>
    </div>
  );
}

const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: 14,
  marginTop: 12,
};

const details: React.CSSProperties = {
  marginTop: 10,
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: 10,
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  marginTop: 14,
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 16,
  padding: "12px 14px",
  cursor: "pointer",
};

const btnSmall: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 14,
  padding: "8px 10px",
  cursor: "pointer",
  fontSize: 13,
};
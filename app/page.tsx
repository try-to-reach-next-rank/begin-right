"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { loadState, resetAll } from "@/lib/storage";

type Status = "no_onboarding" | "training" | "safety" | "stop";

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const state = useMemo(() => (ready ? loadState() : null), [ready]);

  const status: Status = useMemo(() => {
    const r = state?.onboarding?.decision?.resultType;
    if (!r) return "no_onboarding";
    if (r === "stop") return "stop";
    if (r === "safety") return "safety";
    return "training";
  }, [state]);

  const currentDay = state?.progress.dayIndex ?? 1;
  const completed = state?.progress.completedDays ?? [];

  const primaryHref =
    status === "no_onboarding"
      ? "/onboarding"
      : status === "stop"
        ? "/stop"
        : status === "safety"
          ? "/safety"
          : `/day/${currentDay}`;

  const primaryLabel =
    status === "no_onboarding"
      ? "Bắt đầu"
      : status === "stop"
        ? "Xem thông báo"
        : status === "safety"
          ? "Xem hướng dẫn an toàn"
          : `Tiếp tục ngày ${currentDay}`;

  if (!ready || !state) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-xl br-card p-6" style={{ color: "var(--muted)" }}>
          Đang tải…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-xl">
        <header className="br-card p-6">
          <div className="text-xs tracking-widest" style={{ color: "var(--muted)" }}>
            BEGIN RIGHT
          </div>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            Chặng hành trình dài
            <br />
            bắt đầu bằng những bước đầu tiên.
          </h1>
          <p className="mt-3" style={{ color: "var(--muted)" }}>
            Lộ trình 14 ngày tối giản: tập nhẹ, kiểm soát, ưu tiên an toàn — phù hợp người mới bắt đầu.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={primaryHref}
              className="br-focus rounded-xl px-4 py-2 font-semibold"
              style={{ background: "var(--teal)", color: "#041014" }}
            >
              {primaryLabel}
            </Link>

            <Link
              href="/sources"
              className="br-focus rounded-xl px-4 py-2"
              style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              Nguồn tham khảo
            </Link>
          </div>
        </header>

        <section className="mt-6 br-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                Trạng thái
              </div>
              <div className="mt-1 text-lg font-semibold">
                {status === "no_onboarding"
                  ? "Chưa thiết lập"
                  : status === "training"
                    ? "Đang theo lộ trình 14 ngày"
                    : status === "safety"
                      ? "Chế độ an toàn"
                      : "Dừng"}
              </div>
            </div>
            {status === "training" ? (
              <div className="text-right">
                <div className="text-sm" style={{ color: "var(--muted)" }}>
                  Tiến trình
                </div>
                <div className="text-lg font-semibold">Ngày {currentDay}/14</div>
              </div>
            ) : null}
          </div>

          {status === "training" ? (
            <div className="mt-4 grid grid-cols-7 gap-2">
              {Array.from({ length: 14 }).map((_, i) => {
                const d = i + 1;
                const done = completed.includes(d);
                const today = d === currentDay;
                const disabled = d > currentDay;
                return (
                  <button
                    key={d}
                    className="br-focus rounded-xl py-2 text-sm"
                    style={{
                      border: "1px solid var(--border)",
                      background: today ? "var(--teal-soft)" : "transparent",
                      opacity: disabled ? 0.45 : 1,
                    }}
                    onClick={() => router.push(`/day/${d}`)}
                    aria-label={`Ngày ${d}`}
                    disabled={disabled}
                  >
                    <div className="font-semibold">{d}</div>
                    <div className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {done ? "xong" : today ? "hôm nay" : "—"}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-3" style={{ color: "var(--muted)" }}>
              {status === "no_onboarding"
                ? "Trả lời vài câu ngắn để Begin Right chọn nhịp phù hợp cho bạn."
                : "Bạn có thể làm lại onboarding bất cứ lúc nào để cập nhật nhịp tập."}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/onboarding"
              className="br-focus rounded-xl px-4 py-2"
              style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
              {status === "no_onboarding" ? "Onboarding" : "Chỉnh thiết lập"}
            </Link>

            <button
              className="br-focus rounded-xl px-4 py-2"
              style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
              onClick={() => {
                resetAll();
                router.replace("/onboarding");
              }}
            >
              Làm lại từ đầu
            </button>
          </div>
        </section>

        <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
          Nội dung mang tính tham khảo, không thay thế tư vấn y tế.
        </p>
      </div>
    </main>
  );
}

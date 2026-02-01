"use client";

import { useRouter } from "next/navigation";
import { resetAll } from "@/lib/storage";

export default function SafetyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-xl">
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          Begin Right · Safety
        </div>
        <h1 className="mt-2 text-3xl font-semibold">Ưu tiên an toàn trước</h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Dựa trên câu trả lời của bạn, Begin Right khuyên bạn đi nhịp rất nhẹ và tập nền tảng trước khi vào lộ trình 14 ngày.
        </p>

        <section className="mt-6 br-card p-5">
          <div className="text-lg font-semibold">Nguyên tắc an toàn</div>
          <ul className="mt-3 list-disc pl-5" style={{ color: "var(--muted)" }}>
            <li>Dừng lại nếu đau nhói, đau lan, tê hoặc chóng mặt.</li>
            <li>Ưu tiên tập chậm, kiểm soát, không “cố thêm rep”.</li>
            <li>Nếu phân vân, chọn phiên bản nhẹ hơn.</li>
          </ul>
        </section>

        <section className="mt-4 br-card p-5">
          <div className="text-lg font-semibold">Gợi ý bắt đầu hôm nay (5–10 phút)</div>
          <ul className="mt-3 list-disc pl-5" style={{ color: "var(--muted)" }}>
            <li>Đi bộ nhẹ hoặc bước tại chỗ 5 phút (nếu thấy thoải mái).</li>
            <li>Thở chậm 2–3 phút (hít vào mũi, thở ra dài).</li>
            <li>Mobility rất nhẹ cho hông/cổ chân.</li>
          </ul>
          <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
            Nếu bạn muốn, bạn có thể làm lại onboarding khi thấy tự tin hơn.
          </p>
        </section>

        <div className="mt-5 grid gap-2">
          <button
            className="br-focus w-full rounded-xl px-4 py-3 font-semibold"
            style={{ background: "var(--teal)", color: "#041014" }}
            onClick={() => router.push("/onboarding")}
          >
            Làm lại onboarding
          </button>
          <button
            className="br-focus w-full rounded-xl px-4 py-3"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
            onClick={() => router.push("/")}
          >
            Về trang chủ
          </button>
          <button
            className="br-focus w-full rounded-xl px-4 py-3"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)", opacity: 0.9 }}
            onClick={() => {
              resetAll();
              router.replace("/onboarding");
            }}
          >
            Xoá thiết lập trên thiết bị
          </button>
        </div>

        <p className="mt-4 text-xs" style={{ color: "var(--muted)" }}>
          Nội dung mang tính tham khảo, không thay thế tư vấn y tế.
        </p>
      </div>
    </main>
  );
}

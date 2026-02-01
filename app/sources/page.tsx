import Link from "next/link";

export default function SourcesPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-xl">
        <div className="text-sm" style={{ color: "var(--muted)" }}>
          Begin Right · Sources
        </div>
        <h1 className="mt-2 text-3xl font-semibold">Nguồn tham khảo
        </h1>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Begin Right sử dụng các biến thể bài tập phổ thông, ưu tiên các nguồn hướng dẫn đại chúng, uy tín.
          Bạn có thể dùng trang này để giải thích với giảng viên về nguồn tham khảo.
        </p>

        <section className="mt-6 br-card p-5">
          <h2 className="text-lg font-semibold">Bài tập & biến thể</h2>
          <ul className="mt-3 list-disc pl-5" style={{ color: "var(--muted)" }}>
            <li>
              NHS — Strength and Flex (how-to videos): Squat, Sit-to-Stand, Press-up variants.
              {" "}
              <a className="underline" href="https://www.nhs.uk/live-well/exercise/strength-and-flex-exercise-plan-how-to-videos/" target="_blank" rel="noreferrer">
                nhs.uk
              </a>
            </li>
            <li>
              ACE Exercise Library — mô tả động tác chuẩn (Dead Bug, Bird Dog, Plank, Lunge...).
              {" "}
              <a className="underline" href="https://www.acefitness.org/resources/everyone/exercise-library/" target="_blank" rel="noreferrer">
                acefitness.org
              </a>
            </li>
            <li>
              Mayo Clinic — ví dụ hình minh hoạ Glute Bridge.
              {" "}
              <a className="underline" href="https://www.mayoclinic.org/healthy-lifestyle/fitness/multimedia/bridge-exercise/img-20006409" target="_blank" rel="noreferrer">
                mayoclinic.org
              </a>
            </li>
          </ul>

          <div className="mt-5 rounded-xl p-4" style={{ background: "var(--teal-soft)", border: "1px solid var(--border)" }}>
            <div className="text-sm font-semibold">Lưu ý về nội dung</div>
            <p className="mt-1" style={{ color: "var(--muted)" }}>
              Animation Các bài tập trong Begin Right dựa trên hướng dẫn phổ biến từ những nguồn uy tín như NHS, ACE và Mayo Clinic.
Nội dung mang tính tham khảo cho người khỏe mạnh nói chung.
Nếu bạn có vấn đề sức khỏe đặc biệt, hãy tham khảo ý kiến chuyên gia trước khi tập luyện.
            </p>
          </div>
        </section>

        <div className="mt-5 flex gap-2">
          <Link className="br-focus rounded-xl px-4 py-2" style={{ border: "1px solid var(--border)", color: "var(--foreground)" }} href="/">
            Về trang chủ
          </Link>
          <Link className="br-focus rounded-xl px-4 py-2 font-semibold" style={{ background: "var(--teal)", color: "#041014" }} href="/onboarding">
            Bắt đầu
          </Link>
        </div>
      </div>
    </main>
  );
}

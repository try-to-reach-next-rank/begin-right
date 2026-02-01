"use client";

import React, { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";

type Props = {
  src: string; // /lottie/*.json
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function ExerciseAnimation({ src, label, size = "md", className }: Props) {
  const [data, setData] = useState<any | null>(null);
  const [failed, setFailed] = useState(false);

  const dims = useMemo(() => {
    if (size === "sm") return { w: 64, h: 64 };
    if (size === "lg") return { w: 220, h: 220 };
    return { w: 120, h: 120 };
  }, [size]);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setData(null);
    fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error("fetch_failed");
        return r.json();
      })
      .then((j) => {
        if (!cancelled) setData(j);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Fallback: một block tối giản nếu JSON chưa có / lỗi tải
  if (failed || !data) {
    return (
      <div
        aria-label={label}
        className={`br-card flex items-center justify-center ${className ?? ""}`}
        style={{ width: dims.w, height: dims.h }}
      >
        <div
          className="h-8 w-8 rounded-full"
          style={{ background: "var(--teal-soft)", border: "1px solid var(--border)" }}
        />
      </div>
    );
  }

  return (
    <div
      aria-label={label}
      className={`br-card flex items-center justify-center overflow-hidden ${className ?? ""}`}
      style={{ width: dims.w, height: dims.h }}
    >
      <Lottie animationData={data} loop autoplay style={{ width: dims.w, height: dims.h }} />
    </div>
  );
}

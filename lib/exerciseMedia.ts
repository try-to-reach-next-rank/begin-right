export type ExerciseMedia = {
  src: string; // path từ /public
  label: string;
};

// Chuẩn hoá key theo title trong plan14.ts
export function exerciseKeyFromTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("sit-to-stand") || t.includes("squat")) return "squat";
  if (t.includes("push") || t.includes("chống đẩy")) return "push";
  if (t.includes("dead bug")) return "deadbug";
  if (t.includes("glute bridge") || t.includes("cầu mông")) return "bridge";
  if (t.includes("bird dog")) return "birddog";
  if (t.includes("plank")) return "plank";
  if (t.includes("lunge")) return "lunge";
  if (t.includes("row") || t.includes("kéo")) return "row";
  return "generic";
}

export function mediaForExerciseTitle(title: string): ExerciseMedia {
  const key = exerciseKeyFromTitle(title);
  return {
    src: `/lottie/${key}.json`,
    label: `Minh hoạ động tác: ${title}`,
  };
}
type TimeOfDay = {
  time: string;
  from: number;
  to: number;
}

export const timesOfDay: TimeOfDay[] = [
  { time: "morning", from: 5, to: 12 },
  { time: "afternoon", from: 12, to: 17 },
  { time: "evening", from: 17, to: 21 },
  { time: "night", from: 21, to: 5 },
];
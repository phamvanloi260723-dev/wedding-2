export type CountdownResult = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

export function calculateCountdown(targetDate: Date): CountdownResult {
  const now = Date.now();
  const target = new Date(targetDate).getTime();

  const diff = target - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / (60 * 60 * 24)),
    hours: Math.floor((totalSeconds / (60 * 60)) % 24),
    minutes: Math.floor((totalSeconds / 60) % 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}
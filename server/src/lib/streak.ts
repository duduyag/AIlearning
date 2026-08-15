function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Daily learning streak: consecutive calendar days (UTC) with at least one lesson completed. */
export function nextStreakState(lastActiveDate: Date | null, currentStreak: number, longestStreak: number, now: Date = new Date()) {
  const today = toDateOnly(now);

  if (!lastActiveDate) {
    return { currentStreak: 1, longestStreak: Math.max(longestStreak, 1), lastActiveDate: now };
  }

  const lastDay = toDateOnly(lastActiveDate);
  if (lastDay === today) {
    return { currentStreak, longestStreak, lastActiveDate: now };
  }

  const yesterday = toDateOnly(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  const newStreak = lastDay === yesterday ? currentStreak + 1 : 1;

  return { currentStreak: newStreak, longestStreak: Math.max(longestStreak, newStreak), lastActiveDate: now };
}

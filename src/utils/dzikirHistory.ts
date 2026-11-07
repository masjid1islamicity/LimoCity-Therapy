// Utility and persistence manager for 7-day Dzikir Progress tracking

export interface DzikirDayRecord {
  dateKey: string; // YYYY-MM-DD
  dayName: string; // e.g. "Senin", "Selasa"
  shortLabel: string; // e.g. "Sen (18/8)"
  dayOnly: string; // e.g. "Sen"
  dateFormatted: string; // e.g. "18 Agu"
  count: number; // Daily completion count
  target: number; // Daily target (e.g. 100)
  sessions: number; // Completed sessions / rounds
  isToday: boolean;
  completionRate: number; // percentage
}

const STORAGE_KEY_7DAY_HISTORY = "limocity_dzikir_7day_history";
const STORAGE_KEY_TOTAL_COUNT = "limocity_total_dzikir_count";

const INDONESIAN_DAYS = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const INDONESIAN_DAYS_SHORT = ["Ahd", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const INDONESIAN_MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Ags", "Sep", "Okt", "Nov", "Des"
];

// Baseline mock data for past 6 days if user is opening for the first time
const DEFAULT_BASELINE_COUNTS = [66, 99, 132, 75, 165, 132, 99]; // 7 days values

function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getPast7DaysDzikirHistory(): DzikirDayRecord[] {
  let storedHistory: Record<string, { count: number; sessions?: number }> = {};
  
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(STORAGE_KEY_7DAY_HISTORY);
    if (raw) {
      try {
        storedHistory = JSON.parse(raw);
      } catch (e) {
        storedHistory = {};
      }
    }
  }

  // Also check today's total count if synced from DailyDzikirSidebar
  let currentTodaySavedTotal = 0;
  if (typeof window !== "undefined") {
    const savedToday = localStorage.getItem(STORAGE_KEY_TOTAL_COUNT);
    if (savedToday) {
      currentTodaySavedTotal = parseInt(savedToday, 10) || 0;
    }
  }

  const result: DzikirDayRecord[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    const key = formatDateKey(date);
    const dayOfWeek = date.getDay();
    const dayName = INDONESIAN_DAYS[dayOfWeek];
    const shortDay = INDONESIAN_DAYS_SHORT[dayOfWeek];
    const monthStr = INDONESIAN_MONTHS_SHORT[date.getMonth()];
    const dateFormatted = `${date.getDate()} ${monthStr}`;
    const shortLabel = `${shortDay}, ${date.getDate()} ${monthStr}`;
    const isToday = i === 0;

    let count = 0;
    let sessions = 1;

    if (storedHistory[key] !== undefined) {
      count = storedHistory[key].count;
      sessions = storedHistory[key].sessions || Math.max(1, Math.floor(count / 33));
    } else {
      // Use baseline for past days or 0 / saved total for today
      if (isToday) {
        count = currentTodaySavedTotal > 0 ? currentTodaySavedTotal : 66; // default engaging count for today
        sessions = Math.max(1, Math.floor(count / 33));
      } else {
        const baseline = DEFAULT_BASELINE_COUNTS[6 - i] || 99;
        count = baseline;
        sessions = Math.max(1, Math.floor(baseline / 33));
      }
      // Save baseline so history stays stable
      storedHistory[key] = { count, sessions };
    }

    // If today and currentTodaySavedTotal is greater, update today's count
    if (isToday && currentTodaySavedTotal > count) {
      count = currentTodaySavedTotal;
      sessions = Math.max(1, Math.floor(count / 33));
      storedHistory[key] = { count, sessions };
    }

    const target = 100;
    const completionRate = Math.min(100, Math.round((count / target) * 100));

    result.push({
      dateKey: key,
      dayName,
      shortLabel,
      dayOnly: shortDay,
      dateFormatted,
      count,
      target,
      sessions,
      isToday,
      completionRate
    });
  }

  // Save back consolidated history
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_7DAY_HISTORY, JSON.stringify(storedHistory));
  }

  return result;
}

export function incrementTodayDzikirCount(amount: number = 1): DzikirDayRecord[] {
  const history = getPast7DaysDzikirHistory();
  const now = new Date();
  const todayKey = formatDateKey(now);

  const storedRaw = localStorage.getItem(STORAGE_KEY_7DAY_HISTORY);
  let storedHistory: Record<string, { count: number; sessions?: number }> = {};
  if (storedRaw) {
    try {
      storedHistory = JSON.parse(storedRaw);
    } catch (e) {}
  }

  const currentToday = storedHistory[todayKey] || { count: 0, sessions: 0 };
  const newCount = (currentToday.count || 0) + amount;
  const newSessions = (currentToday.sessions || 0) + (amount >= 33 ? 1 : 0);

  storedHistory[todayKey] = {
    count: newCount,
    sessions: newSessions
  };

  localStorage.setItem(STORAGE_KEY_7DAY_HISTORY, JSON.stringify(storedHistory));
  localStorage.setItem(STORAGE_KEY_TOTAL_COUNT, newCount.toString());

  // Notify listeners
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("limocity_dzikir_updated", {
      detail: { dateKey: todayKey, count: newCount, amount }
    }));
  }

  return getPast7DaysDzikirHistory();
}

export function resetTodayDzikirCount(): DzikirDayRecord[] {
  const now = new Date();
  const todayKey = formatDateKey(now);

  const storedRaw = localStorage.getItem(STORAGE_KEY_7DAY_HISTORY);
  let storedHistory: Record<string, { count: number; sessions?: number }> = {};
  if (storedRaw) {
    try {
      storedHistory = JSON.parse(storedRaw);
    } catch (e) {}
  }

  storedHistory[todayKey] = { count: 0, sessions: 0 };
  localStorage.setItem(STORAGE_KEY_7DAY_HISTORY, JSON.stringify(storedHistory));
  localStorage.setItem(STORAGE_KEY_TOTAL_COUNT, "0");

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("limocity_dzikir_updated", {
      detail: { dateKey: todayKey, count: 0 }
    }));
  }

  return getPast7DaysDzikirHistory();
}

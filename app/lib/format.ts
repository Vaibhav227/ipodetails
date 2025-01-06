import { DateTime } from "luxon";

export function formatDate(date: string | null | undefined): string {
  if (!date) return "N/A";
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_MED);
} 
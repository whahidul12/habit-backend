import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

export const toDateKey = (date) => formatRelative(date, "yyyy-mm-dd");

export const todayKey = () => toDateKey(new Date());

export const last90Days = () => {
    const end = new Date();
    const start = subDays(end, 89);
    return eachDayOfInterval({ start, end }).map(toDateKey);
}

export const currentWeekKeys = () => {
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end }).map(toDateKey);
}

export const lastNDays = (n) => {
    const end = new Date();
    const start = subDays(end, n - 1);
    return eachDayOfInterval({ start, end }).map(toDateKey);
};
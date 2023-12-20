export const WeekDays = [0, 1, 2, 3, 4, 5, 6] as const;
export type WEEK_DAYS = (typeof WeekDays)[number];

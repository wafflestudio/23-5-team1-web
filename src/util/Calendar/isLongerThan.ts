export const isLongerThan = (start: Date, end: Date, day: number): boolean => {
	const diffInMs = end.getTime() - start.getTime();
	const MS_PER_DAY = 1000 * 60 * 60 * 24;
	const diffInDays = diffInMs / MS_PER_DAY;
	return diffInDays > day;
};

export const STEP_MIN = 5;

export function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(n, max));
}

export function snapToStep(min: number, step = STEP_MIN) {
	return Math.round(min / step) * step;
}

export function hhmmToMinutes(hh: number, mm: number) {
	return hh * 60 + mm;
}

export function minutesToHHMM(min: number) {
	const hh = Math.floor(min / 60);
	const mm = min % 60;
	return { hh, mm };
}

export function pad2(n: number) {
	// 두 자리 문자열로 변환
	return String(n).padStart(2, "0");
}

export function formatAmPmFromMinutes(min: number) {
	const { hh, mm } = minutesToHHMM(min);
	const am = hh < 12;
	const hour12 = hh % 12 === 0 ? 12 : hh % 12;
	return `${hour12}"${pad2(mm)} ${am ? "AM" : "PM"}`;
}

export function buildTimeOptions(step = STEP_MIN) {
	const out: { value: number; label: string }[] = [];
	for (let m = 0; m < 24 * 60; m += step) {
		out.push({ value: m, label: formatAmPmFromMinutes(m) });
	}
	return out;
}

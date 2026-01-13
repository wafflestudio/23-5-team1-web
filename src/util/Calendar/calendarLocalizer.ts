import { format } from "date-fns/format";
import { getDay } from "date-fns/getDay";
import { ko } from "date-fns/locale";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { dateFnsLocalizer } from "react-big-calendar";

const locales = {
	ko: ko,
};

export const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

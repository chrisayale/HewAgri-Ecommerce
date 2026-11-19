import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import fr from 'dayjs/locale/fr';

export const frenchFormattedDate = (date: any) => {
	dayjs.extend(utc);
	dayjs.extend(localeData);
	dayjs.extend(localizedFormat);

	dayjs.locale(fr);
	const formattedDate = dayjs(date).format('ddd, DD MMM YYYY');
	return formattedDate;
};

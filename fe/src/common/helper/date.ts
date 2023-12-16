import dayjs from 'dayjs';

/**
 * 
 * @param date new Date().toISOString()
 * @param withHour 
 * @returns 
 */
export const formatDate = (dateString: string, withHour: boolean): string => {
    const splittedDate = dateString.split('T');

    const date = dayjs(splittedDate[0]).format('DD/MM/YYYY');

    const splittedHour = splittedDate[1].split(':');
    const hour = `at ${splittedHour[0]}:${splittedHour[1]}`;

    const ret = withHour ? `${date} ${hour}` : date;
    return ret;
}
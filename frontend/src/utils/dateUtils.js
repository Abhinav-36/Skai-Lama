import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDateTime = (date, timezone) => {
  if (!date) return '';
  return dayjs(date).tz(timezone).format('MMM D, YYYY [at] hh:mm A');
};

export const formatDate = (date, timezone) => {
  if (!date) return '';
  return dayjs(date).tz(timezone).format('MMM D, YYYY');
};

export const formatTime = (date, timezone) => {
  if (!date) return '';
  return dayjs(date).tz(timezone).format('hh:mm A');
};

export const formatDateShort = (date, timezone) => {
  if (!date) return '';
  return dayjs(date).tz(timezone).format('MM-DD-YYYY');
};

export const formatTimeShort = (date, timezone) => {
  if (!date) return '';
  return dayjs(date).tz(timezone).format('HH-mm');
};

export const convertToTimezone = (date, timezone) => {
  return dayjs(date).tz(timezone).toDate();
};

export const getDateTimeInputValue = (date, timezone) => {
  if (!date) return '';
  const dt = dayjs(date).tz(timezone);
  return {
    date: dt.format('YYYY-MM-DD'),
    time: dt.format('HH:mm')
  };
};

export const combineDateTime = (date, time, timezone) => {
  const dt = dayjs.tz(`${date} ${time}`, timezone);
  return dt.toDate();
};








import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getTodayDate = () => dayjs().format("YYYY-MM-DD");

export const formatDateTime = (date, tz) => {
  return dayjs(date).tz(tz).format("MMM D, YYYY h:mm A");
};

export const formatDate = (date, tz) => {
  return dayjs(date).tz(tz).format("MMM D, YYYY");
};

export const formatTime = (date, tz) => {
  return dayjs(date).tz(tz).format("h:mm A");
};

export const formatDetailedDateTime = (date, tz) => {
  return dayjs(date).tz(tz).format("MMM DD, YYYY [at] hh:mm A");
};

export const createTimezoneDate = (date, time, tz) => {
  return dayjs.tz(`${date} ${time}`, tz);
};

export const formatDateForInput = (date, tz) => {
  return dayjs(date).tz(tz).format("YYYY-MM-DD");
};

export const formatTimeForInput = (date, tz) => {
  return dayjs(date).tz(tz).format("HH:mm");
};

export const getNextDay = (date) => {
  return dayjs(date).add(1, "day").format("YYYY-MM-DD");
};

export const formatDateAsText = (dateString) => {
  if (!dateString) return "";
  return dayjs(dateString).format("MMMM D, YYYY");
};
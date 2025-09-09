import dayjs from 'dayjs';

export function formatDate(raw: string) {
  const clean = raw.replace(/\s(AM|PM)$/, '');
  return dayjs(clean, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm');
}

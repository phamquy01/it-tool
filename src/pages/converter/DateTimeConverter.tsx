import { useState, useMemo } from 'react';
import {
  formatISO,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  fromUnixTime,
  getTime,
  getUnixTime,
  isDate,
  isValid,
  parseISO,
  parseJSON,
} from 'date-fns';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

// Regex & Validators
const ISO8601_REGEX =
  /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
const ISO9075_REGEX =
  /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,6})?(([+-])([0-9]{2}):([0-5]{2})|Z)?$/;
const RFC3339_REGEX =
  /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,9})?(([+-])([01]\d|2[0-3]):([0-5]\d)|Z)$/;
const RFC7231_REGEX =
  /^[A-Za-z]{3},\s[0-9]{2}\s[A-Za-z]{3}\s[0-9]{4}\s[0-9]{2}:[0-9]{2}:[0-9]{2}\sGMT$/;
const EXCEL_FORMAT_REGEX = /^-?\d+(\.\d+)?$/;

const createRegexMatcher = (regex: RegExp) => (date?: string) =>
  !_.isNil(date) && regex.test(date);

const isISO8601DateTimeString = createRegexMatcher(ISO8601_REGEX);
const isISO9075DateString = createRegexMatcher(ISO9075_REGEX);
const isRFC3339DateString = createRegexMatcher(RFC3339_REGEX);
const isRFC7231DateString = createRegexMatcher(RFC7231_REGEX);
const isUnixTimestamp = createRegexMatcher(/^[0-9]{1,10}$/);
const isTimestamp = createRegexMatcher(/^[0-9]{1,13}$/);
const isMongoObjectId = createRegexMatcher(/^[0-9a-fA-F]{24}$/);
const isExcelFormat = createRegexMatcher(EXCEL_FORMAT_REGEX);
const isUTCDateString = (date?: string) => {
  if (!date) return false;
  try {
    return new Date(date).toUTCString() === date;
  } catch {
    return false;
  }
};

const dateToExcelFormat = (date: Date) =>
  String(date.getTime() / (1000 * 60 * 60 * 24) + 25569);
const excelFormatToDate = (excel: string | number) =>
  new Date((Number(excel) - 25569) * 86400 * 1000);

const DateTimeConverter = () => {
  const { t } = useTranslation();
  const [inputDate, setInputDate] = useState('');
  const [formatIndex, setFormatIndex] = useState(6);
  const now = new Date();

  const formats = [
    {
      name: t('date_time_converter.js_locale_date_string'),
      fromDate: (d: Date) => d.toString(),
      toDate: (s: string) => new Date(s),
      formatMatcher: () => false,
    },
    {
      name: t('date_time_converter.iso_8601'),
      fromDate: formatISO,
      toDate: parseISO,
      formatMatcher: isISO8601DateTimeString,
    },
    {
      name: t('date_time_converter.iso_9075'),
      fromDate: formatISO9075,
      toDate: parseISO,
      formatMatcher: isISO9075DateString,
    },
    {
      name: t('date_time_converter.rfc_3339'),
      fromDate: formatRFC3339,
      toDate: (s: string) => new Date(s),
      formatMatcher: isRFC3339DateString,
    },
    {
      name: t('date_time_converter.rfc_7231'),
      fromDate: formatRFC7231,
      toDate: (s: string) => new Date(s),
      formatMatcher: isRFC7231DateString,
    },
    {
      name: t('date_time_converter.unix_timestamp'),
      fromDate: (d: Date) => String(getUnixTime(d)),
      toDate: (s: string) => fromUnixTime(+s),
      formatMatcher: isUnixTimestamp,
    },
    {
      name: t('date_time_converter.timestamp'),
      fromDate: (d: Date) => String(getTime(d)),
      toDate: (s: string) => parseJSON(String(+s)),
      formatMatcher: isTimestamp,
    },
    {
      name: t('date_time_converter.utc_format'),
      fromDate: (d: Date) => d.toUTCString(),
      toDate: (s: string) => new Date(s),
      formatMatcher: isUTCDateString,
    },
    {
      name: t('date_time_converter.mongo_object_id'),
      fromDate: (d: Date) =>
        `${Math.floor(d.getTime() / 1000).toString(16)}0000000000000000`,
      toDate: (s: string) => new Date(parseInt(s.substring(0, 8), 16) * 1000),
      formatMatcher: isMongoObjectId,
    },
    {
      name: t('date_time_converter.excel_date_time'),
      fromDate: dateToExcelFormat,
      toDate: excelFormatToDate,
      formatMatcher: isExcelFormat,
    },
  ];

  const normalizedDate = useMemo(() => {
    if (!inputDate) return now;
    try {
      return formats[formatIndex].toDate(inputDate);
    } catch {
      return undefined;
    }
  }, [inputDate, formatIndex]);

  const onDateInputChanged = (value: string) => {
    setInputDate(value);
    const matchingIndex = formats.findIndex((f) => f.formatMatcher(value));
    if (matchingIndex !== -1) setFormatIndex(matchingIndex);
  };

  const formatDateUsingFormatter = (
    formatter: (d: Date) => string,
    date?: Date
  ) => {
    if (!date || !isDate(date) || !isValid(date)) return '';
    try {
      return formatter(date);
    } catch {
      return '';
    }
  };

  return (
    <div className="max-w-[600px] p-4 space-y-4 mx-auto bg-zinc-100 dark:bg-zinc-900">
      <div className="flex gap-2">
        <div className="input-wrapper flex items-center border-[#e0e0e69e] bg-white dark:bg-zinc-800 rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out w-full">
          <input
            id="input-string-compare"
            type="text"
            placeholder={t('date_time_converter.enter_date_time_placeholder')}
            value={inputDate}
            onChange={(e) => onDateInputChanged(e.target.value)}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="text-sm py-2 outline-none w-full text-black dark:text-white bg-transparent"
          />
        </div>
        <select
          value={formatIndex}
          onChange={(e) => setFormatIndex(Number(e.target.value))}
          className="px-3.5 py-1.5 bg-white dark:bg-zinc-800 text-black dark:text-white border border-gray-300 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-green-500 text-sm font-medium"
        >
          {formats.map((f, i) => (
            <option key={f.name} value={i}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-zinc-300 dark:border-zinc-700 pt-4 space-y-2">
        {formats.map(({ name, fromDate }) => (
          <div className="mb-2 flex items-baseline" key={name}>
            <label className="mb-[5px] text-sm pr-3 text-right flex-[0_0_200px] text-zinc-800 dark:text-zinc-200">
              {name}:
            </label>
            <div className="flex-[1_1_0] min-w-0">
              <div className="input-wrapper flex items-center border-[#e0e0e69e] bg-white dark:bg-zinc-800 rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
                <input
                  id="input-string-compare"
                  type="text"
                  value={formatDateUsingFormatter(fromDate, normalizedDate)}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="text-sm py-2 outline-none w-full text-black dark:text-white bg-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateTimeConverter;

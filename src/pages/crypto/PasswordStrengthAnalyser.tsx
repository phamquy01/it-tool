import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import { Eye, EyeClosed, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PasswordStrengthAnalyser: React.FC = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const prettifyExponentialNotation = (exponentialNotation: number) => {
    const [base, exponent] = exponentialNotation.toString().split('e');
    const baseAsNumber = Number.parseFloat(base);
    const prettyBase =
      baseAsNumber % 1 === 0
        ? baseAsNumber.toLocaleString()
        : baseAsNumber.toFixed(2);
    return exponent ? `${prettyBase}e${exponent}` : prettyBase;
  };

  const getHumanFriendlyDuration = ({ seconds }: { seconds: number }) => {
    if (seconds <= 0.001) return t('password_strength.instant');
    if (seconds <= 1) return t('password_strength.less_than_a_second');

    const timeUnits = [
      {
        unit: 'millennium',
        secondsInUnit: 31536000000,
        format: prettifyExponentialNotation,
        plural: t('password_strength.millennia'),
      },
      {
        unit: 'century',
        secondsInUnit: 3153600000,
        plural: t('password_strength.centuries'),
      },
      {
        unit: 'decade',
        secondsInUnit: 315360000,
        plural: t('password_strength.decades'),
      },
      {
        unit: 'year',
        secondsInUnit: 31536000,
        plural: t('password_strength.years'),
      },
      {
        unit: 'month',
        secondsInUnit: 2592000,
        plural: t('password_strength.months'),
      },
      {
        unit: 'week',
        secondsInUnit: 604800,
        plural: t('password_strength.weeks'),
      },
      {
        unit: 'day',
        secondsInUnit: 86400,
        plural: t('password_strength.days'),
      },
      {
        unit: 'hour',
        secondsInUnit: 3600,
        plural: t('password_strength.hours'),
      },
      {
        unit: 'minute',
        secondsInUnit: 60,
        plural: t('password_strength.minutes'),
      },
      {
        unit: 'second',
        secondsInUnit: 1,
        plural: t('password_strength.seconds'),
      },
    ];

    return _.chain(timeUnits)
      .map(({ unit, secondsInUnit, plural, format = _.identity }) => {
        const quantity = Math.floor(seconds / secondsInUnit);
        seconds %= secondsInUnit;
        if (quantity <= 0) return undefined;
        return `${format(quantity)} ${quantity > 1 ? plural : unit}`;
      })
      .compact()
      .take(2)
      .join(', ')
      .value();
  };

  const getCharsetLength = (password: string) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasSpecialChars = /\W|_/.test(password);

    let charsetLength = 0;
    if (hasLowercase) charsetLength += 26;
    if (hasUppercase) charsetLength += 26;
    if (hasDigits) charsetLength += 10;
    if (hasSpecialChars) charsetLength += 32;

    return charsetLength;
  };

  const getPasswordCrackTimeEstimation = (
    password: string,
    guessesPerSecond = 1e9
  ) => {
    const charsetLength = getCharsetLength(password);
    const passwordLength = password.length;
    const entropy =
      password === '' ? 0 : Math.log2(charsetLength) * passwordLength;
    const secondsToCrack = 2 ** entropy / guessesPerSecond;
    const crackDurationFormatted = getHumanFriendlyDuration({
      seconds: secondsToCrack,
    });
    const score = Math.min(entropy / 128, 1);

    return {
      entropy,
      charsetLength,
      passwordLength,
      crackDurationFormatted,
      secondsToCrack,
      score,
    };
  };

  // -------------------- Computed values --------------------
  const crackTimeEstimation = useMemo(
    () => getPasswordCrackTimeEstimation(password),
    [password]
  );
  const details = useMemo(
    () => [
      {
        label: t('password_strength.password_length'),
        value: crackTimeEstimation.passwordLength,
      },
      {
        label: t('password_strength.entropy'),
        value: Math.round(crackTimeEstimation.entropy * 100) / 100,
      },
      {
        label: t('password_strength.character_set_size'),
        value: crackTimeEstimation.charsetLength,
      },
      {
        label: t('password_strength.score'),
        value: `${Math.round(crackTimeEstimation.score * 100)} / 100`,
      },
    ],
    [crackTimeEstimation]
  );

  return (
    <div className="flex flex-col gap-4 max-w-[600px] mx-auto">
      <div className="input-wrapper flex items-center gap-2 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded w-full relative">
        <input
          placeholder={t('password_strength.enter_your_password')}
          type={showPassword ? 'text' : 'password'}
          className="w-full word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal pr-[70px] bg-transparent text-zinc-900 dark:text-zinc-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password && (
          <button
            type="button"
            className="absolute right-10 top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center justify-center transition-all duration-200 cursor-pointer"
            onClick={() => setPassword('')}
            tabIndex={-1}
          >
            <X size={14} />
          </button>
        )}
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center justify-center transition-all duration-200 cursor-pointer"
          onClick={() => setShowPassword((v) => !v)}
          tabIndex={-1}
        >
          {showPassword ? <Eye size={14} /> : <EyeClosed size={14} />}
        </button>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800 shadow rounded p-4 text-center">
        <div className="opacity-60 mb-2 text-[14px]">
          {t('password_strength.crack_time_estimation')}
        </div>
        <div
          className="text-2xl font-bold text-[18px] text-zinc-900 dark:text-zinc-100"
          data-test-id="crack-duration"
        >
          {crackTimeEstimation.crackDurationFormatted}
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-800 shadow rounded p-4">
        {details.map(({ label, value }) => (
          <div key={label} className="flex gap-3 mb-2">
            <div className="flex-1 text-right opacity-60 text-[14px] text-zinc-900 dark:text-zinc-400">
              {label}
            </div>
            <div className="flex-1 text-left text-[14px] text-zinc-900 dark:text-zinc-100">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="opacity-70 text-[14px] text-zinc-900 dark:text-zinc-400">
        <span className="font-bold">{t('password_strength.note')}: </span>
        {t('password_strength.crack_time_estimation_note')}
      </div>
    </div>
  );
};

export default PasswordStrengthAnalyser;

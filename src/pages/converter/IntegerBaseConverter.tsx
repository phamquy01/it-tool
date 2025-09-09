import { Copy } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useToast } from '../../store/ToastContext';
import { useTranslation } from 'react-i18next';

function convertBase({
  value,
  fromBase,
  toBase,
}: {
  value: string;
  fromBase: number;
  toBase: number;
}) {
  const range =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split(
      ''
    );
  const fromRange = range.slice(0, fromBase);
  const toRange = range.slice(0, toBase);

  let decValue = value
    .split('')
    .reverse()
    .reduce((carry: bigint, digit: string, index: number) => {
      if (!fromRange.includes(digit)) {
        throw new Error(`Invalid digit "${digit}" for base ${fromBase}.`);
      }
      return (carry +=
        BigInt(fromRange.indexOf(digit)) * BigInt(fromBase) ** BigInt(index));
    }, 0n);

  let newValue = '';
  while (decValue > 0) {
    newValue = toRange[Number(decValue % BigInt(toBase))] + newValue;
    decValue = (decValue - (decValue % BigInt(toBase))) / BigInt(toBase);
  }
  return newValue || '0';
}

const InputCopyable: React.FC<{
  label?: string;
  value: string;
  placeholder?: string;
}> = ({ label, value, placeholder }) => {
  const { showToast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    showToast('Đã copy!');
  };
  return (
    <div className={`flex items-center ${label ? 'mt-2' : ''}`}>
      {label && (
        <label className="mb-[5px] text-[13px] text-gray-700 dark:text-zinc-200 font-medium pr-3 text-right flex-[0_0_170px]">
          {label}
        </label>
      )}
      <div className="flex-[1_1_0] min-w-0">
        <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded pr-1 pl-3 bg-white dark:bg-zinc-900 shadow-sm">
          <input
            type="text"
            value={value}
            readOnly
            placeholder={placeholder}
            className="w-full border-none outline-none text-[15px] py-2 font-mono bg-transparent dark:text-zinc-100"
          />
          <button
            className="ml-2 px-2 py-1 text-[13px] rounded bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700 transition"
            onClick={handleCopy}
            type="button"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

const IntegerBaseConverter: React.FC = () => {
  const { t } = useTranslation();

  const [input, setInput] = useState('42');
  const [inputBase, setInputBase] = useState(10);
  const [outputBase, setOutputBase] = useState(42);

  const errorlessConvert = (to: number) => {
    try {
      return convertBase({ value: input, fromBase: inputBase, toBase: to });
    } catch {
      return '';
    }
  };

  const error = useMemo(() => {
    try {
      convertBase({ value: input, fromBase: inputBase, toBase: outputBase });
      return '';
    } catch (err: unknown) {
      return typeof err === 'object' && err !== null && 'message' in err
        ? String((err as { message?: unknown }).message)
        : String(err);
    }
  }, [input, inputBase, outputBase]);

  return (
    <div className="max-w-[600px] mx-auto py-10 bg-white dark:bg-zinc-800 rounded-lg shadow p-6">
      <div className="mb-4 flex items-baseline">
        <label className="mb-[5px] text-[13px] text-gray-700 dark:text-zinc-200 font-medium pr-3 text-right flex-[0_0_120px]">
          {t('integer_base_converter.input_number')}
        </label>
        <div className="flex-[1_1_0] min-w-0">
          <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded pr-1 pl-3 bg-white dark:bg-zinc-900 shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Put your number here (ex: 42)"
              className="w-full border-none outline-none text-[15px] py-2 font-mono bg-transparent dark:text-zinc-100"
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-baseline">
        <label className="mb-[5px] text-[13px] text-gray-700 dark:text-zinc-200 font-medium pr-3 text-right flex-[0_0_120px]">
          {t('integer_base_converter.input_base')}
        </label>
        <div className="flex-[1_1_0] min-w-0">
          <div className="flex items-center border border-gray-200 dark:border-zinc-700 rounded pr-1 pl-3 bg-white dark:bg-zinc-900 shadow-sm">
            <input
              type="number"
              value={inputBase}
              onChange={(e) => setInputBase(Number(e.target.value))}
              min={2}
              max={64}
              className="w-full border-none outline-none text-[15px] py-2 font-mono bg-transparent dark:text-zinc-100"
            />
          </div>
        </div>
      </div>

      <div className="border-none transition-all duration-200 ease-in-out h-[1px] w-full m-0 bg-[#efeff5] dark:bg-zinc-700 my-6"></div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-[13px]">
          {error}
        </div>
      )}

      <InputCopyable
        label="Binary (2)"
        value={errorlessConvert(2)}
        placeholder="Binary version will be here..."
      />
      <InputCopyable
        label="Octal (8)"
        value={errorlessConvert(8)}
        placeholder="Octal version will be here..."
      />
      <InputCopyable
        label="Decimal (10)"
        value={errorlessConvert(10)}
        placeholder="Decimal version will be here..."
      />
      <InputCopyable
        label="Hexadecimal (16)"
        value={errorlessConvert(16)}
        placeholder="Hexadecimal version will be here..."
      />
      <InputCopyable
        label="Base64 (64)"
        value={errorlessConvert(64)}
        placeholder="Base64 version will be here..."
      />

      <div className="flex items-center mt-4 gap-2">
        <div className="flex items-center">
          <div className="text-[13px] text-gray-700 dark:text-zinc-200 font-medium border border-gray-200 dark:border-zinc-700 px-2 min-w-[70px] text-center py-2 bg-gray-100 dark:bg-zinc-900 border-r-0 whitespace-nowrap">
            {t('integer_base_converter.custom')}:
          </div>
          <div className="flex items-center border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 min-w-[70px] p-2 ">
            <input
              type="number"
              value={outputBase}
              onChange={(e) => setOutputBase(Number(e.target.value))}
              min={2}
              max={64}
              className="border-none outline-none text-[13px] font-mono bg-transparent dark:text-zinc-100 w-full"
            />
          </div>
        </div>
        <div className="flex-1">
          <InputCopyable
            label=""
            value={errorlessConvert(outputBase)}
            placeholder={`Base ${outputBase} will be here...`}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegerBaseConverter;

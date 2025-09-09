import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trackUsage } from '../../utils/helpers/TrackUsage';

const JoinStringTwo = () => {
  const { t } = useTranslation();
  const [removeDuplicate, setRemoveDuplicate] = useState(true);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [separator, setSeparator] = useState('');
  const [output, setOutput] = useState('');

  const handleJoin = () => {
    const arr1 = input1
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '');
    const arr2 = input2
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l !== '');
    const max = Math.max(arr1.length, arr2.length);
    let result: string[] = [];

    if (!arr1.length && !arr2.length && separator) {
      result = [separator];
    } else {
      for (let i = 0; i < max; i++) {
        const a = arr1[i] ?? '';
        const b = arr2[i] ?? '';
        if (a || b) {
          result.push(a + separator + b);
        } else {
          result.push(separator);
        }
      }
      if (removeDuplicate) {
        result = Array.from(new Set(result));
      }
    }
    setOutput(result.join('\n'));
    trackUsage('Join String 2');
  };

  return (
    <div className="flex flex-col justify-start w-full px-4 sm:px-6 lg:px-8 min-h-screen pt-0">
      <div className="font-semibold text-base mb-1 text-center sm:text-left text-gray-900 dark:text-gray-100">
        {t('join_string_two.input_title_1')}{' '}
        <span className="font-semibold">
          [
          {input1
            ? input1.split('\n').filter((l) => l.trim() !== '').length
            : 0}
          ]:
        </span>
      </div>
      {/* Input UID */}
      <div className="textarea-wrapper mb-2 flex items-baseline relative w-full">
        <textarea
          id="input-uid-1"
          rows={6}
          className="custom-scroll text-sm px-3 py-2 outline-none w-full"
          placeholder={t('common.input_placeholder')}
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('join_string_two.input_title_2')}{' '}
          <span className="font-semibold">
            [
            {input2
              ? input2.split('\n').filter((l) => l.trim() !== '').length
              : 0}
            ]:
          </span>
        </label>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full textarea-wrapper">
          <textarea
            id="input-uid-2"
            rows={6}
            className="custom-scroll text-sm px-3 py-2 outline-none w-full"
            placeholder={t('common.input_placeholder')}
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('join_string_two.content_separator')}
        </label>
        <div className="flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full input-wrapper">
          <input
            type="text"
            placeholder={t('join_string_two.content_separator_placeholder')}
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center mb-4 cursor-pointer">
        <input
          type="checkbox"
          id="remove-duplicate"
          checked={removeDuplicate}
          onChange={(e) => {
            const checked = e.target.checked;
            setRemoveDuplicate(checked);
          }}
          className="mr-1 !w-fit cursor-pointer"
        />
        <label
          htmlFor="remove-duplicate"
          className="text-xs text-gray-700 dark:text-gray-300 select-none cursor-pointer font-semibold mt-1"
        >
          {t('common.remove_duplicate')}
        </label>
      </div>

      <button
        className={`w-full px-4 py-1.5 bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 text-base font-semibold cursor-pointer text-white ${
          !input1 && !input2 && !separator
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        onClick={handleJoin}
      >
        {t('join_string_two.button_join')}
      </button>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('join_string_two.output_title')}{' '}
          <span className="font-semibold">
            [
            {output
              ? output.split('\n').filter((l) => l.trim() !== '').length
              : 0}
            ]:
          </span>
        </label>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full textarea-wrapper">
          <textarea
            id="output-uid"
            rows={10}
            className="custom-scroll text-sm px-3 py-2 outline-none w-full"
            readOnly
            value={output}
          />
        </div>
      </div>
    </div>
  );
};

export default JoinStringTwo;

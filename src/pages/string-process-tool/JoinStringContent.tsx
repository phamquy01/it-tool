import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { trackUsage } from '../../utils/helpers/TrackUsage';

const JoinString = () => {
  const { t } = useTranslation();
  const [removeDuplicate, setRemoveDuplicate] = useState(true);
  const [input, setInput] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [output, setOutput] = useState('');

  const handleJoin = () => {
    let lines = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');
    if (removeDuplicate) {
      lines = Array.from(new Set(lines));
    }
    if (lines.length === 0) {
      setOutput('');
      return;
    }
    const joined = lines.map((line) => `${start}${line}${end}`).join('\n');
    setOutput(joined);
    trackUsage('Join String 1');
  };

  return (
    <div className="flex flex-col justify-start w-full px-4 sm:px-6 lg:px-8 min-h-screen pt-0">
      <div className="font-medium text-base mb-1 text-center sm:text-left text-gray-900 dark:text-gray-100">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('join_string.input_title')}{' '}
          <span className="font-semibold">
            [
            {input
              ? input.split('\n').filter((l) => l.trim() !== '').length
              : 0}
            ]:
          </span>
        </label>
      </div>
      {/* Input UID */}
      <div className="textarea-wrapper mb-2 flex items-baseline relative w-full">
        <textarea
          id="input-uid"
          rows={10}
          className="custom-scroll text-sm px-3 py-2 outline-none w-full"
          placeholder={t('join_string.input_placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
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
          className="text-xs text-gray-700 dark:text-gray-300 select-none cursor-pointer mt-1 font-semibold"
        >
          {t('common.remove_duplicate')}
        </label>
      </div>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('join_string.start_join')}
        </label>
        <div className="flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full input-wrapper">
          <input
            type="text"
            className="font-bold"
            placeholder={t('join_string.start_join_placeholder')}
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('join_string.end_join')}
        </label>
        <div className="flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full input-wrapper">
          <input
            type="text"
            className="font-bold"
            placeholder={t('join_string.end_join_placeholder')}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>
      </div>

      <button
        className={`w-full px-4 py-1.5 bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 text-base font-semibold text-white ${
          !input ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={handleJoin}
      >
        {t('join_string.button_join')}
      </button>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('join_string.output_title')}{' '}
          <span className="font-semibold">
            [
            {output
              ? output.split('\n').filter((l) => l.trim() !== '').length
              : 0}
            ]:
          </span>
        </label>
        <div className="textarea-wrapper mb-2 flex items-baseline relative w-full">
          <textarea
            id="output-uid"
            rows={10}
            className="custom-scroll text-sm px-3 py-2 outline-none w-full resize-none"
            readOnly
            value={output}
          />
        </div>
      </div>
    </div>
  );
};

export default JoinString;

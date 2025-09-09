import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SplitString = () => {
  const { t } = useTranslation();
  const [removeDuplicate, setRemoveDuplicate] = useState(true);
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('|');
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(1);
  const [output, setOutput] = useState('');

  const trackUsage = async (type: string) => {
    try {
      await fetch(
        `https://lumipic.hieunk-demo.io.vn/api/it-tool/analytic?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type }),
        }
      );
    } catch (error) {
      console.error('Failed to track usage:', error);
    }
  };

  const handleSplit = () => {
    let lines = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');
    if (removeDuplicate) {
      lines = Array.from(new Set(lines));
    }
    if (lines.length === 0 || !separator) {
      setOutput('');
      return;
    }
    const result = lines.map((line) => {
      const parts = line.split(separator);
      return parts.slice(start - 1, end).join(separator);
    });
    setOutput(result.join('\n'));
    trackUsage('Split String');
  };

  return (
    <div className="flex flex-col justify-start w-full px-4 sm:px-6 lg:px-8 min-h-screen pt-0">
      <div className="font-medium text-base mb-1 text-center sm:text-left text-gray-900 dark:text-gray-100">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('string_processing_tool.input_title')}{' '}
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
          className="custom-scroll text-sm px-3 py-2 outline-none w-full resize-none"
          placeholder={t('string_processing_tool.input_placeholder')}
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
          className="text-xs text-gray-700 dark:text-gray-300 select-none cursor-pointer font-semibold mt-1"
        >
          {t('common.remove_duplicate')}
        </label>
      </div>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('string_processing_tool.separator')}
        </label>
        <div className="flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full input-wrapper">
          <input
            type="text"
            className="font-bold"
            placeholder="|"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('string_processing_tool.start_cut')}
        </label>
        <div className="flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full input-wrapper">
          <input
            type="number"
            className="font-bold [&::-webkit-inner-spin-button]:cursor-pointer"
            min={1}
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('string_processing_tool.end_cut')}
        </label>
        <div className="flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full input-wrapper">
          <input
            type="number"
            className="font-bold [&::-webkit-inner-spin-button]:cursor-pointer"
            min={1}
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
          />
        </div>
      </div>

      <button
        className={`w-full px-4 py-1.5 bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 text-base font-semibold text-white ${
          !input ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={handleSplit}
      >
        {t('string_processing_tool.button_split')}
      </button>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('string_processing_tool.output_title')}{' '}
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

export default SplitString;

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useToast } from '../../store/ToastContext';
import { trackUsage } from '../../utils/helpers/TrackUsage';

const RemoveDuplicate = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [option, setOption] = useState('0');
  const [output, setOutput] = useState('');
  const { showToast } = useToast();

  const handleRemoveDuplicate = () => {
    if (!input.trim()) {
      showToast(t('remove_duplicate.input_required'));
      return;
    }
    const lines = input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');
    const countMap: Record<string, number> = {};
    lines.forEach((line) => {
      countMap[line] = (countMap[line] || 0) + 1;
    });
    let result: string[] = [];
    if (option === '0') {
      result = Array.from(new Set(lines));
    } else if (option === '1') {
      result = Object.keys(countMap).filter((line) => countMap[line] > 1);
    } else if (option === '2') {
      result = Object.keys(countMap).filter((line) => countMap[line] === 1);
    }
    setOutput(result.join('\n'));
    trackUsage('Remove Duplicate');
  };

  return (
    <div className="flex flex-col justify-start w-full px-4 sm:px-6 lg:px-8 min-h-screen pt-0">
      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('remove_duplicate.input_title')}{' '}
          <span className="font-semibold">
            [
            {input
              ? input.split('\n').filter((l) => l.trim() !== '').length
              : 0}
            ]:
          </span>
        </label>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full textarea-wrapper">
          <textarea
            rows={6}
            className="custom-scroll text-sm px-3 py-2 outline-none w-full"
            placeholder={t('common.input_placeholder')}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col w-full my-4 text-black dark:text-white text-sm">
        <label className="mb-[5px] text-left font-semibold pr-3 text-[14px]">
          {t('remove_duplicate.option')}
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="outputOption"
              value="0"
              checked={option === '0'}
              onChange={(e) => setOption(e.target.value)}
            />
            <span>{t('remove_duplicate.export_filtered_list')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="outputOption"
              value="1"
              checked={option === '1'}
              onChange={(e) => setOption(e.target.value)}
            />
            <span>{t('remove_duplicate.export_duplicate_list')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="outputOption"
              value="2"
              checked={option === '2'}
              onChange={(e) => setOption(e.target.value)}
            />
            <span>{t('remove_duplicate.export_non_duplicate_list')}</span>
          </label>
        </div>
      </div>

      <button
        className={`w-full px-4 py-1.5 bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 text-base font-semibold text-white ${
          !input ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={handleRemoveDuplicate}
        disabled={!input}
      >
        {t('remove_duplicate.button_remove_duplicate')}
      </button>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('remove_duplicate.output_title')}{' '}
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
            id="input-uid"
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

export default RemoveDuplicate;

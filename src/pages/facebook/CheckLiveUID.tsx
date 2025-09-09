import { useState } from 'react';
import { useToast } from '../../store/ToastContext';
import { useTranslation } from 'react-i18next';
import { trackUsage } from '../../utils/helpers/TrackUsage';

const CheckLiveUID = () => {
  const [uidList, setUidList] = useState('');
  const [liveResult, setLiveResult] = useState('');
  const [dieResult, setDieResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [removeDuplicate, setRemoveDuplicate] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalUid, setTotalUid] = useState(0);
  const { showToast } = useToast();

  const defaultDeadUrl =
    'https://static.xx.fbcdn.net/rsrc.php/v1/yh/r/C5yt7Cqf3zU.jpg';

  type ParsedUID = { raw: string; uid: number };

  const parseUids = (value: string, dedupe: boolean): ParsedUID[] => {
    let items = value
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const [uidStr] = s.split('|');
        return { raw: s, uid: Number(uidStr) };
      });

    if (dedupe) {
      const seen = new Set<string>();
      items = items.filter((obj) => {
        if (seen.has(obj.raw)) return false;
        seen.add(obj.raw);
        return true;
      });
    }

    return items;
  };

  const handleCheckLive = async () => {
    setIsLoading(true);

    const items = parseUids(uidList, removeDuplicate);
    setTotalUid(items.length);
    setUidList(items.map((item) => item.raw).join('\n'));
    setProgress(0);

    const liveUids: string[] = [];
    const dieUids: string[] = [];

    let checked = 0;
    const concurrency = 100;
    const queue = [...items];

    const worker = async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;
        try {
          const res = await fetch(
            `https://graph.facebook.com/${item.uid}/picture?type=normal&redirect=false`
          );
          const data = await res.json();

          if (data?.error) {
            dieUids.push(item.raw);
          } else if (data?.data?.url === defaultDeadUrl) {
            dieUids.push(item.raw);
          } else {
            liveUids.push(item.raw);
          }
        } catch {
          dieUids.push(item.raw);
        }
        checked++;
        setProgress(checked);
        setLiveResult(liveUids.join('\n'));
        setDieResult(dieUids.join('\n'));
      }
    };

    await Promise.all(Array.from({ length: concurrency }, worker));
    trackUsage('Check Facebook UID');

    setIsLoading(false);
  };

  const handleCopyLive = () => {
    if (liveResult) {
      navigator.clipboard.writeText(liveResult);
      showToast(t('common.copied_button'));
    }
  };

  const handleCopyDie = () => {
    if (dieResult) {
      navigator.clipboard.writeText(dieResult);
      showToast(t('common.copied_button'));
    }
  };
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-start w-full px-4 sm:px-6 lg:px-8 min-h-screen pt-0">
      <div className="w-full max-w-7xl bg-white dark:bg-zinc-800 rounded shadow-md px-4 sm:px-6 py-5 mx-auto ">
        <div className="font-medium text-base mb-5 text-center sm:text-left text-gray-900 dark:text-gray-100">
          {t('check_live_uid.input_title')} [{totalUid}]
        </div>

        {/* Input UID */}
        <div className="textarea-wrapper mb-2 flex items-baseline relative w-full">
          <textarea
            id="input-uid"
            value={uidList}
            onChange={(e) => {
              const value = e.target.value;
              setUidList(value);
              const uids = parseUids(value, removeDuplicate);
              setTotalUid(uids.length);
            }}
            rows={10}
            className="custom-scroll text-sm px-3 py-2 outline-none w-full resize-none"
            placeholder={t('check_live_uid.input_placeholder')}
          />
        </div>

        {/* Options */}
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

        <div className="w-full mb-6">
          <button
            onClick={handleCheckLive}
            disabled={isLoading || !uidList.trim()}
            className={`flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-sm cursor-pointer mx-auto ${
              isLoading || !uidList.trim()
                ? 'opacity-60 cursor-not-allowed'
                : ''
            }`}
          >
            {isLoading
              ? t('check_live_uid.checking')
              : t('check_live_uid.check_live_uid')}
          </button>
          {isLoading && totalUid > 20 && (
            <div className="w-full flex flex-col items-center mt-3">
              <div className="w-full sm:w-2/3 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-200"
                  style={{
                    width: `${Math.round((progress / totalUid) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="font-medium text-sm mb-2 text-green-600 dark:text-green-400">
              {t('check_live_uid.live_uid')} [
              {liveResult ? liveResult.split('\n').filter(Boolean).length : 0}]
            </div>
            <div className="textarea-wrapper mb-2 flex items-baseline relative w-full">
              <textarea
                id="output-live-uid"
                value={liveResult}
                readOnly
                rows={8}
                className="custom-scroll text-sm px-3 py-2 outline-none w-full resize-none"
              />
            </div>
            <button
              onClick={handleCopyLive}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm cursor-pointer mx-auto mt-2"
            >
              {t('check_live_uid.copy_live_uid')}
            </button>
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm mb-2 text-red-600 dark:text-red-400">
              {t('check_live_uid.die_uid')} [
              {dieResult ? dieResult.split('\n').filter(Boolean).length : 0}]
            </div>
            <div className="textarea-wrapper mb-2 flex items-baseline relative w-full">
              <textarea
                id="output-die-uid"
                value={dieResult}
                readOnly
                rows={8}
                className="custom-scroll text-sm px-3 py-2 outline-none w-full resize-none"
              />
            </div>
            <button
              onClick={handleCopyDie}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm cursor-pointer mx-auto mt-2"
            >
              {t('check_live_uid.copy_die_uid')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckLiveUID;

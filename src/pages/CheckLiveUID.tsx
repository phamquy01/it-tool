import { useState } from 'react';

const CheckLiveUID = () => {
  const [uidList, setUidList] = useState('');
  const [liveResult, setLiveResult] = useState('');
  const [dieResult, setDieResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [removeDuplicate, setRemoveDuplicate] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalUid, setTotalUid] = useState(0);

  const defaultDeadUrl =
    'https://static.xx.fbcdn.net/rsrc.php/v1/yh/r/C5yt7Cqf3zU.jpg';

  const handleCheckLive = async () => {
    setIsLoading(true);

    let uids = uidList
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => !isNaN(n));
    if (removeDuplicate) {
      uids = Array.from(new Set(uids));
    }
    setTotalUid(uids.length);
    setProgress(0);

    const liveUids: number[] = [];
    const dieUids: number[] = [];

    let checked = 0;

    const concurrency = 100;
    const queue = [...uids];

    const worker = async () => {
      while (queue.length > 0) {
        const uid = queue.shift();
        if (!uid) break;
        try {
          const res = await fetch(
            `https://graph.facebook.com/${uid}/picture?type=normal&redirect=false`
          );
          const data = await res.json();
          if (data?.data?.url === defaultDeadUrl) {
            dieUids.push(uid);
          } else {
            liveUids.push(uid);
          }
        } catch {
          dieUids.push(uid);
        }
        checked++;
        setProgress(checked);
        setLiveResult([...liveUids].join('\n'));
        setDieResult([...dieUids].join('\n'));
      }
    };

    await Promise.all(Array.from({ length: concurrency }, worker));
    setIsLoading(false);
  };

  const handleCopyLive = () => {
    if (liveResult) navigator.clipboard.writeText(liveResult);
  };

  const handleCopyDie = () => {
    if (dieResult) navigator.clipboard.writeText(dieResult);
  };

  return (
    <div className="flex flex-col justify-center w-full px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl bg-white rounded shadow-md px-4 sm:px-6 py-5 mx-auto ">
        <div className="font-medium text-base mb-5 text-center sm:text-left">
          Clone UID [{totalUid}]
        </div>

        {/* Input UID */}
        <div className="mb-2 flex items-baseline relative w-full">
          <textarea
            id="input-uid"
            value={uidList}
            onChange={(e) => setUidList(e.target.value)}
            rows={8}
            className="custom-scroll text-sm py-2 px-3 outline-none w-full text-black bg-white border border-gray-300 rounded resize-none min-h-[120px] max-h-[220px] overflow-auto"
            placeholder="Nhập UID, mỗi UID 1 dòng..."
          />
        </div>

        {/* Options */}
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="remove-duplicate"
            checked={removeDuplicate}
            onChange={(e) => setRemoveDuplicate(e.target.checked)}
            className="mr-2"
          />
          <label
            htmlFor="remove-duplicate"
            className="text-xs text-gray-700 select-none"
          >
            Remove duplicate
          </label>
        </div>

        {/* Button + Progress */}
        <div className="w-full mb-6">
          <button
            onClick={handleCheckLive}
            disabled={isLoading || !uidList.trim()}
            className={`flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer mx-auto ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Đang kiểm tra...' : 'Check Live UID'}
          </button>
          {isLoading && totalUid > 0 && (
            <div className="w-full flex flex-col items-center mt-3">
              <div className="w-full sm:w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden">
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
            <div className="font-medium text-sm mb-2 text-green-600">
              Live UID [
              {liveResult ? liveResult.split('\n').filter(Boolean).length : 0}]
            </div>
            <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent  transition-colors duration-200 ease-in-out min-h-[120px] max-h-[220px]">
              <textarea
                id="output-live-uid"
                value={liveResult}
                readOnly
                rows={8}
                className="custom-scroll text-sm py-2 outline-none w-full text-black bg-transparent resize-none min-h-[120px] max-h-[220px] overflow-auto scrollbar scrollbar-thumb-green-600 scrollbar-track-gray-300"
              />
            </div>
            <button
              onClick={handleCopyLive}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer mx-auto mt-2"
            >
              Copy Live UID
            </button>
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm mb-2 text-red-600">
              Die UID [
              {dieResult ? dieResult.split('\n').filter(Boolean).length : 0}]
            </div>
            <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent transition-colors duration-200 ease-in-out min-h-[120px] max-h-[220px]">
              <textarea
                id="output-die-uid"
                value={dieResult}
                readOnly
                rows={8}
                className="custom-scroll text-sm py-2 outline-none w-full text-black bg-transparent resize-none min-h-[120px] max-h-[220px]"
              />
            </div>
            <button
              onClick={handleCopyDie}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer mx-auto mt-2"
            >
              Copy Die UID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckLiveUID;

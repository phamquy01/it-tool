import { useState } from 'react';

const CheckLiveUID = () => {
  const [uidList, setUidList] = useState('');
  const [liveResult, setLiveResult] = useState('');
  const [dieResult, setDieResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [removeDuplicate, setRemoveDuplicate] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const handleCheckLive = async () => {
    setIsLoading(true);
    setCheckCount((prev) => prev + 1);
    let uids = uidList.split(/\s|,|;/).filter(Boolean);
    if (removeDuplicate) {
      uids = Array.from(new Set(uids));
      setUidList(uids.join(' '));
    }
    const liveUids = [];
    const dieUids = [];

    const defaultDeadUrl =
      'https://static.xx.fbcdn.net/rsrc.php/v1/yh/r/C5yt7Cqf3zU.jpg';

    for (const uid of uids) {
      try {
        const res = await fetch(
          `https://graph.facebook.com/${uid}/picture?type=normal&redirect=false`,
          { method: 'GET' }
        );
        const data = await res.json();
        // console.log(uid, data);

        // Nếu API trả về URL ảnh mặc định của FB → tài khoản chết
        if (data?.data?.url === defaultDeadUrl) {
          dieUids.push(uid);
        } else {
          liveUids.push(uid);
        }
      } catch {
        dieUids.push(uid);
      }
    }

    setLiveResult(liveUids.join('\n'));
    setDieResult(dieUids.join('\n'));
    setIsLoading(false);
  };

  const handleCopyLive = () => {
    if (liveResult) {
      navigator.clipboard.writeText(liveResult);
    }
  };

  const handleCopyDie = () => {
    if (dieResult) {
      navigator.clipboard.writeText(dieResult);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row justify-center gap-4 w-fit mx-auto">
      <div className="min-w-[300px] lg:min-w-[600px] h-fit bg-white rounded shadow-md px-6 py-5">
        <div className="font-medium text-base mb-5">
          Clone UID [{checkCount}]
        </div>
        <div className="mb-2 flex items-baseline relative">
          <div className="flex-[1_1_0] min-w-0">
            <div className="resize-y overflow-hidden pr-1 pl-3 border border-gray-300 rounded flex items-center bg-white mb-4 hover:border-green-600 min-h-[100px] relative">
              <textarea
                id="input-uid-list"
                placeholder="Nhập danh sách UID, mỗi UID cách nhau bởi dấu cách, phẩy hoặc xuống dòng..."
                value={uidList}
                onChange={(e) => setUidList(e.target.value)}
                rows={Math.max(4, uidList.split('\n').length + 2)}
                className="text-sm py-2 outline-none w-full text-black bg-transparent resize-none "
              />
              <div className="absolute left-2 bottom-2 flex items-center">
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
            </div>
          </div>
        </div>
        <div className="w-full mb-6">
          <button
            onClick={handleCheckLive}
            disabled={isLoading || !uidList.trim()}
            className={`flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer mx-auto ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Đang kiểm tra...' : 'Check Live'}
          </button>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="w-full">
            <div className="font-medium text-sm mb-2 text-green-600">
              Live UID [
              {liveResult ? liveResult.split('\n').filter(Boolean).length : 0}]
            </div>
            <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
              <textarea
                id="output-live-uid"
                value={liveResult}
                readOnly
                rows={4}
                className="text-sm py-2 outline-none w-full text-black bg-transparent resize-none"
              />
            </div>
            <button
              onClick={handleCopyLive}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer mx-auto mt-2"
            >
              Copy Live UID
            </button>
          </div>
          <div className="w-full">
            <div className="font-medium text-sm mb-2 text-red-600">
              Die UID [
              {dieResult ? dieResult.split('\n').filter(Boolean).length : 0}]
            </div>
            <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
              <textarea
                id="output-die-uid"
                value={dieResult}
                readOnly
                rows={4}
                className="text-sm py-2 outline-none w-full text-black bg-transparent resize-none"
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

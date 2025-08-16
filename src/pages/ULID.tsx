import { useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { ulid } from 'ulid';
import _ from 'lodash';
const ULID = () => {
  const formats = [
    { label: 'Raw', value: 'raw' },
    { label: 'JSON', value: 'json' },
  ];
  const [amount, setAmount] = useLocalStorage<number>(
    'ulid-generator-amount',
    1
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // Tương đương const format = useStorage<typeof formats[number]['value']>(...)
  const [format, setFormat] = useLocalStorage<
    (typeof formats)[number]['value']
  >('ulid-generator-format', formats[0].value);

  // Tương đương computedRefreshable
  const ulids = useMemo(() => {
    const ids = _.times(amount ?? 1, () => ulid());

    if (format === 'json') {
      return JSON.stringify(ids, null, 2);
    }
    return ids.join('\n');
  }, [amount, format, refreshKey]);

  const handleCopy = () => {
    navigator.clipboard.writeText(ulids);
  };

  const refreshUlids = () => {
    setRefreshKey((k) => k + 1);
  };
  return (
    <>
      <div className="max-w-[600px] mx-auto">
        <div className="mb-2 flex items-center">
          <span className="mb-[5px] text-sm pr-3 text-left w-[80px]">
            Quantity:
          </span>
          <div className="flex-[1_1_0] min-w-0">
            <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
              <input
                id="input-number"
                type="number"
                placeholder="Salt rounds..."
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                max={100}
                spellCheck={false}
                className="text-sm py-2 outline-none w-full text-black bg-transparent"
              />
            </div>
          </div>
        </div>
        <div className="mb-4 flex items-baseline">
          <label className="mb-[5px] text-sm pr-3 text-left w-[80px]">
            Format:
          </label>
          {formats.map((f) => (
            <button
              key={f.value}
              className={`flex items-center gap-2 px-3.5 h-[34px] bg-gray-100 rounded hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer mr-3 ${
                format === f.value
                  ? 'bg-green-200 text-[#18a058]'
                  : 'bg-gray-200 text-black border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setFormat(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="resize-y overflow-hidden px-6 py-5 border border-gray-300 rounded flex items-center bg-white mb-4 hover:border-green-600">
          <textarea
            className="w-full word-break whitespace-pre-wrap border-none outline-none text-sm  resize-none text-center font-medium font-mono"
            placeholder="Your string to hash..."
            value={ulids}
            rows={Math.max(1, ulids.split('\n').length)}
            readOnly
          />
        </div>
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer "
          >
            Copy
          </button>
          <button
            onClick={refreshUlids}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>
    </>
  );
};

export default ULID;

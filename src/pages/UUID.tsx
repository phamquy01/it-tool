import { useEffect, useState } from 'react';
import {
  v1 as uuidv1,
  v3 as uuidv3,
  v4 as uuidv4,
  v5 as uuidv5,
  NIL as nilUuid,
} from 'uuid';

const UUIDGenerator = () => {
  const versions = ['NIL', 'v1', 'v3', 'v4', 'v5'];
  const defaultNamespace = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';

  const [version, setVersion] = useState('v4');
  const [quantity, setQuantity] = useState(1);
  const [v35Args, setV35Args] = useState({
    namespace: defaultNamespace,
    name: '',
  });
  const [uuids, setUuids] = useState('');

  const generateUUIDs = () => {
    const result: string[] = [];
    for (let i = 0; i < quantity; i++) {
      switch (version) {
        case 'NIL':
          result.push(nilUuid);
          break;
        case 'v1':
          result.push(uuidv1());
          break;
        case 'v3':
          result.push(uuidv3(v35Args.name || '', v35Args.namespace));
          break;
        case 'v4':
          result.push(uuidv4());
          break;
        case 'v5':
          result.push(uuidv5(v35Args.name || '', v35Args.namespace));
          break;
        default:
          result.push('');
      }
    }
    setUuids(result.join('\n'));
  };

  // Generate on mount and when dependencies change
  useEffect(() => {
    generateUUIDs();
    // eslint-disable-next-line
  }, [version, quantity, v35Args]);

  const copy = () => {
    navigator.clipboard.writeText(uuids);
  };

  const refreshUUIDs = () => {
    generateUUIDs();
  };
  return (
    <>
      <div className="max-w-[600px] mx-auto">
        <div className="mb-2 flex items-baseline">
          <label className="mb-[5px] text-sm pr-3 text-left w-[100px]">
            UUID version
          </label>
          {versions.map((v) => (
            <button
              key={v}
              className={`flex items-center gap-2 px-3.5 h-[34px] bg-gray-100 rounded hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer mr-3 ${
                version === v
                  ? 'bg-green-200 text-[#18a058]'
                  : 'bg-gray-200 text-black border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setVersion(v)}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="mb-2 flex items-center">
          <span className="mb-[5px] text-sm pr-3 text-left w-[100px]">
            Quantity
          </span>
          <div className="flex-[1_1_0] min-w-0">
            <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
              <input
                id="input-number"
                type="number"
                placeholder="Salt rounds..."
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                max={100}
                spellCheck={false}
                className="text-sm py-2 outline-none w-full text-black bg-transparent"
              />
            </div>
          </div>
        </div>

        {(version === 'v3' || version === 'v5') && (
          <div>
            <div className="mb-2 flex items-baseline">
              <label className="mb-[5px] text-sm pr-3 text-left w-[100px]">
                Namespace
              </label>
              <div className="flex gap-2">
                {[
                  {
                    label: 'DNS',
                    value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
                  },
                  {
                    label: 'URL',
                    value: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
                  },
                  {
                    label: 'OID',
                    value: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
                  },
                  {
                    label: 'X500',
                    value: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
                  },
                ].map((ns) => (
                  <button
                    key={ns.value}
                    className={`flex items-center gap-2 px-3.5 h-[34px] rounded hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer mr-2 ${
                      v35Args.namespace === ns.value
                        ? 'bg-green-200 text-[#18a058]'
                        : 'bg-gray-200 text-black border-gray-300 hover:bg-gray-100'
                    }`}
                    onClick={() =>
                      setV35Args({ ...v35Args, namespace: ns.value })
                    }
                    type="button"
                  >
                    {ns.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-2 flex items-center">
              <span className="mb-[5px] text-sm pr-3 text-left w-[100px]"></span>
              <div className="flex-[1_1_0] min-w-0">
                <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
                  <input
                    type="text"
                    value={v35Args.namespace}
                    onChange={(e) =>
                      setV35Args({ ...v35Args, namespace: e.target.value })
                    }
                    spellCheck={false}
                    className="text-sm py-2 outline-none w-full text-black bg-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="mb-2 flex items-center">
              <span className="mb-[5px] text-sm pr-3 text-left w-[100px]">
                Name
              </span>
              <div className="flex-[1_1_0] min-w-0">
                <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
                  <input
                    id="input-number"
                    type="text"
                    placeholder="Name"
                    value={v35Args.name}
                    onChange={(e) =>
                      setV35Args({ ...v35Args, name: e.target.value })
                    }
                    spellCheck={false}
                    className="text-sm py-2 outline-none w-full text-black bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="resize-y overflow-hidden pr-1 pl-3 border border-gray-300 rounded flex items-center bg-white mb-4 hover:border-green-600">
          <textarea
            className="w-full word-break whitespace-pre-wrap border-none outline-none text-sm py-2 resize-none text-center font-semibold font-mono"
            placeholder="Your string to hash..."
            value={uuids}
            style={{
              paddingRight: 8,
              paddingLeft: 8,
              height: 'auto',
              minHeight: 69,
              overflowY: 'auto',
            }}
            rows={Math.max(1, uuids.split('\n').length)}
            readOnly
          />
        </div>

        <div className="flex justify-center items-center gap-3">
          <button
            onClick={copy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer "
          >
            Copy
          </button>
          <button
            onClick={refreshUUIDs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </div>
    </>
  );
};

export default UUIDGenerator;

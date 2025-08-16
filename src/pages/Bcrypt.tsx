import { useEffect, useState, useCallback } from 'react';
import bcrypt from 'bcryptjs';

const Bcrypt = () => {
  const [stringBcrypt, setStringBcrypt] = useState('');
  const [saltRounds, setSaltRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [stringCompare, setStringCompare] = useState('');
  const [hashCompare, setHashCompare] = useState('');

  const handleCopy = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
    }
  };

  const bcryptString = useCallback(async () => {
    if ((stringBcrypt && saltRounds) || !stringBcrypt) {
      const hashString = await bcrypt.hash(stringBcrypt, saltRounds);
      setHash(hashString);
    }
  }, [stringBcrypt, saltRounds]);

  useEffect(() => {
    bcryptString();
  }, [stringBcrypt, saltRounds, bcryptString]);

  return (
    <>
      <div className="flex flex-col xl:flex-row justify-center gap-4 max-w-[600px] mx-auto">
        <div className="min-w-[300px] lg:min-w-[600px] h-fit bg-white rounded shadow-md px-6 py-5">
          <div className="font-medium text-base mb-5">Hash</div>
          <div className="mb-2 flex items-baseline">
            <label className="mb-[5px] text-sm pr-3 text-right flex-[0_0_120px]">
              Your string:
            </label>
            <div className="flex-[1_1_0] min-w-0">
              <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
                <input
                  id="input-string"
                  type="text"
                  placeholder="Your string to bcrypt..."
                  value={stringBcrypt}
                  onChange={(e) => setStringBcrypt(e.target.value)}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="text-sm py-2 outline-none w-full text-black bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="mb-6 flex items-baseline">
            <label className="mb-[5px] text-sm pr-3 text-right flex-[0_0_120px]">
              Salt count:{' '}
            </label>
            <div className="flex-[1_1_0] min-w-0">
              <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
                <input
                  id="input-number"
                  type="number"
                  placeholder="Salt rounds..."
                  value={saltRounds}
                  onChange={(e) => setSaltRounds(Number(e.target.value))}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="text-sm py-2 outline-none w-full text-black bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex-[1_1_0] min-w-0 mb-6">
            <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
              <input
                id="input-hash"
                type="string"
                value={hash}
                className="text-sm py-2 outline-none w-full text-black bg-transparent"
                readOnly
              />
            </div>
          </div>
          <div className="w-full">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm cursor-pointer mx-auto"
            >
              Copy hash
            </button>
          </div>
        </div>
        <div className="min-w-[300px] lg:min-w-[600px] h-fit bg-white rounded shadow-md px-6 py-5">
          <div className="font-medium text-base mb-5">
            Compare string with hash
          </div>
          <div className="mb-2 flex items-baseline">
            <label className="mb-[5px] text-sm pr-3 text-right flex-[0_0_120px]">
              Your string:
            </label>
            <div className="flex-[1_1_0] min-w-0">
              <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
                <input
                  id="input-string-compare"
                  type="text"
                  placeholder="Your string to compare..."
                  value={stringCompare}
                  onChange={(e) => setStringCompare(e.target.value)}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="text-sm py-2 outline-none w-full text-black bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="mb-6 flex items-baseline">
            <label className="mb-[5px] text-sm pr-3 text-right flex-[0_0_120px]">
              Your hash:
            </label>
            <div className="flex-[1_1_0] min-w-0">
              <div className="flex items-center border-[#e0e0e69e] bg-white rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out">
                <input
                  id="input-hash-compare"
                  type="string"
                  placeholder="Your hash to compare..."
                  value={hashCompare}
                  onChange={(e) => setHashCompare(e.target.value)}
                  spellCheck={false}
                  className="text-sm py-2 outline-none w-full text-black bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex items-baseline text-sm ">
            <p className="pr-3 text-black font-normal">Do they Match ?</p>
            <p
              className={`font-normal ${
                bcrypt.compareSync(stringCompare, hashCompare)
                  ? 'text-green-600'
                  : 'text-red-700'
              }`}
            >
              {bcrypt.compareSync(stringCompare, hashCompare) ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bcrypt;

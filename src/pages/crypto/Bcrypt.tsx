import { useEffect, useState, useCallback } from 'react';
import bcrypt from 'bcryptjs';
import { useTranslation } from 'react-i18next';

const Bcrypt = () => {
  const [stringBcrypt, setStringBcrypt] = useState('');
  const [saltRounds, setSaltRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [stringCompare, setStringCompare] = useState('');
  const [hashCompare, setHashCompare] = useState('');
  const { t } = useTranslation();
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
      <div className="flex flex-col 2xl:flex-row justify-center gap-4 max-w-[600px] mx-auto">
        <div className="min-w-[300px] lg:min-w-[600px] h-fit bg-white dark:bg-zinc-800 rounded shadow-md px-6 py-5">
          <div className="font-medium text-base mb-5 text-black dark:text-white">
            {t('bcrypt.hash_title')}
          </div>
          <div className="mb-2 flex items-baseline">
            <label className="mb-[5px] text-sm pr-3 text-right flex-[0_0_120px] text-black dark:text-white">
              {t('bcrypt.your_string')}
            </label>
            <div className="flex-[1_1_0] min-w-0">
              <div className="flex items-center border-[#e0e0e69e] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out input-wrapper">
                <input
                  id="input-string"
                  type="text"
                  placeholder={t('bcrypt.your_string_placeholder')}
                  value={stringBcrypt}
                  onChange={(e) => setStringBcrypt(e.target.value)}
                  spellCheck={false}
                  className="text-sm py-2 outline-none w-full text-black dark:text-white bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="mb-6 flex items-baseline">
            <label className="mb-[5px] text-sm pr-3 text-right flex-[0_0_120px] text-black dark:text-white">
              {t('bcrypt.salt_count')}
            </label>
            <div className="flex-[1_1_0] min-w-0">
              <div className="flex items-center border-[#e0e0e69e] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out input-wrapper">
                <input
                  id="input-number"
                  type="number"
                  value={saltRounds}
                  onChange={(e) => setSaltRounds(Number(e.target.value))}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="text-sm py-2 outline-none w-full text-black dark:text-white bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex-[1_1_0] min-w-0 mb-6">
            <div className="flex items-center border-[#e0e0e69e] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out input-wrapper">
              <input
                id="input-hash"
                type="string"
                value={hash}
                className="text-sm py-2 outline-none w-full text-black dark:text-white bg-transparent"
                readOnly
              />
            </div>
          </div>
          <div className="w-full">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 text-sm cursor-pointer mx-auto text-black dark:text-white "
            >
              {t('bcrypt.copy_hash')}
            </button>
          </div>
        </div>
        <div className="min-w-[300px] lg:min-w-[600px] h-fit bg-white dark:bg-zinc-800 rounded shadow-md px-6 py-5">
          <div className="font-medium text-base mb-5 text-black dark:text-white">
            {t('bcrypt.compare_string_with_hash')}
          </div>
          <div className="mb-2 flex items-baseline">
            <label className="mb-[5px] text-sm pr-3 text-right flex-[0_0_120px] text-black dark:text-white">
              {t('bcrypt.your_string')}:
            </label>
            <div className="flex-[1_1_0] min-w-0">
              <div className="flex items-center border-[#e0e0e69e] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out input-wrapper">
                <input
                  id="input-string-compare"
                  type="text"
                  placeholder={t('bcrypt.your_string_placeholder')}
                  value={stringCompare}
                  onChange={(e) => setStringCompare(e.target.value)}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="text-sm py-2 outline-none w-full text-black dark:text-white bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="mb-6 flex items-baseline">
            <label className="mb-[5px] text-sm pr-3 text-right flex-[0_0_120px] text-black dark:text-white">
              {t('bcrypt.your_hash')}:
            </label>
            <div className="flex-[1_1_0] min-w-0">
              <div className="flex items-center border-[#e0e0e69e] dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded pr-1 pl-3 border text-transparent hover:border-green-600 transition-colors duration-200 ease-in-out input-wrapper">
                <input
                  id="input-hash-compare"
                  type="string"
                  placeholder={t('bcrypt.your_hash_placeholder')}
                  value={hashCompare}
                  onChange={(e) => setHashCompare(e.target.value)}
                  spellCheck={false}
                  className="text-sm py-2 outline-none w-full text-black dark:text-white bg-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex items-baseline text-sm ">
            <p className="pr-3 text-black dark:text-white font-normal">
              {t('bcrypt.do_they_match')}
            </p>
            <p
              className={`font-normal ${
                bcrypt.compareSync(stringCompare, hashCompare)
                  ? 'text-green-600'
                  : 'text-red-700'
              }`}
            >
              {bcrypt.compareSync(stringCompare, hashCompare)
                ? t('bcrypt.yes')
                : t('bcrypt.no')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bcrypt;

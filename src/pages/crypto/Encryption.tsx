import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import LanguageSelector from '../../components/Selector';
import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js';
import { useTranslation } from 'react-i18next';

const Encryption = () => {
  const algos = [
    {
      value: 'AES',
      label: 'AES',
    },
    {
      value: 'TripleDES',
      label: 'Triple DES',
    },
    {
      value: 'Rabbit',
      label: 'Rabbit',
    },
    {
      value: 'RC4',
      label: 'RC4',
    },
  ];
  const [cypherInput, setCypherInput] = useState('lorem ipsum dolor sit amet');
  const [cypherAlgo, setCypherAlgo] = useState('AES');
  const [cypherSecret, setCypherSecret] = useState('my secret key');
  const { t } = useTranslation();

  const getAlgorithm = (algo: string) => {
    switch (algo) {
      case 'AES':
        return AES;
      case 'TripleDES':
        return TripleDES;
      case 'Rabbit':
        return Rabbit;
      case 'RC4':
        return RC4;
      default:
        return AES;
    }
  };

  const cypherOutput = useMemo(
    () =>
      getAlgorithm(cypherAlgo).encrypt(cypherInput, cypherSecret).toString(),
    [cypherInput, cypherAlgo, cypherSecret]
  );

  const [decryptInput, setDecryptInput] = useState(cypherOutput);
  const [decryptAlgo, setDecryptAlgo] = useState('AES');
  const [decryptSecret, setDecryptSecret] = useState('my secret key');
  const decryptOutput = useMemo(() => {
    return getAlgorithm(decryptAlgo)
      .decrypt(decryptInput, decryptSecret)
      .toString(enc.Utf8);
  }, [decryptInput, decryptAlgo, decryptSecret]);

  return (
    <div className="flex flex-col xl:flex-row justify-center gap-4 max-w-[600px] mx-auto xl:max-w-max ">
      <div className="max-w-[600px] py-10 bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-md p-6">
        <div className=" flex justify-between items-baseline gap-4 mb-6">
          <div className="flex flex-col w-full h-full">
            <label className="mb-[5px] text-left pr-3 text-[14px]">
              Your text:
            </label>
            <div className="input-wrapper resize-y overflow-hidden pr-1 pl-3 border border-zinc-300 dark:border-zinc-700 rounded flex items-center">
              <textarea
                className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal bg-transparent text-zinc-900 dark:text-zinc-100"
                placeholder="The string to cypher"
                value={cypherInput}
                onChange={(e) => setCypherInput(e.target.value)}
                rows={1}
                ref={(el) => {
                  if (el) {
                    el.style.height = '100%';
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-col w-full mb-1">
              <label className="mb-[5px] text-left pr-3 text-[14px]">
                Your secret key:
              </label>
              <div className="input-wrapper flex items-center gap-2 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded w-full">
                <input
                  type="text"
                  className="w-full word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal bg-transparent text-zinc-900 dark:text-zinc-100"
                  value={cypherSecret}
                  onChange={(e) => setCypherSecret(e.target.value)}
                />

                <div
                  className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer focus:border-green-500"
                  onClick={() => {
                    setCypherSecret('');
                  }}
                >
                  <X size={14} />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-[5px] text-left pr-3 text-[14px]">
                Encryption algorithm:
              </label>
              <LanguageSelector
                data={algos}
                currentSelect={cypherAlgo}
                onSelectChange={setCypherAlgo}
                width="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col w-full h-full">
            <label className="mb-[5px] text-left pr-3 text-[14px]">
              Your text encrypted:
            </label>
            <div className="input-wrapper resize-y overflow-hidden pr-1 pl-3 border border-zinc-300 dark:border-zinc-700 rounded flex items-center">
              <textarea
                className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal bg-transparent text-zinc-900 dark:text-zinc-100"
                placeholder="The string to cypher"
                value={cypherOutput}
                rows={1}
                ref={(el) => {
                  if (el) {
                    el.style.height = '100%';
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[600px] py-10 bg-zinc-50 dark:bg-zinc-800 rounded-lg shadow-md p-6">
        <div className=" flex justify-between items-baseline gap-4 mb-6">
          <div className="flex flex-col w-full h-full">
            <label className="mb-[5px] text-left pr-3 text-[14px]">
              {t('encryption.your_text')}
            </label>
            <div className="input-wrapper resize-y overflow-hidden pr-1 pl-3 border border-zinc-300 dark:border-zinc-700 rounded flex items-center">
              <textarea
                className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal bg-transparent text-zinc-900 dark:text-zinc-100"
                placeholder={t('encryption.your_text_placeholder')}
                value={decryptInput}
                onChange={(e) => setDecryptInput(e.target.value)}
                rows={1}
                ref={(el) => {
                  if (el) {
                    el.style.height = '100%';
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-col w-full mb-1">
              <label className="mb-[5px] text-left pr-3 text-[14px]">
                {t('encryption.your_secret_key')}
              </label>
              <div className="input-wrapper flex items-center gap-2 px-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded w-full">
                <input
                  type="text"
                  className="w-full word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal bg-transparent text-zinc-900 dark:text-zinc-100"
                  value={decryptSecret}
                  onChange={(e) => setDecryptSecret(e.target.value)}
                />

                <div
                  className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer focus:border-green-500"
                  onClick={() => {
                    setDecryptSecret('');
                  }}
                >
                  <X size={14} />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-[5px] text-left pr-3 text-[14px]">
                {t('encryption.encryption_algorithm')}
              </label>
              <LanguageSelector
                data={algos}
                currentSelect={decryptAlgo}
                onSelectChange={setDecryptAlgo}
                width="w-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex flex-col w-full h-full">
            <label className="mb-[5px] text-left pr-3 text-[14px]">
              {t('encryption.your_text_decrypted')}
            </label>
            <div className="input-wrapper resize-y overflow-hidden pr-1 pl-3 border border-zinc-300 dark:border-zinc-700 rounded flex items-center">
              <textarea
                className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal bg-transparent text-zinc-900 dark:text-zinc-100"
                placeholder={t('encryption.your_text_placeholder')}
                value={decryptOutput}
                rows={1}
                ref={(el) => {
                  if (el) {
                    el.style.height = '100%';
                    el.style.height = `${el.scrollHeight}px`;
                  }
                }}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encryption;

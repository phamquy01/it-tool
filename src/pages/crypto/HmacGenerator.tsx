import { useState, useEffect } from 'react';
import {
  HmacMD5,
  HmacRIPEMD160,
  HmacSHA1,
  HmacSHA224,
  HmacSHA256,
  HmacSHA3,
  HmacSHA384,
  HmacSHA512,
  enc,
} from 'crypto-js';
import LanguageSelector from '../../components/Selector';
import { Copy, X } from 'lucide-react';
import { useToast } from '../../store/ToastContext';
import { useTranslation } from 'react-i18next';

const HmacGenerator = () => {
  const { t } = useTranslation();
  const [plainText, setPlainText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [hashFunc, setHashFunc] = useState('SHA256');
  const [hmac, setHmac] = useState('');
  const [currentEncode, setCurrentEncode] = useState('Hex');
  const { showToast } = useToast();
  const algos = {
    MD5: HmacMD5,
    RIPEMD160: HmacRIPEMD160,
    SHA1: HmacSHA1,
    SHA3: HmacSHA3,
    SHA224: HmacSHA224,
    SHA256: HmacSHA256,
    SHA384: HmacSHA384,
    SHA512: HmacSHA512,
  } as const;
  const dataEncode = [
    {
      label: 'Binary (base 2)',
      value: 'Bin',
    },
    {
      label: 'Hexadecimal (base 16)',
      value: 'Hex',
    },
    {
      label: 'Base64 (base 64)',
      value: 'Base64',
    },
    {
      label: 'Base64-url (base 64 with url safe chars)',
      value: 'Base64url',
    },
  ];

  useEffect(() => {
    let result = '';
    try {
      let encodeType = enc.Hex;
      if (currentEncode === 'Base64') encodeType = enc.Base64;
      const algoFunc = algos[hashFunc as keyof typeof algos];
      if (algoFunc) {
        result = algoFunc(plainText, secretKey).toString(encodeType);
      }
      setHmac(result);
    } catch {
      setHmac('');
    }
  }, [plainText, secretKey, hashFunc, currentEncode]);

  const handleCopy = () => {
    if (hmac) {
      navigator.clipboard.writeText(hmac);
      showToast('Đã copy HMAC!');
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="flex flex-col w-full mb-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px]">
          {t('hmac_generator.plain_text')}
        </label>
        <div className="resize-y overflow-hidden pr-1 pl-3 border border-zinc-300 rounded flex items-center bg-white dark:bg-zinc-900 hover:border-green-600 input-wrapper">
          <textarea
            className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-normal bg-white dark:bg-zinc-900 text-black dark:text-white"
            placeholder={t('hmac_generator.plain_text_placeholder')}
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
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
      <div className="flex flex-col w-full mb-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px]">
          {t('hmac_generator.secret_key')}
        </label>
        <div className="flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full input-wrapper">
          <input
            type="text"
            className="w-full word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal bg-white dark:bg-zinc-900 text-black dark:text-white"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />

          <div
            className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer focus:border-green-500"
            onClick={() => {
              setSecretKey('');
            }}
          >
            <X size={14} />
          </div>
        </div>
      </div>
      <div className="mb-4 flex gap-4 text-black dark:text-white">
        <div className="flex-1">
          <label className="mb-[5px] text-sm pr-3 text-left w-full block">
            {t('hmac_generator.hash_algorithm')}
          </label>
          <LanguageSelector
            data={Object.keys(algos).map((key) => ({ label: key, value: key }))}
            currentSelect={hashFunc}
            onSelectChange={setHashFunc}
            width="w-full"
          />
        </div>
        <div className="flex-1">
          <label className="mb-[5px] text-sm pr-3 text-left w-full block">
            {t('hmac_generator.output_encoding')}
          </label>
          <LanguageSelector
            data={dataEncode}
            currentSelect={currentEncode}
            onSelectChange={setCurrentEncode}
            width="w-full"
          />
        </div>
      </div>
      <div className="flex flex-col w-full mb-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px]">
          {t('hmac_generator.generated_hmac')}
        </label>
        <div className="flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded leading-[34px] w-full mb-4 input-wrapper">
          <input
            type="text"
            className="flex-1 border-zinc-300 rounded leading-[34px] text-[14px] outline-none bg-white dark:bg-zinc-900 text-black dark:text-white"
            value={hmac}
            readOnly
          />

          <div className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-800 active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer focus:border-green-500">
            <Copy size={14} />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-200 text-sm cursor-pointer "
        >
          {t('hmac_generator.copy_hmac')}
        </button>
      </div>
    </div>
  );
};

export default HmacGenerator;

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
import LanguageSelector from '../components/LanguageSelector';
import { Copy, X } from 'lucide-react';

const HmacGenerator = () => {
  const [plainText, setPlainText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [hashFunc, setHashFunc] = useState('SHA256');
  const [hmac, setHmac] = useState('');
  const [toast, setToast] = useState('');
  const [currentEncode, setCurrentEncode] = useState('Hex');
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
      setToast('Đã copy HMAC!');
      setTimeout(() => setToast(''), 2000);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="flex flex-col w-full mb-4 text-black">
        <label className="mb-[5px] text-left pr-3 text-[14px]">
          Plain text to compute the hash
        </label>
        <div className="resize-y overflow-hidden pr-1 pl-3 border border-gray-300 rounded flex items-center bg-white hover:border-green-600 ">
          <textarea
            className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-normal"
            placeholder="plan text to the compouter the hash..."
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
      <div className="flex flex-col w-full mb-4 text-black">
        <label className="mb-[5px] text-left pr-3 text-[14px]">
          Secret key
        </label>
        <div className="flex items-center gap-2 px-3 bg-white border border-gray-300 rounded w-full">
          <input
            type="text"
            className="w-full word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />

          <div
            className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer focus:border-green-500"
            onClick={() => {
              setSecretKey('');
            }}
          >
            <X size={14} />
          </div>
        </div>
      </div>
      <div className="mb-4 flex gap-4 text-black">
        <div className="flex-1">
          <label className="mb-[5px] text-sm pr-3 text-left w-full block">
            Hash function
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
            Output encoding
          </label>
          <LanguageSelector
            data={dataEncode}
            currentSelect={currentEncode}
            onSelectChange={setCurrentEncode}
            width="w-full"
          />
        </div>
      </div>
      <div className="flex flex-col w-full mb-4 text-black">
        <label className="mb-[5px] text-left pr-3 text-[14px]">
          HMAC of your text
        </label>
        <div className="flex items-center gap-2 px-3 bg-white border border-gray-300 rounded leading-[34px] w-full mb-4">
          <input
            type="text"
            className="flex-1 border-gray-300 rounded leading-[34px] text-[14px] outline-none"
            value={hmac}
            readOnly
          />

          <div className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer focus:border-green-500">
            <Copy size={14} />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer "
        >
          Copy Hmac
        </button>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '40px',
            transform: 'translateX(-50%)',
            zIndex: 50,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
          className="bg-white text-black px-5 py-2 rounded flex items-center gap-2"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="10" r="10" fill="#22c55e" />
            <path
              d="M6 10l2.5 2.5L14 7"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 14 }}>{toast}</span>
        </div>
      )}
    </div>
  );
};

export default HmacGenerator;

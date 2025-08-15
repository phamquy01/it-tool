import LanguageSelector from '../components/LanguageSelector';
import PageTitleSection from '../components/PageTitleSection';
import { Copy } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import {
  MD5,
  RIPEMD160,
  SHA1,
  SHA224,
  SHA256,
  SHA3,
  SHA384,
  SHA512,
  enc,
  lib,
} from 'crypto-js';

type Encoding = 'Bin' | 'Hex' | 'Base64' | 'Base64url';
type AlgoNames =
  | 'MD5'
  | 'SHA1'
  | 'SHA256'
  | 'SHA224'
  | 'SHA512'
  | 'SHA384'
  | 'SHA3'
  | 'RIPEMD160';

const algoFns: Record<AlgoNames, (text: string) => lib.WordArray> = {
  MD5,
  SHA1,
  SHA256,
  SHA224,
  SHA512,
  SHA384,
  SHA3,
  RIPEMD160,
};

const HashText = () => {
  const [currentEncode, setCurrentEncode] = useState('Hex');
  const dataEncode = [
    { label: 'Binary (base 2)', value: 'Bin' },
    { label: 'Hexadecimal (base 16)', value: 'Hex' },
    { label: 'Base64 (base 64)', value: 'Base64' },
    { label: 'Base64url (base 64 with url safe chars)', value: 'Base64url' },
  ];
  const algoNames: AlgoNames[] = useMemo(
    () => [
      'MD5',
      'SHA1',
      'SHA256',
      'SHA224',
      'SHA512',
      'SHA384',
      'SHA3',
      'RIPEMD160',
    ],
    []
  );

  const convertHexToBin = useCallback((hex: string) => {
    return hex
      .trim()
      .split('')
      .map((byte) => Number.parseInt(byte, 16).toString(2).padStart(4, '0'))
      .join('');
  }, []);

  const base64UrlEncode = useCallback((wordArray: lib.WordArray) => {
    // Standard base64, then replace chars for URL safe
    return wordArray
      .toString(enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }, []);

  const [clearText, setClearText] = useState('');

  const formatWithEncoding = useCallback(
    (words: lib.WordArray, encoding: Encoding) => {
      if (encoding === 'Bin') {
        return convertHexToBin(words.toString(enc.Hex));
      }
      if (encoding === 'Base64url') {
        return base64UrlEncode(words);
      }
      return words.toString(enc[encoding]);
    },
    [convertHexToBin, base64UrlEncode]
  );

  const hashResults = useMemo(() => {
    const results: Record<AlgoNames, string> = {} as Record<AlgoNames, string>;
    algoNames.forEach((algo) => {
      results[algo] = formatWithEncoding(
        algoFns[algo](clearText),
        currentEncode as Encoding
      );
    });
    return results;
  }, [algoNames, clearText, currentEncode, formatWithEncoding]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <PageTitleSection
        title="Hash text"
        description="Hash a text string using the function you need : MD5, SHA1, SHA256, SHA224, SHA512, SHA384, SHA3 or RIPEMD160"
      />
      <div className="max-w-[600px] mx-auto bg-white rounded shadow-md px-6 py-5">
        <div className="flex flex-col w-full">
          <label className="mb-[5px] text-left pr-3 text-[14px]">
            Your text to hash:
          </label>
          <div className="resize-y overflow-hidden pr-1 pl-3 border border-gray-300 rounded flex items-center">
            <textarea
              className="w-full word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none"
              placeholder="Your string to hash..."
              value={clearText}
              onChange={(e) => setClearText(e.target.value)}
              style={{
                paddingRight: 8,
                paddingLeft: 8,
                height: 'auto',
                minHeight: 69,
                overflowY: 'auto',
              }}
              rows={1}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
          </div>
        </div>
        <div className="relative flex w-full text-black my-6 h-[1px]"></div>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-[5px] text-left pr-3 text-[14px]">
            Digest encoding
          </label>
          <LanguageSelector
            data={dataEncode}
            currentSelect={currentEncode}
            onSelectChange={setCurrentEncode}
            width="w-full"
          />
        </div>

        {algoNames.map((algo) => (
          <div key={algo} className="my-[5px] mx-0">
            <div className="flex w-full ">
              <div
                style={{ flex: '0 0 120px' }}
                className="px-3 bg-gray-100 text-[14px] border border-gray-200 rounded leading-[34px]"
              >
                {algo}
              </div>
              <div className="flex items-center gap-2 px-3 bg-white border border-gray-300 rounded leading-[34px] w-full">
                <input
                  type="text"
                  className="flex-1 border-gray-300 rounded leading-[34px] text-[14px] outline-none"
                  value={hashResults[algo]}
                  readOnly
                />

                <div
                  className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer focus:border-green-500"
                  onClick={() => handleCopy(hashResults[algo])}
                >
                  <Copy size={14} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HashText;

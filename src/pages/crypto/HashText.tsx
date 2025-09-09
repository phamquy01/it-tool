import LanguageSelector from '../../components/Selector';
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
import Input from '../../components/Input';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      <div className="max-w-[600px] mx-auto bg-white dark:bg-zinc-900 rounded shadow-md px-6 py-5">
        <div className="flex flex-col w-full">
          <label className="mb-[5px] text-left pr-3 text-[14px] text-black dark:text-zinc-200">
            {t('hash_text.input_title')}
          </label>
          <div className="input-wrapper resize-y overflow-hidden pr-1 pl-3 border border-gray-300 dark:border-zinc-700 rounded flex items-center bg-white dark:bg-zinc-800">
            <textarea
              className="w-full word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none bg-white dark:bg-zinc-800 text-black dark:text-zinc-200"
              placeholder={t('hash_text.input_placeholder')}
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
        <div className="relative flex w-full my-6 h-[1px] bg-gray-200 dark:bg-zinc-700"></div>
        <div className="flex flex-col w-full mb-4">
          <label className="mb-[5px] text-left pr-3 text-[14px] text-black dark:text-zinc-200">
            {t('hash_text.digest_encoding')}
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
                className="px-3 bg-gray-100 dark:bg-zinc-800 text-[14px] border border-gray-200 dark:border-zinc-700 rounded leading-[34px] text-black dark:text-zinc-200"
              >
                {algo}
              </div>
              <Input
                type="text"
                className="flex-1 border-gray-300 dark:border-zinc-700 rounded leading-[34px] text-[14px] outline-none bg-white dark:bg-zinc-800 text-black dark:text-zinc-200"
                value={hashResults[algo]}
                readOnly
                actions={[
                  {
                    icon: <Copy size={14} />,
                    onClick: () => handleCopy(hashResults[algo]),
                  },
                ]}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HashText;

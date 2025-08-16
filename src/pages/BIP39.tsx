import { useState } from 'react';
import {
  chineseSimplifiedWordList,
  chineseTraditionalWordList,
  czechWordList,
  englishWordList,
  entropyToMnemonic,
  frenchWordList,
  generateEntropy,
  italianWordList,
  japaneseWordList,
  koreanWordList,
  mnemonicToEntropy,
  portugueseWordList,
  spanishWordList,
} from '@it-tools/bip39';

const languages = {
  English: englishWordList,
  'Chinese simplified': chineseSimplifiedWordList,
  'Chinese traditional': chineseTraditionalWordList,
  Czech: czechWordList,
  French: frenchWordList,
  Italian: italianWordList,
  Japanese: japaneseWordList,
  Korean: koreanWordList,
  Portuguese: portugueseWordList,
  Spanish: spanishWordList,
};

const languageOptions = Object.keys(languages);

const BIP39 = () => {
  const [language, setLanguage] = useState<keyof typeof languages>('English');
  const [entropy, setEntropy] = useState<string>(generateEntropy());
  const [mnemonic, setMnemonic] = useState<string>(
    entropyToMnemonic(generateEntropy(), languages[language])
  );
  const [entropyError, setEntropyError] = useState<string>('');
  const [mnemonicError, setMnemonicError] = useState<string>('');

  // Validate entropy
  const validateEntropy = (value: string) => {
    if (value.length < 16 || value.length > 32 || value.length % 4 !== 0) {
      return 'Entropy length should be >= 16, <= 32 and be a multiple of 4';
    }
    if (!/^[a-fA-F0-9]*$/.test(value)) {
      return 'Entropy should be an hexadecimal string';
    }
    return '';
  };

  // Validate mnemonic
  const validateMnemonic = (value: string) => {
    try {
      mnemonicToEntropy(value, languages[language]);
      return '';
    } catch {
      return 'Invalid mnemonic';
    }
  };

  // When entropy changes, update mnemonic
  const handleEntropyChange = (value: string) => {
    setEntropy(value);
    const error = validateEntropy(value);
    setEntropyError(error);
    if (!error) {
      try {
        setMnemonic(entropyToMnemonic(value, languages[language]));
        setMnemonicError('');
      } catch {
        setMnemonic('');
        setMnemonicError('Invalid entropy');
      }
    } else {
      setMnemonic('');
    }
  };

  // When mnemonic changes, update entropy
  const handleMnemonicChange = (value: string) => {
    setMnemonic(value);
    const error = validateMnemonic(value);
    setMnemonicError(error);
    if (!error) {
      try {
        setEntropy(mnemonicToEntropy(value, languages[language]));
        setEntropyError('');
      } catch {
        setEntropy('');
        setEntropyError('Invalid mnemonic');
      }
    } else {
      setEntropy('');
    }
  };

  // When language changes, update mnemonic/entropy
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as keyof typeof languages;
    setLanguage(lang);
    try {
      setMnemonic(entropyToMnemonic(entropy, languages[lang]));
      setMnemonicError('');
    } catch {
      setMnemonic('');
      setMnemonicError('Invalid entropy for this language');
    }
  };

  // Refresh entropy
  const handleRefreshEntropy = () => {
    const newEntropy = generateEntropy();
    setEntropy(newEntropy);
    setMnemonic(entropyToMnemonic(newEntropy, languages[language]));
    setEntropyError('');
    setMnemonicError('');
  };

  // Copy helpers
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-[600px] mx-auto bg-white rounded shadow-md px-6 py-5">
      <h2 className="text-xl font-bold mb-4">BIP39 Passphrase Generator</h2>
      <div className="flex flex-col w-full mb-4">
        <label className="mb-[5px] text-left pr-3 text-[14px]">Language</label>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="border border-gray-300 rounded px-3 py-2 text-[14px] outline-none bg-white w-full"
        >
          {languageOptions.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-full mb-4">
        <label className="mb-[5px] text-left pr-3 text-[14px]">
          Entropy (seed)
        </label>
        <div className="flex w-full gap-2">
          <input
            value={entropy}
            onChange={(e) => handleEntropyChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded leading-[34px] text-[14px] outline-none px-3 py-2 bg-white"
            placeholder="Your entropy..."
          />
          <button
            onClick={handleRefreshEntropy}
            className="w-[34px] h-[34px] rounded-full border border-transparent bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 cursor-pointer"
            title="Refresh"
          >
            <span role="img" aria-label="refresh">
              🔄
            </span>
          </button>
          <button
            onClick={() => handleCopy(entropy)}
            className="w-[34px] h-[34px] rounded-full border border-transparent bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 cursor-pointer"
            title="Copy"
          >
            <span role="img" aria-label="copy">
              📋
            </span>
          </button>
        </div>
        {entropyError && (
          <div className="text-red-600 text-xs mt-1">{entropyError}</div>
        )}
      </div>
      <div className="flex flex-col w-full mb-4">
        <label className="mb-[5px] text-left pr-3 text-[14px]">
          Passphrase (mnemonic)
        </label>
        <div className="flex w-full gap-2">
          <input
            value={mnemonic}
            onChange={(e) => handleMnemonicChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded leading-[34px] text-[14px] outline-none px-3 py-2 bg-white"
            placeholder="Your mnemonic..."
          />
          <button
            onClick={() => handleCopy(mnemonic)}
            className="w-[34px] h-[34px] rounded-full border border-transparent bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 cursor-pointer"
            title="Copy"
          >
            <span role="img" aria-label="copy">
              📋
            </span>
          </button>
        </div>
        {mnemonicError && (
          <div className="text-red-600 text-xs mt-1">{mnemonicError}</div>
        )}
      </div>
    </div>
  );
};

export default BIP39;

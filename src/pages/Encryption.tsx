import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js';

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
  //   const [cypherOutput, setCypherOutput] = useState('');

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
      <div className="max-w-[600px] py-10 bg-white rounded-lg shadow-md p-6">
        <div className=" flex justify-between items-baseline gap-4 mb-6">
          <div className="flex flex-col w-full h-full">
            <label className="mb-[5px] text-left pr-3 text-[14px]">
              Your text:
            </label>
            <div className="resize-y overflow-hidden pr-1 pl-3 border border-gray-300 rounded flex items-center">
              <textarea
                className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal"
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
              <div className="flex items-center gap-2 px-3 bg-white border border-gray-300 rounded w-full">
                <input
                  type="text"
                  className="w-full word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal"
                  value={cypherSecret}
                  onChange={(e) => setCypherSecret(e.target.value)}
                />

                <div
                  className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer focus:border-green-500"
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
            <div className="resize-y overflow-hidden pr-1 pl-3 border border-gray-300 rounded flex items-center">
              <textarea
                className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal"
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

      <div className="max-w-[600px] py-10 bg-white rounded-lg shadow-md p-6">
        <div className=" flex justify-between items-baseline gap-4 mb-6">
          <div className="flex flex-col w-full h-full">
            <label className="mb-[5px] text-left pr-3 text-[14px]">
              Your text:
            </label>
            <div className="resize-y overflow-hidden pr-1 pl-3 border border-gray-300 rounded flex items-center">
              <textarea
                className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal"
                placeholder="The string to cypher"
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
                Your secret key:
              </label>
              <div className="flex items-center gap-2 px-3 bg-white border border-gray-300 rounded w-full">
                <input
                  type="text"
                  className="w-full word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal"
                  value={decryptSecret}
                  onChange={(e) => setDecryptSecret(e.target.value)}
                />

                <div
                  className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer focus:border-green-500"
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
                Encryption algorithm:
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
              Your decrypted text:
            </label>
            <div className="resize-y overflow-hidden pr-1 pl-3 border border-gray-300 rounded flex items-center">
              <textarea
                className="w-full min-h-[100px] word-break whitespace-pre-wrap border-none outline-none text-[14px] py-2 resize-none font-mono font-normal"
                placeholder="your string hash"
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

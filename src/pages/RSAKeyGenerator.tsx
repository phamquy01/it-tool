import { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import forge from 'node-forge';

const RSAKeyGenerator = () => {
  const [bit, setBit] = useState(2048);
  const [toast, setToast] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');

  useEffect(() => {
    generateKeyPair(bit);
  }, []);

  useEffect(() => {
    generateKeyPair(bit);
  }, [bit]);

  function generateKeyPair(bits: number) {
    try {
      const keypair = forge.pki.rsa.generateKeyPair({ bits, e: 0x10001 });
      setPrivateKey(forge.pki.privateKeyToPem(keypair.privateKey));
      setPublicKey(forge.pki.publicKeyToPem(keypair.publicKey));
    } catch {
      setPrivateKey('');
      setPublicKey('');
    }
  }

  const handleRefreshKeyPair = () => {
    generateKeyPair(bit);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast('Đã copy!');
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <label className="mb-[5px] text-sm pr-3 text-right">Bits:</label>
        <input
          id="bits"
          type="number"
          min={512}
          max={4096}
          step={8}
          placeholder="Bits..."
          value={bit}
          onChange={(e) => setBit(Number(e.target.value))}
          className="text-sm py-2 outline-none text-black bg-white border border-gray-300 rounded px-3 w-[80px]"
        />
        <button
          onClick={handleRefreshKeyPair}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer "
        >
          Refresh key pair
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col relative">
          <label className="text-base font-bold mb-1">Public Key:</label>
          <div className="relative">
            <textarea
              className="border rounded p-2 bg-white text-black text-sm font-mono resize-none w-full pr-10"
              readOnly
              value={publicKey}
              style={{
                height: 'auto',
                minHeight: 80,
                maxHeight: 600,
                overflowY: 'auto',
              }}
              rows={publicKey ? Math.max(8, publicKey.split('\n').length) : 8}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
            <button
              type="button"
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
              onClick={() => handleCopy(publicKey)}
              tabIndex={-1}
            >
              <Copy size={16} color="#22c55e" />
            </button>
          </div>
        </div>
        <div className="flex flex-col relative">
          <label className="text-base font-bold mb-1">Private Key:</label>
          <div className="relative">
            <textarea
              className="border rounded p-2 bg-white text-black text-sm font-mono resize-none w-full pr-10"
              readOnly
              value={privateKey}
              style={{
                height: 'auto',
                minHeight: 80,
                maxHeight: 600,
                overflowY: 'auto',
              }}
              rows={privateKey ? Math.max(8, privateKey.split('\n').length) : 8}
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
            <button
              type="button"
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
              onClick={() => handleCopy(privateKey)}
              tabIndex={-1}
            >
              <Copy size={16} color="#22c55e" />
            </button>
          </div>
        </div>
      </div>
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

export default RSAKeyGenerator;

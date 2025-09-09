import { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import forge from 'node-forge';
import workerScript from 'node-forge/dist/prime.worker.min.js?url';
import { useTranslation } from 'react-i18next';

const RSAKeyGenerator = () => {
  const { t } = useTranslation();
  const [bit, setBit] = useState(2048);
  const [toast, setToast] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleRefreshKeyPair();
  }, [bit]);

  const generateKeyPair = async (bits: number) => {
    return new Promise<{ privateKeyPem: string; publicKeyPem: string }>(
      (resolve, reject) => {
        forge.pki.rsa.generateKeyPair(
          { bits, workerScript },
          (err, keypair) => {
            if (err) {
              reject(err);
              return;
            }
            resolve({
              privateKeyPem: forge.pki.privateKeyToPem(keypair.privateKey),
              publicKeyPem: forge.pki.publicKeyToPem(keypair.publicKey),
            });
          }
        );
      }
    );
  };

  const handleRefreshKeyPair = async () => {
    setLoading(true);
    try {
      const { privateKeyPem, publicKeyPem } = await generateKeyPair(bit);
      setPrivateKey(privateKeyPem);
      setPublicKey(publicKeyPem);
    } catch {
      setPrivateKey('');
      setPublicKey('');
    }
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast(t('copied_to_clipboard'));
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="mb-20 flex items-center gap-3 justify-center">
        <label className="mb-[5px] text-sm pr-3 text-right">
          {t('rsa_key_pair_generator.bits')}:
        </label>
        <input
          id="bits"
          type="number"
          min={256}
          max={16384}
          step={8}
          placeholder="Bits..."
          value={bit}
          onChange={(e) => setBit(Number(e.target.value))}
          className="text-sm py-2 outline-none text-black bg-white border border-gray-300 rounded px-3 w-[200px] dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
        />
        <button
          onClick={handleRefreshKeyPair}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-sm cursor-pointer dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
        >
          {t('rsa_key_pair_generator.refresh_key_pair')}
        </button>
      </div>

      {/* Hiển thị key */}
      <div className="flex flex-col 2xl:flex-row justify-center gap-4 max-w-[600px] mx-auto">
        <KeyBlock
          label={t('rsa_key_pair_generator.public_key')}
          value={publicKey}
          onCopy={handleCopy}
        />
        <KeyBlock
          label={t('rsa_key_pair_generator.private_key')}
          value={privateKey}
          onCopy={handleCopy}
        />
      </div>

      {/* Toast */}
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
          <span style={{ fontSize: 14 }}>{toast}</span>
        </div>
      )}
    </div>
  );
};

const KeyBlock = ({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (t: string) => void;
}) => (
  <div className="flex flex-col relative">
    <label className="text-base font-bold mb-4">{label}:</label>
    <div className="relative">
      <textarea
        className="min-w-[300px] lg:min-w-[600px] h-fit bg-white rounded shadow-md px-6 py-5 w-full border border-gray-300 text-black text-sm font-mono resize-none dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
        readOnly
        value={value}
        style={{
          height: 'auto',
          minHeight: 80,
          maxHeight: 600,
          overflowY: 'auto',
        }}
        rows={value ? Math.max(8, value.split('\n').length) : 8}
      />
      <button
        type="button"
        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-all dark:bg-zinc-800 dark:hover:bg-zinc-700"
        onClick={() => onCopy(value)}
        tabIndex={-1}
      >
        <Copy size={16} color="#22c55e" />
      </button>
    </div>
  </div>
);

export default RSAKeyGenerator;

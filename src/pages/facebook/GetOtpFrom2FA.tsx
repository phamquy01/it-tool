'use client';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../store/ToastContext';
import { trackUsage } from '../../utils/helpers/TrackUsage';

export default function TwoFA() {
  const [secret, setSecret] = useState('');
  const [otp, setOtp] = useState('');
  const { t } = useTranslation();
  const { showToast } = useToast();

  const generateOtp = async () => {
    const secrets = secret
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (secrets.length === 0) {
      setOtp('');
      return;
    }

    try {
      const promises = secrets.map(async (s) => {
        try {
          const res = await fetch('https://api.autozalo.com/api/totp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ '2fa': s }),
          });
          const data = await res.json();
          return `${s}|${data.otp || ''}`;
        } catch {
          return `${s}|`;
        }
      });
      const results = await Promise.all(promises);
      setOtp(results.join('\n'));
      trackUsage('Get OTP 2FA');
    } catch {
      setOtp('');
    }
  };

  return (
    <div className="flex flex-col max-w-[800px] mx-auto pb-10 gap-4">
      <p
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: t('get_otp_from_2fa.input_label') }}
      />

      <div className="textarea-wrapper mb-2 flex items-baseline relative w-full">
        <textarea
          className="custom-scroll text-sm px-3 py-2 outline-none w-full resize-none"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          rows={10}
          placeholder={t('get_otp_from_2fa.input_placeholder')}
        />
      </div>

      <button
        onClick={generateOtp}
        className={`px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-200 text-sm cursor-pointer text-white w-fit my-4 mx-auto ${
          !secret.trim() ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        {t('get_otp_from_2fa.button_generate_otp')}
      </button>

      <p
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: t('get_otp_from_2fa.output_label') }}
      />

      <div className="textarea-wrapper relative">
        <textarea
          readOnly
          value={otp}
          placeholder="ABC|2FA Code"
          className="px-3 py-2 custom-scroll w-full min-h-[250px] border border-zinc-300 dark:border-zinc-700 rounded text-lg bg-transparent text-zinc-900 dark:text-zinc-100 resize-none"
          style={{ whiteSpace: 'pre-wrap' }}
        />
        <button
          type="button"
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-all dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer"
          onClick={() => {
            if (otp) {
              {
                navigator.clipboard.writeText(otp);
                showToast(t('get_otp_from_2fa.copied_to_clipboard'));
              }
            }
          }}
          tabIndex={-1}
        >
          <Copy size={16} color="#22c55e" />
        </button>
      </div>
    </div>
  );
}

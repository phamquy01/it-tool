import { useState } from 'react';
import Input from '../../components/Input';
import { Copy } from 'lucide-react';
import { useToast } from '../../store/ToastContext';
import { useTranslation } from 'react-i18next';

const FindIdFacebook = () => {
  const [fbLink, setFbLink] = useState('');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { showToast } = useToast();
  const { t } = useTranslation();

  const trackUsage = async (type: string) => {
    try {
      await fetch(
        `https://lumipic.hieunk-demo.io.vn/api/it-tool/analytic?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ type }),
        }
      );
    } catch (error) {
      console.error('Failed to track usage:', error);
    }
  };

  const handleFindId = async () => {
    setLoading(true);
    setError('');
    setUid('');

    try {
      const res = await fetch('https://api.autozalo.com/api/findid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: fbLink.trim() }),
      });

      if (!res.ok) throw new Error('find_id_facebook.get_id_error');

      const data = await res.json();
      if (data && data.id) {
        setUid(data.id.toString());
        showToast(t('find_id_facebook.get_id_success'));
        trackUsage('Find Facebook ID');
      } else {
        setError('find_id_facebook.get_id_error');
      }
    } catch {
      setError('find_id_facebook.get_id_error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl flex flex-col justify-center w-full sm:px-6 lg:px-8 mx-auto my-8">
      <div className="font-medium text-base text-gray-900 dark:text-gray-100 border-b border-zinc-300 dark:border-zinc-700 pb-2">
        {t('find_id_facebook.title')}
      </div>

      <div className="w-full bg-white dark:bg-zinc-800 rounded shadow-md px-4 sm:px-6 py-5 mx-auto mt-4">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="fb-link"
            className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300"
          >
            {t('find_id_facebook.link_label')}
          </label>
          <div className="flex flex-col gap-4 input-wrapper pr-1 pl-3 border border-zinc-300 dark:border-zinc-700 rounded">
            <input
              id="fb-link"
              type="text"
              placeholder={t('find_id_facebook.link_placeholder')}
              value={fbLink}
              autoComplete="off"
              onChange={(e) => setFbLink(e.target.value)}
            />
          </div>
          <button
            className={`w-full px-4 py-1.5 bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-200 text-base font-semibold text-white ${
              loading || !fbLink.trim()
                ? ' opacity-60 cursor-not-allowed'
                : 'cursor-pointer'
            }`}
            onClick={handleFindId}
            disabled={loading || !fbLink.trim()}
          >
            {t('find_id_facebook.button_get_id')}
          </button>
          {error && (
            <div className="text-red-500 text-sm font-medium mt-2 text-center">
              {t(error)}
            </div>
          )}
          {uid && (
            <div className="flex flex-col items-center gap-2 mt-4">
              <Input
                type="text"
                readOnly
                value={uid}
                className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded font-mono text-lg text-center bg-transparent text-zinc-900 dark:text-zinc-100"
                actions={[
                  {
                    icon: <Copy size={14} />,
                    onClick: () => {
                      navigator.clipboard.writeText(uid);
                      showToast(t('common.copied_button'));
                    },
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindIdFacebook;

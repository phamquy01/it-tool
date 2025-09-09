import { useState } from 'react';
import { useToast } from '../../store/ToastContext';
import { useTranslation } from 'react-i18next';
import { trackUsage } from '../../utils/helpers/TrackUsage';

const FilterDataFromContent = () => {
  const [input, setInput] = useState('');
  const [phones, setPhones] = useState<string[]>([]);
  const [zaloLinks, setZaloLinks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { t } = useTranslation();

  const phoneRegex =
    /(^|[^\d])((?:\+84[\s.-]?(?:3[2-9]|5[2689]|7[06789]|8[1-9]|9\d)(?:[\s.-]?\d){7}|0(?:3[2-9]|5[2689]|7[06789]|8[1-9]|9\d)(?:[\s.-]?\d){7}))(?!\d)/g;

  const zaloRegex = /https?:\/\/(?:chat\.)?zalo\.me\/[a-zA-Z0-9/_-]+/g;

  const handleFilter = () => {
    setIsLoading(true);

    const rawPhones = input.match(phoneRegex) || [];
    const cleanedPhones = rawPhones.map((s) =>
      s.replace(/[\s.]/g, '').replace(/[^\d]/g, '')
    );

    const foundPhones = Array.from(new Set(cleanedPhones));
    const foundLinks = Array.from(
      new Set((input.match(zaloRegex) || []).map((s) => s.trim()))
    );
    setPhones(foundPhones);
    setZaloLinks(foundLinks);
    setIsLoading(false);
    trackUsage('Filter phone numbers and Zalo groups');
  };

  const handleCopyPhones = () => {
    if (phones.length) {
      navigator.clipboard.writeText(phones.join('\n'));
      showToast(t('filter_data.phone_copied'));
    }
  };

  const handleCopyZaloLinks = () => {
    if (zaloLinks.length) {
      navigator.clipboard.writeText(zaloLinks.join('\n'));
      showToast(t('filter_data.zalo_group_copied'));
    }
  };

  return (
    <div className="flex flex-col justify-center w-full sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl sm:px-6 mx-auto">
        <div className="font-medium text-base mb-5 text-center sm:text-left">
          {t('filter_data.input_title')}
        </div>
        {/* Input & Button */}
        <div className="flex flex-col items-center w-full gap-8">
          <div className="textarea-wrapper w-full">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={15}
              placeholder={t('filter_data.input_placeholder')}
              className="custom-scroll text-sm px-3 py-2 outline-none w-full"
            />
          </div>
          <button
            onClick={handleFilter}
            className={`px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-200 text-sm cursor-pointer text-white mb-8 ${
              isLoading || !input.trim() ? ' opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading
              ? t('filter_data.checking')
              : t('filter_data.button_check_phone_zalo')}
          </button>
        </div>

        {/* Results */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6 ">
          <div className="flex-1 ">
            <div className="input-wrapper flex flex-col items-center border-[#e0e0e69e] bg-white rounded px-1 border min-h-[220px] justify-center gap-6 md:gap-8 py-4 dark:bg-gray-900 dark:border-gray-700">
              {!phones.length ? (
                <div className="text-gray-500 text-center text-lg dark:text-gray-400">
                  {t('filter_data.no_content')}
                </div>
              ) : (
                <>
                  <div className="font-bold text-base md:text-xl text-red-600">
                    {t('filter_data.found_phones', { count: phones.length })}
                  </div>
                  <p className="text-xl md:text-2xl text-black font-bold dark:text-white">
                    {t('filter_data.phone_list')}
                  </p>
                  <button
                    onClick={handleCopyPhones}
                    className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-200 text-sm cursor-pointer text-white"
                  >
                    {t('filter_data.copy_phone')}
                  </button>
                  <ul className="list-inside">
                    {phones.map((phone, index) => (
                      <li
                        key={index}
                        className="text-black font-semibold flex items-center dark:text-white"
                      >
                        <span className="text-green-600 font-bold mr-2">
                          {index + 1}:
                        </span>
                        <span>{phone}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleCopyPhones}
                    className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-200 text-sm cursor-pointer text-white"
                  >
                    {t('filter_data.copy_phone')}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="input-wrapper flex flex-col items-center border-[#e0e0e69e] bg-white rounded px-1 border min-h-[220px] justify-center gap-6 md:gap-8 py-4 dark:bg-gray-900 dark:border-gray-700">
              {!zaloLinks.length ? (
                <div className="text-gray-500 text-center text-lg dark:text-gray-400">
                  {t('filter_data.no_content')}
                </div>
              ) : (
                <>
                  <div className="font-bold text-base md:text-xl text-red-600">
                    {t('filter_data.found_zalo_groups', {
                      count: zaloLinks.length,
                    })}
                  </div>
                  <p className="text-xl md:text-2xl text-black font-bold dark:text-white">
                    {t('filter_data.zalo_group_list')}
                  </p>
                  <button
                    onClick={handleCopyZaloLinks}
                    className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm cursor-pointer text-white"
                  >
                    {t('filter_data.copy_zalo_group')}
                  </button>

                  <ul className="list-inside">
                    {zaloLinks.map((link, index) => {
                      const cleanLink = link.replace(/^\[|\]$/g, '');
                      return (
                        <li
                          key={index}
                          className="text-black font-semibold flex items-start break-words whitespace-pre-wrap dark:text-white"
                        >
                          <span className="text-blue-600 font-bold mr-2 shrink-0">
                            {index + 1}:
                          </span>
                          <span className="break-words whitespace-pre-wrap">
                            {cleanLink}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    onClick={handleCopyZaloLinks}
                    className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm cursor-pointer text-white"
                  >
                    {t('filter_data.copy_zalo_group')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDataFromContent;

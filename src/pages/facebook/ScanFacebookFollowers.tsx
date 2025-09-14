import { useEffect, useState } from 'react';
import http from '../../services/http';
import { useToast } from '../../store/ToastContext';

import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { trackUsage } from '../../utils/helpers/TrackUsage';
import Preview from '../../components/preview';
import { debounce } from 'lodash';
import { EXPIRE_TIME } from '../../utils/constants/facebook-tool';
import type {
  FacebookFollowersData,
  ScanFacebookFollowersResponse,
} from '../../types/facebook/scan-facebook-follower';

const ScanFacebookFollowers = () => {
  const [cookie, setCookie] = useState('');
  const [proxy, setProxy] = useState('');
  const [uid, setUid] = useState('');
  const [limit, setLimit] = useState<number | string>(10);
  const [dataScanFacebookFollowers, setDataScanFacebookFollowers] = useState<
    FacebookFollowersData[] | null
  >(null);
  const [allFetchedPosts, setAllFetchedPosts] = useState<
    FacebookFollowersData[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [lastCursor, setLastCursor] = useState('');
  const [lastFbdtsg, setLastFbdtsg] = useState('');
  const [lastCollectionToken, setLastCollectionToken] = useState('');
  const [lastSearchParams, setLastSearchParams] = useState<{
    cookie: string;
    proxy: string;
    uid: string;
  } | null>(null);
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchData = async (
    cursor: string = '',
    fbdtsg: string = '',
    collectionToken: string = ''
  ) => {
    const res = await http.post<ScanFacebookFollowersResponse>(
      'https://api.autozalo.com/api/scan_facebook_follower',
      {
        cookie: cookie.trim(),
        proxy: proxy.trim(),
        uid: uid.trim(),
        cursor: cursor.trim(),
        fbdtsg: fbdtsg.trim(),
        collectionToken: collectionToken.trim(),
      }
    );
    return res;
  };

  const handleScan = async () => {
    setLoading(true);

    try {
      const currentParams = {
        cookie: cookie.trim(),
        proxy: proxy.trim(),
        uid: uid.trim(),
      };

      const isSameSearch =
        lastSearchParams &&
        lastSearchParams.cookie === currentParams.cookie &&
        lastSearchParams.proxy === currentParams.proxy &&
        lastSearchParams.uid === currentParams.uid;

      let allGroups: FacebookFollowersData[] = [];
      let cursor = '';
      let fbdtsg = '';
      let collectionToken = '';

      if (isSameSearch && allFetchedPosts.length > 0) {
        allGroups = [...allFetchedPosts];
        cursor = lastCursor;
        fbdtsg = lastFbdtsg;
        collectionToken = lastCollectionToken;
      } else {
        setDataScanFacebookFollowers([]);
        setAllFetchedPosts([]);
        setLastCursor('');
        setLastFbdtsg('');
        setLastCollectionToken('');
        allGroups = [];
        cursor = '';
        fbdtsg = '';
        collectionToken = '';
      }

      const targetLimit = Number(limit);

      if (allGroups.length >= targetLimit) {
        setDataScanFacebookFollowers([...allGroups.slice(0, targetLimit)]);
        showToast('scan_facebook_follower.fetch_success', 'success');
        return;
      }

      if (allGroups.length > 0) {
        setDataScanFacebookFollowers([...allGroups]);
      }

      let hasMore = true;

      while (hasMore && allGroups.length < targetLimit) {
        const res = await fetchData(cursor, fbdtsg, collectionToken);

        if (res.data?.error && res.data?.error !== '') {
          showToast('common.error_fetching_data', 'error');
          return;
        }

        const groups = res.data?.data ?? [];

        const uniqueGroups = groups.filter(
          (newGroup) =>
            !allGroups.some((existingGroup) => existingGroup.id === newGroup.id)
        );

        allGroups.push(...uniqueGroups);

        setAllFetchedPosts([...allGroups]);

        setDataScanFacebookFollowers([...allGroups.slice(0, targetLimit)]);

        cursor = (res.data?.cursor ?? '').trim();
        fbdtsg = (res.data?.fbdtsg ?? '').trim();
        collectionToken = (res.data?.collectionToken ?? '').trim();

        setLastCursor(cursor);
        setLastFbdtsg(fbdtsg);
        setLastCollectionToken(collectionToken);
        setLastSearchParams(currentParams);

        await new Promise((resolve) => setTimeout(resolve, 300));

        setTimeout(() => {
          const tableContainer = document.querySelector('.overflow-y-auto');
          if (tableContainer) {
            tableContainer.scrollTop = tableContainer.scrollHeight;
          }
        }, 50);

        hasMore = !!cursor && allGroups.length < targetLimit;
      }

      trackUsage('Scan Post by Keyword');
      showToast('scan_facebook_follower.scan_success', 'success');
    } catch (err) {
      showToast(`Lỗi: ${String(err)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    try {
      const excelData = dataScanFacebookFollowers
        ? dataScanFacebookFollowers.map((post, index) => ({
            STT: index + 1,
            [t('scan_facebook_follower.avatar_follower')]: post.avatar,
            [t('scan_facebook_follower.uid')]: post.id,
            [t('scan_facebook_follower.name_follower')]: post.name,
          }))
        : [];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      const columnWidths = [
        { wch: 10 },
        { wch: 40 },
        { wch: 60 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
      ];
      worksheet['!cols'] = columnWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Posts');

      const timestamp = new Date()
        .toLocaleDateString('vi-VN')
        .replace(/\//g, '-');
      const fileName = `Facebook_follower_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      showToast('scan_facebook_follower.export_success', 'success');
    } catch (error) {
      console.error('Lỗi xuất Excel:', error);
      showToast('Có lỗi xảy ra khi xuất file Excel', 'error');
    }
  };

  useEffect(() => {
    const saveState = debounce(() => {
      const stateToSave = {
        cookie,
        proxy,
        uid,
        limit,
        lastCursor,
        lastFbdtsg,
        lastCollectionToken,
        lastSearchParams,
        allFetchedGroups: allFetchedPosts,
        data: dataScanFacebookFollowers || [],
        timestamp: Date.now(),
      };
      localStorage.setItem(
        'scanFacebookFollowerState',
        JSON.stringify(stateToSave)
      );
    }, 500);

    saveState();

    return () => {
      saveState.cancel();
    };
  }, [
    cookie,
    proxy,
    uid,
    limit,
    dataScanFacebookFollowers,
    lastCursor,
    lastFbdtsg,
    lastCollectionToken,
    lastSearchParams,
    allFetchedPosts,
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('scanFacebookFollowerState');
    if (!saved) return;
    const parsed = saved ? JSON.parse(saved) : {};
    if (Date.now() - parsed.timestamp > EXPIRE_TIME) {
      localStorage.removeItem('scanFacebookFollowerState');
      return;
    }

    setCookie(parsed.cookie || '');
    setProxy(parsed.proxy || '');
    setUid(parsed.uid || '');
    setLimit(parsed.limit || 10);
    setLastCursor(parsed.lastCursor || '');
    setLastFbdtsg(parsed.lastFbdtsg || '');
    setLastCollectionToken(parsed.lastCollectionToken || '');
    setLastSearchParams(parsed.lastSearchParams || null);
    setAllFetchedPosts(parsed.allFetchedPosts || []);
    setDataScanFacebookFollowers(parsed.data || []);
  }, []);

  return (
    <div className="min-w-0 w-full overflow-hidden">
      <div className="w-full max-w-full mx-auto bg-slate-50 dark:bg-zinc-800 rounded-xl shadow-md p-3 sm:p-4 md:p-6 border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="space-y-3 sm:space-y-4 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
            <div className="lg:col-span-2 min-w-0">
              <div className="flex justify-between items-start min-w-0">
                <label
                  className={`block text-xs font-medium mb-1.5 text-slate-700 dark:text-zinc-200 transition-opacity duration-200 flex-shrink-0 ${
                    loading ? 'opacity-50' : ''
                  }`}
                >
                  {t('scan_facebook_follower.cookie')}
                </label>
                <label
                  className={`block text-xs font-medium mb-1.5 text-green-700 dark:text-zinc-200 transition-opacity duration-200 cursor-pointer hover:text-green-500 active:scale-95 flex-shrink-0 ml-2`}
                  style={{ transition: 'color 0.2s, transform 0.1s' }}
                  onClick={() =>
                    window.open(
                      'https://www.youtube.com/watch?v=ith6sgn0mLs',
                      '_blank'
                    )
                  }
                >
                  {t('scan_facebook_follower.cookie_guide')}
                </label>
              </div>
              <div
                className={`flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full min-w-0 transition-opacity duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  value={cookie}
                  onChange={(e) => {
                    setCookie(e.target.value);
                  }}
                  placeholder={t('common.input_placeholder')}
                  className="w-full py-2 text-xs bg-transparent outline-none min-w-0"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="min-w-0">
              <label
                className={`block text-xs font-medium mb-1.5 text-slate-700 dark:text-zinc-200 transition-opacity duration-200 ${
                  loading ? 'opacity-50' : ''
                }`}
              >
                {t('scan_facebook_follower.proxy')}
              </label>
              <div
                className={`flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full min-w-0 transition-opacity duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  value={proxy}
                  onChange={(e) => {
                    setProxy(e.target.value);
                  }}
                  placeholder={t('common.input_placeholder')}
                  className="w-full py-2 text-xs bg-transparent outline-none min-w-0"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 min-w-0">
            <div className="lg:col-span-2 min-w-0">
              <label
                className={`block text-xs font-medium mb-1.5 text-slate-700 dark:text-zinc-200 transition-opacity duration-200 ${
                  loading ? 'opacity-50' : ''
                }`}
              >
                {t('scan_facebook_follower.uid')}
              </label>
              <div
                className={`flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full min-w-0 transition-opacity duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  value={uid}
                  onChange={(e) => {
                    setUid(e.target.value);
                  }}
                  placeholder={t('common.input_placeholder')}
                  className="w-full py-2 text-xs bg-transparent outline-none min-w-0"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="min-w-0">
              <label
                className={`block text-xs font-medium mb-1.5 text-slate-700 dark:text-zinc-200 transition-opacity duration-200 ${
                  loading ? 'opacity-50' : ''
                }`}
              >
                {t('scan_facebook_follower.limit')}
              </label>
              <div
                className={`flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full min-w-0 transition-opacity duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  type="number"
                  value={limit}
                  onChange={(e) =>
                    setLimit(e.target.value ? Number(e.target.value) : '')
                  }
                  min={1}
                  max={9999}
                  className="w-full py-2 text-xs bg-transparent outline-none min-w-0"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:flex-row justify-between items-center ">
            <div className="flex items-center gap-2 w-full">
              <button
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md shadow-sm cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium min-w-0"
                onClick={handleScan}
                disabled={
                  loading || (!cookie.trim() && !uid.trim() && !proxy.trim())
                }
              >
                {loading && (
                  <svg
                    className="animate-spin -ml-1 mr-1 h-3 w-3 text-white flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                <span className="truncate">
                  {loading ? (
                    <>{t('scan_facebook_group.scanning')}</>
                  ) : (
                    <>{t('scan_facebook_group.button_scan')}</>
                  )}
                </span>
              </button>
              <button
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-md shadow-sm cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium min-w-0"
                onClick={handleExportExcel}
                disabled={
                  loading ||
                  !dataScanFacebookFollowers ||
                  dataScanFacebookFollowers.length === 0
                }
              >
                <svg
                  className="h-3 w-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="truncate">
                  {t('scan_facebook_group.button_export')}
                </span>
              </button>
            </div>

            {dataScanFacebookFollowers &&
              dataScanFacebookFollowers.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-zinc-800 dark:to-zinc-800 rounded-lg p-3 border border-green-200 dark:border-zinc-700 w-full lg:w-auto">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                      <div className="text-sm font-semibold text-green-700 dark:text-green-400 truncate">
                        {t('scan_facebook_follower.total_followers_found')} :{' '}
                      </div>
                      <span className="text-sm font-bold text-green-700 dark:text-green-400 w-max">
                        {' '}
                        {dataScanFacebookFollowers.length}{' '}
                        {t('scan_facebook_follower.followers')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="space-y-2 min-w-0">
              <div className="flex items-center justify-between min-w-0">
                <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
                  {t('scan_facebook_follower.scanning')}
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 flex-shrink-0 ml-2">
                  {dataScanFacebookFollowers?.length || 0}/{limit}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-1.5 min-w-0">
                <div
                  className="bg-green-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.min(
                      ((dataScanFacebookFollowers?.length || 0) /
                        Number(limit)) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-6 min-w-0 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {!dataScanFacebookFollowers ||
            dataScanFacebookFollowers.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 dark:text-slate-300 py-10 text-sm font-medium">
                {t('common.no_data')}
              </div>
            ) : (
              dataScanFacebookFollowers.map((friend, index) => (
                <div
                  key={friend.id}
                  className="group bg-white dark:bg-zinc-700 rounded-2xl 
                   shadow-sm dark:shadow-[0_2px_10px_rgba(0,0,0,0.6)] 
                   border border-slate-200 dark:border-zinc-600 
                   p-4 sm:p-5 flex items-center gap-4 
                   hover:shadow-lg hover:dark:shadow-[0_4px_14px_rgba(0,0,0,0.8)] 
                   hover:-translate-y-1 transition-all duration-300 ease-out 
                   animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={friend.avatar?.trim()}
                      alt={friend.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover 
                       border border-slate-200 dark:border-zinc-500 
                       transition-transform duration-300 
                       group-hover:scale-110 cursor-pointer"
                      onClick={() => {
                        setSelectedImage(friend.avatar.trim());
                        setOpen(true);
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-zinc-700"></span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm sm:text-base font-semibold text-slate-800 dark:text-zinc-100 truncate cursor-pointer hover:text-green-600"
                      title={friend.name}
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/${friend.id}`,
                          '_blank'
                        );
                      }}
                    >
                      {friend.name}
                    </p>
                    <p
                      className="text-xs sm:text-sm text-slate-500 dark:text-zinc-300 truncate cursor-pointer hover:underline max-w-[180px] sm:max-w-[220px]"
                      title={friend.id}
                      onClick={() => {
                        window.open(
                          `https://www.facebook.com/${friend.id}`,
                          '_blank'
                        );
                      }}
                    >
                      {friend.id}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Preview isOpen={open} onClose={() => setOpen(false)}>
            <img
              src={
                selectedImage || 'https://source.unsplash.com/random/800x600'
              }
              alt="Preview"
              className="max-w-full max-h-[80vh] rounded"
            />
          </Preview>
        </div>
      </div>
    </div>
  );
};

export default ScanFacebookFollowers;

import { useEffect, useState } from 'react';
import http from '../../services/http';
import { useToast } from '../../store/ToastContext';
import {
  GROUP_PRIVACY,
  type GroupKeywordData,
  type ScanGroupKeywordResponse,
} from '../../types/scan-facebook-group';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import { trackUsage } from '../../utils/helpers/TrackUsage';
import Preview from '../../components/preview';
import { debounce } from 'lodash';

const ScanFbGroupByKeyword = () => {
  const [cookie, setCookie] = useState('');
  const [proxy, setProxy] = useState('');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState<number | string>(10);
  const [dataScanFacebookGroup, setDataScanFacebookGroup] = useState<
    GroupKeywordData[] | null
  >(null);
  const [allFetchedGroups, setAllFetchedGroups] = useState<GroupKeywordData[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [lastCursor, setLastCursor] = useState('');
  const [lastSearchParams, setLastSearchParams] = useState<{
    cookie: string;
    proxy: string;
    keyword: string;
  } | null>(null);
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchData = async (cursor: string = '') => {
    const res = await http.post<ScanGroupKeywordResponse>(
      'https://api.autozalo.com/api/scan_group_keyword',
      {
        cookie: cookie.trim(),
        proxy: proxy.trim(),
        keyword: keyword.trim(),
        cursor: cursor.trim(),
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
        keyword: keyword.trim(),
      };

      const isSameSearch =
        lastSearchParams &&
        lastSearchParams.cookie === currentParams.cookie &&
        lastSearchParams.proxy === currentParams.proxy &&
        lastSearchParams.keyword === currentParams.keyword;

      let allGroups: GroupKeywordData[] = [];
      let cursor = '';

      if (isSameSearch && allFetchedGroups.length > 0) {
        allGroups = [...allFetchedGroups];
        cursor = lastCursor;
      } else {
        setDataScanFacebookGroup([]);
        setAllFetchedGroups([]);
        setLastCursor('');
        allGroups = [];
        cursor = '';
      }

      const targetLimit = Number(limit);

      if (allGroups.length >= targetLimit) {
        setDataScanFacebookGroup([...allGroups.slice(0, targetLimit)]);
        showToast('scan_facebook_group.fetch_success', 'success');
        return;
      }

      if (allGroups.length > 0) {
        setDataScanFacebookGroup([...allGroups]);
      }

      let hasMore = true;

      while (hasMore && allGroups.length < targetLimit) {
        const res = await fetchData(cursor);

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

        setAllFetchedGroups([...allGroups]);

        setDataScanFacebookGroup([...allGroups.slice(0, targetLimit)]);

        cursor = (res.data?.cursor ?? '').trim();
        setLastCursor(cursor);
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

      trackUsage('Scan Groups by Keyword');
      showToast('scan_facebook_group.scan_success', 'success');
    } catch (err) {
      showToast(`Lỗi: ${String(err)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!dataScanFacebookGroup || dataScanFacebookGroup.length === 0) {
      showToast('Không có dữ liệu để xuất', 'error');
      return;
    }

    try {
      const excelData = dataScanFacebookGroup.map((group, index) => ({
        STT: index + 1,
        [t('scan_facebook_group.name_group')]: group.name,
        [t('scan_facebook_group.link_group')]: group.url,
        [t('scan_facebook_group.id_group')]: group.id,
        [t('scan_facebook_group.member_group')]: group.member,
        [t('scan_facebook_group.privacy_group')]: group.privacy,
        [t('scan_facebook_group.description_group')]: group.description || '',
      }));

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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Facebook Groups');

      const timestamp = new Date()
        .toLocaleDateString('vi-VN')
        .replace(/\//g, '-');
      const fileName = `Facebook_Groups_${keyword}_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      showToast('scan_facebook_group.export_success', 'success');
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
        keyword,
        limit,
        lastCursor,
        lastSearchParams,
        allFetchedGroups: allFetchedGroups || [],
        data: dataScanFacebookGroup || [],
      };
      localStorage.setItem('scanFbGroupState', JSON.stringify(stateToSave));
    }, 500);

    saveState();

    return () => {
      saveState.cancel();
    };
  }, [
    cookie,
    proxy,
    keyword,
    limit,
    dataScanFacebookGroup,
    lastCursor,
    lastSearchParams,
    allFetchedGroups,
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('scanFbGroupState');
    const parsed = saved ? JSON.parse(saved) : {};

    setCookie(parsed.cookie || '');
    setProxy(parsed.proxy || '');
    setKeyword(parsed.keyword || '');
    setLimit(parsed.limit || 10);
    setLastCursor(parsed.lastCursor || '');
    setLastSearchParams(parsed.lastSearchParams || null);
    setAllFetchedGroups(parsed.allFetchedGroups || []);
    setDataScanFacebookGroup(parsed.data || []);
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
                  {t('scan_facebook_group.cookie')}
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
                  {t('scan_facebook_group.cookie_guide')}
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
                {t('scan_facebook_group.proxy')}
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
                {t('scan_facebook_group.keyword')}
              </label>
              <div
                className={`flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full min-w-0 transition-opacity duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
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
                {t('scan_facebook_group.limit')}
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 min-w-0">
            <div className="lg:col-span-3 min-w-0">
              <div className="flex items-center gap-2 w-full">
                <button
                  className="max-w flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md shadow-sm cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium min-w-0"
                  onClick={handleScan}
                  disabled={
                    loading ||
                    (!cookie.trim() && !keyword.trim() && !proxy.trim())
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
                  className="max-w flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-md shadow-sm cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium min-w-0"
                  onClick={handleExportExcel}
                  disabled={
                    loading ||
                    !dataScanFacebookGroup ||
                    dataScanFacebookGroup.length === 0
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
            </div>

            {dataScanFacebookGroup && dataScanFacebookGroup.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-zinc-800 dark:to-zinc-800 rounded-lg p-3 border border-green-200 dark:border-zinc-700 w-full lg:max-w">
                <div className="flex items-center justify-between min-w-0 ">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400 truncate">
                      {t('scan_facebook_group.total_groups_found')} :{' '}
                    </span>
                    <span className="text-sm font-bold text-green-700 dark:text-green-400">
                      {' '}
                      {dataScanFacebookGroup.length}{' '}
                      {t('scan_facebook_group.groups')}
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
                  {t('scan_facebook_group.scanning')}
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 flex-shrink-0 ml-2">
                  {dataScanFacebookGroup?.length || 0}/{limit}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-1.5 min-w-0">
                <div
                  className="bg-green-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.min(
                      ((dataScanFacebookGroup?.length || 0) / Number(limit)) *
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
          {/* Mobile & Tablet Card View */}
          <div className="block lg:hidden space-y-3 min-w-0">
            {!dataScanFacebookGroup || dataScanFacebookGroup.length === 0 ? (
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 text-center">
                <span className="text-slate-500 dark:text-slate-300 font-semibold text-sm">
                  {t('common.no_data')}
                </span>
              </div>
            ) : (
              dataScanFacebookGroup.map((group, index) => (
                <div
                  key={group.id}
                  className="bg-white dark:bg-zinc-800 rounded-lg p-3 border border-slate-200 dark:border-zinc-700 shadow-sm animate-fadeIn min-w-0 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        STT
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {index + 1}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                        {t('scan_facebook_group.name_group')}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 break-words">
                        {group.name}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                        {t('scan_facebook_group.link_group')}
                      </span>
                      <a
                        href={group.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {group.url}
                      </a>
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                        {t('scan_facebook_group.id_group')}
                      </span>
                      <span className="text-xs text-slate-700 dark:text-slate-200 break-all">
                        {group.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                      <div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          {t('scan_facebook_group.member_group')}
                        </span>
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                          {group.member}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1 px-2">
                          {t('scan_facebook_group.privacy_group')}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                            group.privacy === GROUP_PRIVACY.PUBLIC.en ||
                            group.privacy === GROUP_PRIVACY.PUBLIC.vi
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          }`}
                        >
                          {group.privacy}
                        </span>
                      </div>
                    </div>
                    {group.description && (
                      <div>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          {t('scan_facebook_group.description_group')}
                        </span>
                        <span className="text-xs text-slate-700 dark:text-slate-200">
                          {group.description}
                        </span>
                      </div>
                    )}
                    {group.avatar && (
                      <div className="min-w-0">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          Avatar
                        </span>
                        <div className="flex flex-wrap gap-1 justify-start">
                          {group.avatar
                            .split('|')
                            .map((img: string, imgIndex: number) => (
                              <img
                                key={imgIndex}
                                src={img.trim()}
                                alt={`Ảnh ${imgIndex + 1}`}
                                className="w-12 h-12 object-cover rounded border border-slate-200 dark:border-zinc-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                                onClick={() => {
                                  setSelectedImage(img.trim());
                                  setOpen(true);
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="hidden lg:block bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-slate-200 dark:border-zinc-700 overflow-hidden min-w-0">
            <div className="max-h-[380px] overflow-y-auto custom-scroll">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-zinc-900">
                  <tr>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap w-12">
                      STT
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-left whitespace-nowrap w-80">
                      {t('scan_facebook_group.link_group')}
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap w-30">
                      Avatar
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap w-24">
                      {t('scan_facebook_group.id_group')}
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap w-48">
                      {t('scan_facebook_group.name_group')}
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap w-20">
                      {t('scan_facebook_group.member_group')}
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap w-24">
                      {t('scan_facebook_group.privacy_group')}
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap w-32">
                      {t('scan_facebook_group.description_group')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-700">
                  {!dataScanFacebookGroup ||
                  dataScanFacebookGroup.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-6 text-center text-slate-500 dark:text-slate-300 bg-white dark:bg-zinc-800 font-semibold text-sm"
                      >
                        {t('common.no_data')}
                      </td>
                    </tr>
                  ) : (
                    dataScanFacebookGroup.map((group, index) => (
                      <tr
                        key={group.id}
                        className="hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors duration-200 bg-white dark:bg-zinc-800 cursor-pointer animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200 font-medium text-center whitespace-nowrap w-12">
                          {index + 1}
                        </td>
                        <td className="px-3 py-2 text-blue-600 dark:text-blue-400 text-left ">
                          <a
                            href={group.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline font-medium inline-block max-w-[300px] truncate"
                            title={group.url}
                          >
                            {group.url}
                          </a>
                        </td>
                        <td className="px-2 py-2 text-slate-700 dark:text-slate-200 text-center w-30">
                          {group.avatar ? (
                            group.avatar && (
                              <div className="flex flex-wrap gap-1 justify-center">
                                {group.avatar
                                  .split('|')
                                  .map((img: string, imgIndex: number) => (
                                    <img
                                      key={imgIndex}
                                      src={img.trim()}
                                      alt={`Ảnh ${imgIndex + 1}`}
                                      className="w-12 h-12 object-cover rounded border border-slate-200 dark:border-zinc-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105"
                                      onClick={() => {
                                        setSelectedImage(img.trim());
                                        setOpen(true);
                                      }}
                                    />
                                  ))}
                              </div>
                            )
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td
                          className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center whitespace-nowrap w-24"
                          onClick={() => {
                            navigator.clipboard.writeText(group.id);
                            showToast('common.copied_button');
                          }}
                        >
                          {group.id}
                        </td>
                        <td
                          className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center font-semibold"
                          onClick={() => {
                            navigator.clipboard.writeText(group.name);
                            showToast('common.copied_button');
                          }}
                        >
                          <span
                            className="block max-w-[400px] truncate mx-auto"
                            title={group.name}
                          >
                            {group.name}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-emerald-700 dark:text-emerald-400 text-center whitespace-nowrap w-20 font-medium">
                          {group.member}
                        </td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center whitespace-nowrap w-24">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              group.privacy === GROUP_PRIVACY.PUBLIC.en ||
                              group.privacy === GROUP_PRIVACY.PUBLIC.vi
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}
                          >
                            {group.privacy}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center w-32">
                          <span
                            className="block max-w-[120px] truncate mx-auto"
                            title={group.description}
                          >
                            {group.description}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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

export default ScanFbGroupByKeyword;

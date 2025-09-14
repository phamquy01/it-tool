import { useEffect, useState } from 'react';
import type {
  CommentTiktokData,
  ScanCommentTiktokResponse,
} from '../../types/tiktok/scan-comment-tiktok';
import { useToast } from '../../store/ToastContext';
import { useTranslation } from 'react-i18next';
import http from '../../services/http';
import { EXPIRE_TIME } from '../../utils/constants/facebook-tool';
import { debounce } from 'lodash';
import { formatDate } from '../../utils/helpers/formatDate';
import * as XLSX from 'xlsx';
import { trackUsage } from '../../utils/helpers/TrackUsage';

const ScanTiktokComment = () => {
  const [videoId, setVideoId] = useState('');
  const [limit, setLimit] = useState<number | string>(10);
  const [dataScanCommentTikTok, setDataScanCommentTikTok] = useState<
    CommentTiktokData[] | null
  >(null);
  const [allFetchedComments, setAllFetchedComments] = useState<
    CommentTiktokData[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [lastCursor, setLastCursor] = useState('');
  const [lastSearchParams, setLastSearchParams] = useState<{
    videoId: string;
  } | null>(null);
  const { showToast } = useToast();
  const { t } = useTranslation();

  const fetchData = async (cursor: string = '') => {
    const res = await http.post<ScanCommentTiktokResponse>(
      'https://api.autozalo.com/api/scan_tiktok_comment',
      {
        videoId: videoId.trim(),
        cursor: cursor.trim(),
      }
    );
    return res;
  };

  const handleScan = async () => {
    setLoading(true);

    try {
      const currentParams = {
        videoId: videoId.trim(),
      };

      const isSameSearch =
        lastSearchParams && lastSearchParams.videoId === currentParams.videoId;

      let allGroups: CommentTiktokData[] = [];
      let cursor = '';

      if (isSameSearch && allFetchedComments.length > 0) {
        allGroups = [...allFetchedComments];
        cursor = lastCursor;
      } else {
        setDataScanCommentTikTok([]);
        setAllFetchedComments([]);
        setLastCursor('');
        allGroups = [];
        cursor = '';
      }

      const targetLimit = Number(limit);

      if (allGroups.length >= targetLimit) {
        setDataScanCommentTikTok([...allGroups.slice(0, targetLimit)]);
        showToast('scan_tiktok_comment.fetch_success', 'success');
        return;
      }

      if (allGroups.length > 0) {
        setDataScanCommentTikTok([...allGroups]);
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

        setAllFetchedComments([...allGroups]);
        setDataScanCommentTikTok([...allGroups.slice(0, targetLimit)]);

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

      trackUsage('Scan tiktok comment');
      showToast('scan_tiktok_comment.scan_success', 'success');
    } catch (err) {
      showToast(`Lỗi: ${String(err)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!dataScanCommentTikTok || dataScanCommentTikTok.length === 0) {
      showToast('Không có dữ liệu để xuất', 'error');
      return;
    }

    try {
      const excelData = dataScanCommentTikTok.map((group, index) => ({
        STT: index + 1,
        [t('scan_tiktok_comment.comment_id')]: group.id,
        [t('scan_tiktok_comment.comment_name')]: group.nickname,
        [t('scan_tiktok_comment.comment_text')]: group.text,
        [t('scan_tiktok_comment.comment_username')]: group.unique_id,
        [t('scan_tiktok_comment.comment_time')]: group.create_time
          ? formatDate(group.create_time)
          : '',
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
      const fileName = `Comment_tiktok_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      showToast('scan_tiktok_comment.export_success', 'success');
    } catch (error) {
      console.error('Lỗi xuất Excel:', error);
      showToast('Có lỗi xảy ra khi xuất file Excel', 'error');
    }
  };

  useEffect(() => {
    const saveState = debounce(() => {
      const stateToSave = {
        videoId,
        limit,
        lastCursor,
        lastSearchParams,
        allFetchedComments: allFetchedComments || [],
        data: dataScanCommentTikTok || [],
        timestamp: Date.now(),
      };
      localStorage.setItem(
        'scanCommentTikTokState',
        JSON.stringify(stateToSave)
      );
    }, 500);

    saveState();

    return () => {
      saveState.cancel();
    };
  }, [
    videoId,
    limit,
    lastCursor,
    lastSearchParams,
    allFetchedComments,
    dataScanCommentTikTok,
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('scanCommentTikTokState');
    if (!saved) return;

    const parsed = saved ? JSON.parse(saved) : {};
    if (Date.now() - parsed.timestamp > EXPIRE_TIME) {
      localStorage.removeItem('scanCommentTikTokState');
      return;
    }

    setVideoId(parsed.videoId || '');
    setLimit(parsed.limit || 10);
    setLastCursor(parsed.lastCursor || '');
    setLastSearchParams(parsed.lastSearchParams || null);
    setAllFetchedComments(parsed.allFetchedComments || []);
    setDataScanCommentTikTok(parsed.data || []);
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
                  {t('scan_tiktok_comment.video_id')}
                </label>
              </div>
              <div
                className={`flex items-center gap-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full min-w-0 transition-opacity duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  value={videoId}
                  onChange={(e) => {
                    setVideoId(e.target.value);
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
                {t('scan_tiktok_comment.limit')}
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

          <div className="flex flex-col gap-2 lg:flex-row justify-between items-center min-w-0">
            <div className="flex items-center gap-2 w-full">
              <button
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md shadow-sm cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium min-w-0"
                onClick={handleScan}
                disabled={loading || !videoId.trim()}
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
                    <>{t('scan_tiktok_comment.scanning')}</>
                  ) : (
                    <>{t('scan_tiktok_comment.button_scan')}</>
                  )}
                </span>
              </button>
              <button
                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-md shadow-sm cursor-pointer transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium min-w-0"
                onClick={handleExportExcel}
                disabled={
                  loading ||
                  !dataScanCommentTikTok ||
                  dataScanCommentTikTok.length === 0
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
                  {t('scan_tiktok_comment.button_export')}
                </span>
              </button>
            </div>

            {dataScanCommentTikTok && dataScanCommentTikTok.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-zinc-800 dark:to-zinc-800 rounded-lg p-3 border border-green-200 dark:border-zinc-700 w-full lg:w-auto">
                <div className="flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400 truncate">
                      {t('scan_tiktok_comment.total_comments_found')} :{' '}
                    </div>
                    <div className="text-sm font-bold text-green-700 dark:text-green-400 w-max">
                      {dataScanCommentTikTok.length}{' '}
                      {t('scan_tiktok_comment.comments')}
                    </div>
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
                  {t('scan_tiktok_comment.scanning')}
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 flex-shrink-0 ml-2">
                  {dataScanCommentTikTok?.length || 0}/{limit}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-1.5 min-w-0">
                <div
                  className="bg-green-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.min(
                      ((dataScanCommentTikTok?.length || 0) / Number(limit)) *
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
            {!dataScanCommentTikTok || dataScanCommentTikTok.length === 0 ? (
              <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 text-center">
                <span className="text-slate-500 dark:text-slate-300 font-semibold text-sm">
                  {t('common.no_data')}
                </span>
              </div>
            ) : (
              dataScanCommentTikTok.map((comment, index) => (
                <div
                  key={comment.id}
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
                    <div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                        {t('scan_tiktok_comment.comment_id')}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 break-words">
                        {comment.id}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          {t('scan_tiktok_comment.comment_name')}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 break-words">
                          {comment.nickname}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          {t('scan_tiktok_comment.comment_text')}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 break-words">
                          {comment.text}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          {t('scan_tiktok_comment.comment_username')}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 break-words">
                          {comment.unique_id}
                        </span>
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          {t('scan_tiktok_comment.comment_time')}
                        </span>
                        <span
                          className={`inline-block rounded-full text-xs font-semibold `}
                        >
                          {formatDate(comment.create_time)}
                        </span>
                      </div>
                    </div>
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
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap ">
                      STT
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap ">
                      {t('scan_tiktok_comment.comment_id')}
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap ">
                      {t('scan_tiktok_comment.comment_name')}
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap ">
                      {t('scan_tiktok_comment.comment_username')}
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap ">
                      {t('scan_tiktok_comment.comment_text')}
                    </th>
                    <th className="px-3 py-2 font-semibold text-slate-700 dark:text-zinc-200 text-center whitespace-nowrap ">
                      {t('scan_tiktok_comment.comment_time')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-700">
                  {!dataScanCommentTikTok ||
                  dataScanCommentTikTok.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-6 text-center text-slate-500 dark:text-slate-300 bg-white dark:bg-zinc-800 font-semibold text-sm"
                      >
                        {t('common.no_data')}
                      </td>
                    </tr>
                  ) : (
                    dataScanCommentTikTok.map((comment, index) => (
                      <tr
                        key={comment.id}
                        className="hover:bg-green-50 dark:hover:bg-zinc-800 transition-colors duration-200 bg-white dark:bg-zinc-800 cursor-pointer animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center">
                          {index + 1}
                        </td>
                        <td
                          className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center"
                          onClick={() => {
                            navigator.clipboard.writeText(comment.id);
                            showToast('common.copied_button');
                          }}
                        >
                          {comment.id}
                        </td>
                        <td
                          className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center font-semibold"
                          onClick={() => {
                            navigator.clipboard.writeText(comment.nickname);
                            showToast('common.copied_button');
                          }}
                        >
                          {comment.nickname}
                        </td>
                        <td
                          className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center font-semibold"
                          onClick={() => {
                            navigator.clipboard.writeText(comment.unique_id);
                            showToast('common.copied_button');
                          }}
                        >
                          {comment.unique_id}
                        </td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center max-w-[300px]">
                          <span
                            className="block truncate mx-auto"
                            title={comment.text}
                          >
                            {comment.text}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-700 dark:text-slate-200 text-center">
                          {formatDate(comment.create_time)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanTiktokComment;

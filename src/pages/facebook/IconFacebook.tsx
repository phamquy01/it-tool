import { useState, useRef, useEffect, useMemo } from 'react';
import emojiList from '../../services/emoji.json';
import Input from '../../components/Input';
import { Copy, Delete, X } from 'lucide-react';
import { useToast } from '../../store/ToastContext';
import { useTranslation } from 'react-i18next';
import type { Emoji } from '../../types/facebook/icon-facebook';
import { trackUsage } from '../../utils/helpers/TrackUsage';

const groupedEmojis = (() => {
  const byCat: Record<string, Emoji[]> = {};
  for (const e of emojiList as Emoji[]) {
    if (!e.has_img_facebook) continue;
    const c = e.category || 'Other';
    if (!byCat[c]) byCat[c] = [];
    byCat[c].push(e);
  }
  const cats = Object.keys(byCat);
  return cats.map((c) => ({ category: c, emojis: byCat[c] }));
})();

const categories = groupedEmojis.map((g) => g.category);

export default function IconFacebook() {
  const [search, setSearch] = useState('');
  const [chosen, setChosen] = useState<Emoji[]>([]);
  const [visibleEmojiCount, setVisibleEmojiCount] = useState(180);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories[0] || null
  );

  const isManualScrolling = useRef(false);

  const { showToast } = useToast();
  const { t } = useTranslation();

  const allEmojis = useMemo(() => {
    const emojis: Emoji[] = [];
    groupedEmojis.forEach(({ emojis: categoryEmojis }) => {
      emojis.push(...categoryEmojis);
    });
    return emojis;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      trackUsage('Emoji');
    }, 3 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (search) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isManualScrolling.current) return;

      const sections =
        container.querySelectorAll<HTMLElement>('[data-category]');

      let currentSection = '';
      let maxVisibleArea = 0;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const visibleTop = Math.max(rect.top, containerRect.top);
        const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (visibleHeight > 0) {
          const visibleRatio = visibleHeight / rect.height;
          const adjustedArea = visibleHeight * visibleRatio;

          if (adjustedArea > maxVisibleArea) {
            maxVisibleArea = adjustedArea;
            currentSection = section.getAttribute('data-category') || '';
          }
        }
      });

      if (currentSection && currentSection !== activeCategory) {
        setActiveCategory(currentSection);
      }
    };

    let timeoutId: NodeJS.Timeout;
    const throttledScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 16);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('scroll', throttledScroll, { passive: true });
    setTimeout(handleScroll, 100);
    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('scroll', throttledScroll);
    };
  }, [search, activeCategory]);

  useEffect(() => {
    if (search) return;

    const container = containerRef.current;
    if (!container) return;

    let scrollTimeoutId: NodeJS.Timeout;

    const handleScrollLoading = () => {
      clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollHeight - scrollTop - clientHeight < 300) {
          setVisibleEmojiCount((prev) => {
            const newCount = prev + 300;
            return Math.min(newCount, allEmojis.length);
          });
        }
      }, 100);
    };

    container.addEventListener('scroll', handleScrollLoading);
    return () => {
      container.removeEventListener('scroll', handleScrollLoading);
      clearTimeout(scrollTimeoutId);
    };
  }, [search, allEmojis.length]);

  const filteredEmojis = useMemo(() => {
    if (!search) return [];

    const results = (emojiList as Emoji[]).filter((emoji) => {
      if (!emoji.has_img_facebook) return false;
      const s = search.toLowerCase();
      const name = (emoji.short_name || emoji.name || '').toLowerCase();
      return (
        name.includes(s) ||
        (emoji.category && emoji.category.toLowerCase().includes(s)) ||
        (emoji.unified && emoji.unified.includes(search))
      );
    });
    return results.slice(0, 100);
  }, [search]);

  const handleSelect = (emoji: Emoji) => {
    setChosen((prev) => {
      const newChosen = [...prev, emoji];
      navigator.clipboard.writeText(newChosen.map((e) => e.name).join(' '));
      return newChosen;
    });
  };
  const handleRemoveOne = (emoji: Emoji) =>
    setChosen((p) => p.filter((c) => c.unified !== emoji.unified));
  const handleRemoveLast = () => setChosen((p) => p.slice(0, -1));
  const handleClear = () => setChosen([]);

  const handleScrollToCategory = (category: string) => {
    setActiveCategory(category);
    setSearch('');

    // Calculate how many emojis we need to load to reach this category
    const targetCategoryIndex = groupedEmojis.findIndex(
      (g) => g.category === category
    );
    if (targetCategoryIndex === -1) return;

    const emojisNeededToReachCategory = groupedEmojis
      .slice(0, targetCategoryIndex + 1)
      .reduce((sum, g) => sum + g.emojis.length, 0);

    // Load enough emojis to reach the target category
    if (visibleEmojiCount < emojisNeededToReachCategory) {
      setVisibleEmojiCount(emojisNeededToReachCategory);
    }

    isManualScrolling.current = true;

    // Use setTimeout to ensure the DOM is updated after state change
    setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const el = container.querySelector(
        `[data-category="${category}"]`
      ) as HTMLElement;
      if (el) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = el.getBoundingClientRect();
        const scrollTop =
          container.scrollTop + (elementRect.top - containerRect.top) - 10;

        container.scrollTo({
          top: scrollTop,
        });

        // Reset the flag after scrolling is complete
        setTimeout(() => {
          isManualScrolling.current = false;
        }, 1000);
      }
    }, 100);
  };

  function EmojiTile({
    emoji,
    isChosen,
    onSelect,
    onRemove,
  }: {
    emoji: Emoji;
    isChosen: boolean;
    onSelect: (emoji: Emoji) => void;
    onRemove: (emoji: Emoji) => void;
  }) {
    return (
      <div
        className="relative flex flex-col items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-all duration-150 shadow-sm p-2 select-none"
        onClick={() => onSelect(emoji)}
        onMouseDown={(e) => e.preventDefault()}
      >
        {isChosen && (
          <button
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full p-[2px] shadow hover:bg-red-100 z-10 cursor-pointer"
            onClick={(ev) => {
              ev.stopPropagation();
              onRemove(emoji);
            }}
            aria-label="remove"
            tabIndex={-1}
          >
            <X size={10} className="text-red-600 dark:text-red-400" />
          </button>
        )}
        <img
          src={emoji.image}
          alt={emoji.image}
          className="w-6 h-6 select-none"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start w-full px-4 sm:px-6 lg:px-8 pt-0">
      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('icon_facebook.title')}
        </label>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full input-wrapper">
          <Input
            type="text"
            className="font-bold w-full"
            placeholder={t('common.input_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            actions={
              search
                ? [{ icon: <X size={14} />, onClick: () => setSearch('') }]
                : []
            }
          />
        </div>
      </div>

      <div className="flex gap-2">
        <aside className="w-20 h-[510px] rounded bg-white dark:bg-zinc-800 py-3 flex flex-col shadow border border-zinc-200 dark:border-zinc-700">
          <ul className="flex flex-col h-full justify-between overflow-hidden gap-1 px-2">
            {categories.map((category) => {
              const grp = groupedEmojis.find((g) => g.category === category);
              const firstEmoji = grp?.emojis?.[0];
              const isActive = activeCategory === category;
              return (
                <li
                  key={category}
                  className={`flex-1 w-full flex items-center justify-center gap-3 px-1 py-2 rounded-lg cursor-pointer transition-colors duration-150 relative group ${
                    isActive ? 'bg-zinc-100 dark:bg-zinc-700' : ''
                  }`}
                  onClick={() => handleScrollToCategory(category)}
                >
                  {firstEmoji ? (
                    <img
                      src={`${firstEmoji.image}`}
                      alt={category}
                      className="w-6 h-6 drop-shadow"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 truncate max-w-[80px] text-center">
                      {category}
                    </span>
                  )}
                  <span
                    className={`absolute left-12 top-1/2 -translate-y-1/2 transition-opacity rotate-180  ${
                      isActive
                        ? 'opacity-100 text-zinc-400 dark:text-zinc-500'
                        : 'opacity-0 group-hover:opacity-80 text-zinc-300 dark:text-zinc-600'
                    }`}
                    style={{ fontSize: 18 }}
                  >
                    ▶
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>

        <div
          ref={containerRef}
          className="flex-1 h-[510px] overflow-y-auto custom-scroll bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded p-4"
        >
          {search ? (
            <div>
              <div className="grid grid-cols-8 md:grid-cols-12 gap-3">
                {filteredEmojis.map((e) => {
                  const chosenFlag = chosen.some(
                    (c) => c.unified === e.unified
                  );
                  return (
                    <EmojiTile
                      key={e.unified}
                      emoji={e}
                      isChosen={chosenFlag}
                      onSelect={handleSelect}
                      onRemove={handleRemoveOne}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {groupedEmojis.map(({ category, emojis }) => {
                const emojisSoFar = groupedEmojis
                  .slice(
                    0,
                    groupedEmojis.findIndex((g) => g.category === category)
                  )
                  .reduce((sum, g) => sum + g.emojis.length, 0);

                const visibleInThisCategory = Math.max(
                  0,
                  visibleEmojiCount - emojisSoFar
                );
                const emojisToShow = emojis.slice(0, visibleInThisCategory);
                if (emojisToShow.length === 0) return null;

                return (
                  <div
                    key={category}
                    data-category={category}
                    className="mb-6"
                    style={{ scrollMarginTop: 8 }}
                  >
                    <div className="mb-2 text-sm font-semibold text-zinc-600 dark:text-zinc-200">
                      {t(`icon_facebook.${category.toLowerCase()}`, category)}
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-16 2xl:grid-cols-20 gap-3">
                      {emojisToShow.map((e) => {
                        const chosenFlag = chosen.some(
                          (c) => c.unified === e.unified
                        );
                        return (
                          <EmojiTile
                            key={e.unified}
                            emoji={e}
                            isChosen={chosenFlag}
                            onSelect={handleSelect}
                            onRemove={handleRemoveOne}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full my-4 text-black dark:text-white">
        <label className="mb-[5px] text-left pr-3 text-[14px] font-semibold">
          {t('icon_facebook.selected')}
        </label>
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-300 rounded w-full input-wrapper">
          <div className="flex flex-wrap items-center gap-1 px-3 py-3 w-full min-h-[48px]">
            {chosen.map((emoji, index) => (
              <img
                key={index}
                src={emoji.image}
                alt={`Selected emoji ${index + 1}`}
                className="w-6 h-6 select-none"
                draggable={false}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 pr-3">
            {chosen.length > 0 && (
              <>
                <button
                  onClick={handleRemoveLast}
                  className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full cursor-pointer"
                >
                  <Delete size={14} />
                </button>
                <button
                  onClick={handleClear}
                  className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full cursor-pointer"
                >
                  <X size={14} />
                </button>
              </>
            )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  chosen.map((emoji) => emoji.name || '').join(' ')
                );
                showToast(t('common.copied_button'));
              }}
              className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full cursor-pointer"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

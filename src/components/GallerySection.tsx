import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import {
  BEFORE_AFTER_HIGHLIGHTS,
  PROJECT_GALLERY_PHOTOS,
  type GalleryArea,
  type GalleryStage,
} from '../data/gallery';
import { ResilientImage } from './ResilientImage';

type AreaFilter = 'All' | GalleryArea;
type StageFilter = 'All' | GalleryStage;

const AREA_FILTERS: AreaFilter[] = ['All', 'Carpets', 'Kitchen', 'Floors', 'Rooms', 'Windows'];
const STAGE_FILTERS: StageFilter[] = ['All', 'After', 'Before & In Progress'];
const INITIAL_VISIBLE = 12;
const PAGE_INCREMENT = 18;

export function GallerySection() {
  const [activeArea, setActiveArea] = useState<AreaFilter>('All');
  const [activeStage, setActiveStage] = useState<StageFilter>('All');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    return PROJECT_GALLERY_PHOTOS.filter((item) => {
      const areaMatch = activeArea === 'All' || item.area === activeArea;
      const stageMatch = activeStage === 'All' || item.stage === activeStage;
      return areaMatch && stageMatch;
    });
  }, [activeArea, activeStage]);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const remainingCount = Math.max(0, filteredItems.length - displayedItems.length);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((idx) => (idx === null ? null : (idx + 1) % filteredItems.length));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((idx) =>
          idx === null ? null : (idx - 1 + filteredItems.length) % filteredItems.length,
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, filteredItems.length]);

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Project Gallery
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1E3D]">
            Before &amp; After Cleaning Transformations
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Explore real on-site photographs from Dice Empire deep-cleaning projects across carpets,
            commercial kitchens, floors, rooms and windows. Click any image to view larger.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {BEFORE_AFTER_HIGHLIGHTS.map((pair) => (
            <div
              key={pair.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
            >
              <div className="flex items-baseline justify-between gap-2 mb-3">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#0B1E3D]">
                  {pair.title}
                </h3>
                <span className="text-xs font-semibold text-blue-700 shrink-0">{pair.area}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 border border-slate-200">
                    <ResilientImage
                      src={pair.beforeSrc}
                      alt={`${pair.title} before cleaning`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs font-semibold text-slate-600">Before</div>
                </div>
                <div className="space-y-1.5">
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 border border-emerald-200">
                    <ResilientImage
                      src={pair.afterSrc}
                      alt={`${pair.title} after cleaning`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-xs font-semibold text-emerald-700">After</div>
                </div>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {pair.summary}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200">
          <div
            role="tablist"
            aria-label="Filter gallery by work area"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start"
          >
            {AREA_FILTERS.map((area) => {
              const active = activeArea === area;
              const count =
                area === 'All'
                  ? PROJECT_GALLERY_PHOTOS.length
                  : PROJECT_GALLERY_PHOTOS.filter((p) => p.area === area).length;
              return (
                <button
                  key={area}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setActiveArea(area);
                    setVisibleCount(INITIAL_VISIBLE);
                    setSelectedIndex(null);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
                    active
                      ? 'bg-white text-[#0B1E3D] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {area} ({count})
                </button>
              );
            })}
          </div>

          <div
            role="tablist"
            aria-label="Filter gallery by project stage"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start"
          >
            {STAGE_FILTERS.map((stage) => {
              const active = activeStage === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setActiveStage(stage);
                    setVisibleCount(INITIAL_VISIBLE);
                    setSelectedIndex(null);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {stage}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayedItems.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className="group text-left rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <ResilientImage
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <span className="absolute top-2.5 right-2.5 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-950/65 text-white opacity-90 group-hover:opacity-100 transition-opacity">
                  <Expand className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
              <div className="p-3.5 sm:p-4">
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span className="text-blue-700">{item.area}</span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span
                    className={
                      item.stage === 'After' ? 'text-emerald-700 font-semibold' : 'text-slate-500'
                    }
                  >
                    {item.stage}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-sm sm:text-base font-bold text-[#0B1E3D] truncate">
                  {item.title}
                </h3>
              </div>
            </button>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-600">
              No photos match this filter combination. Switch stage to &ldquo;All&rdquo; to view all{' '}
              {activeArea} photos.
            </p>
            <button
              type="button"
              onClick={() => setActiveStage('All')}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition-colors"
            >
              Show All {activeArea} Photos
            </button>
          </div>
        )}

        {remainingCount > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + PAGE_INCREMENT)}
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors tabular-nums"
            >
              Load More Photos ({Math.min(PAGE_INCREMENT, remainingCount)} of {remainingCount} remaining)
            </button>
            <button
              type="button"
              onClick={() => setVisibleCount(filteredItems.length)}
              className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors tabular-nums"
            >
              Show All ({filteredItems.length})
            </button>
          </div>
        )}
      </div>

      {selectedItem && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square sm:aspect-[4/3] max-h-[70vh] w-full bg-slate-900">
              <ResilientImage
                src={selectedItem.src}
                alt={selectedItem.title}
                className="w-full h-full object-contain bg-slate-950"
              />
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close enlarged image"
                className="absolute top-3 right-3 p-2.5 rounded-xl bg-slate-950/75 text-white hover:bg-slate-950 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIndex(
                        (selectedIndex - 1 + filteredItems.length) % filteredItems.length,
                      )
                    }
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-950/75 text-white hover:bg-slate-950 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex((selectedIndex + 1) % filteredItems.length)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-slate-950/75 text-white hover:bg-slate-950 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-blue-700">{selectedItem.area}</span>
                  <span aria-hidden="true" className="text-slate-300">
                    ·
                  </span>
                  <span
                    className={
                      selectedItem.stage === 'After' ? 'text-emerald-700' : 'text-slate-600'
                    }
                  >
                    {selectedItem.stage}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#0B1E3D] mt-0.5">
                  {selectedItem.title}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{selectedItem.caption}</p>
              </div>
              <div className="text-xs font-medium text-slate-500 tabular-nums shrink-0">
                {selectedIndex + 1} / {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

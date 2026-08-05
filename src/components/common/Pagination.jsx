import { usePagination } from '../../hooks/usePagination';
import { cx } from '../../utils/helpers';

export default function Pagination({ items, perPage = 10, showInfo = true }) {
  const pagination = usePagination(items, perPage);

  if (pagination.totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface-container-low">
      {showInfo && (
        <p className="text-sm text-on-surface-variant">
          Showing{' '}
          <span className="font-bold">
            {(pagination.page - 1) * perPage + 1}-
            {Math.min(pagination.page * perPage, pagination.totalItems)}
          </span>{' '}
          of <span className="font-bold">{pagination.totalItems}</span> entries
        </p>
      )}
      <div className="flex gap-2 ml-auto">
        <button
          onClick={pagination.prev}
          disabled={pagination.page === 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 transition-colors"
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => pagination.goToPage(p)}
            className={cx(
              'w-10 h-10 rounded-lg font-bold transition-colors',
              p === pagination.page
                ? 'bg-primary text-on-primary shadow-sm'
                : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={pagination.next}
          disabled={pagination.page === pagination.totalPages}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 transition-colors"
          aria-label="Next page"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

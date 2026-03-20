export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
      <div className="h-48 skeleton" />
      <div className="p-3">
        <div className="flex gap-3 mb-2">
          <div className="h-4 w-12 skeleton rounded" />
          <div className="h-4 w-12 skeleton rounded" />
          <div className="h-4 w-16 skeleton rounded" />
        </div>
        <div className="h-4 w-full skeleton rounded mb-1.5" />
        <div className="h-3 w-3/4 skeleton rounded mb-3" />
        <div className="h-3 w-1/2 skeleton rounded" />
      </div>
    </div>
  )
}

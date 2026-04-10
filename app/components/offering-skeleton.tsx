export default function OfferingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex justify-between mb-3">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-36"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
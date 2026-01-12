// BusCard.jsx
import { useState } from "react";

export default function BusCard({ bus }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const routeFrom = bus.routeFrom || "N/A";
  const routeTo = bus.routeTo || "N/A";
  const stoppages = bus.stoppages || [];
  //const departureInfo = bus.departureInfo; // adjust to your API

  const toggleStoppageDetails = () => setIsExpanded((prev) => !prev);

  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Compact Bus Card */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Bus Info */}
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {bus.busName?.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800 mb-1">
                  {bus.busName}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    {bus.busNumber}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>{bus.busType || "Standard"}</span>
                  <span className="text-gray-400">•</span>
                  <span>{bus.capacity || "N/A"} seats</span>
                </div>

                <div className="mt-2 flex items-center text-sm">
                  <span className="font-medium text-purple-700 capitalize">
                    {routeFrom}
                  </span>
                  <svg
                    className="w-4 h-4 mx-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span className="font-medium text-purple-700 capitalize">
                    {routeTo}
                  </span>
                  <span className="ml-3 text-gray-500">
                    ({stoppages.length} stops)
                  </span>
                </div>

                {departureInfo && (
                  <div className="mt-1 text-sm font-semibold text-green-600">
                    🕒 Departs from {routeFrom}: {departureInfo.time}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fare and Actions */}
          <div className="flex flex-col md:items-end gap-3">
            <div className="text-center md:text-right">
              <div className="text-sm text-gray-600">Starting from</div>
              {/* <div className="text-3xl font-bold text-purple-700">₹{bus.fare}</div> */}
            </div>
            <button
              onClick={toggleStoppageDetails}
              className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 font-semibold flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{isExpanded ? "Hide" : "Details"}</span>
            </button>
          </div>
        </div>

        {/* Amenities Quick View */}
        {bus.amenities && bus.amenities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {bus.amenities.slice(0, 5).map((amenity, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium border border-green-200"
                >
                  ✓ {amenity}
                </span>
              ))}
              {bus.amenities.length > 5 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  +{bus.amenities.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Details (keep your existing detailed JSX here) */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          {/* put your route, contacts, detailed stats, all amenities and stoppages table here */}
        </div>
      )}
    </div>
  );
}


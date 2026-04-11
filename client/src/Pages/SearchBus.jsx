import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import BusCard from "./busCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function SearchBus({ compact = false }) {
  const { route } = useParams();
  const navigate = useNavigate();
  
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [allStops, setAllStops] = useState([]);
  const [toRecommendationsByFrom, setToRecommendationsByFrom] = useState({});
  const [popularRoutes, setPopularRoutes] = useState([]);

  // Auto-search when URL changes
  useEffect(() => {
    if (!route) return;

    const [fromCity, toCity] = route.split("-to-");
    if (!fromCity || !toCity) return;

    const decodedFrom = fromCity.replace(/-/g, " ");
    const decodedTo = toCity.replace(/-/g, " ");

    setFrom(decodedFrom);
    setTo(decodedTo);

    handleSearch(decodedFrom, decodedTo);
  }, [route]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/buses/allbuses`);
        const buses = Array.isArray(res.data) ? res.data : res.data?.buses || [];

        const stopCounts = new Map();
        const routeCounts = new Map();
        const toMap = new Map();

        buses.forEach((bus) => {
          const rawStops = (bus.route?.stoppages || bus.stoppages || [])
            .map((stop) => String(stop?.name || "").trim())
            .filter(Boolean);

          const orderedStops = rawStops.map((name) => ({
            label: formatStopName(name),
            normalized: normalizeStopName(name),
          }));

          orderedStops.forEach(({ normalized, label }) => {
            if (!stopCounts.has(normalized)) {
              stopCounts.set(normalized, { label, normalized, count: 0 });
            }
            stopCounts.get(normalized).count += 1;
          });

          for (let i = 0; i < orderedStops.length; i += 1) {
            for (let j = i + 1; j < orderedStops.length; j += 1) {
              const fromStop = orderedStops[i];
              const toStop = orderedStops[j];
              const pairKey = `${fromStop.normalized}__${toStop.normalized}`;

              routeCounts.set(pairKey, {
                from: fromStop.label,
                to: toStop.label,
                fromNormalized: fromStop.normalized,
                toNormalized: toStop.normalized,
                count: (routeCounts.get(pairKey)?.count || 0) + 1,
              });

              if (!toMap.has(fromStop.normalized)) {
                toMap.set(fromStop.normalized, new Map());
              }

              const currentTargets = toMap.get(fromStop.normalized);
              currentTargets.set(toStop.normalized, {
                label: toStop.label,
                normalized: toStop.normalized,
                count: (currentTargets.get(toStop.normalized)?.count || 0) + 1,
              });
            }
          }
        });

        const sortedStops = Array.from(stopCounts.values()).sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count;
          return a.label.localeCompare(b.label);
        });

        const sortedPopularRoutes = Array.from(routeCounts.values())
          .sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return `${a.from}-${a.to}`.localeCompare(`${b.from}-${b.to}`);
          })
          .slice(0, 6);

        const serializedToMap = {};
        toMap.forEach((targets, key) => {
          serializedToMap[key] = Array.from(targets.values()).sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return a.label.localeCompare(b.label);
          });
        });

        setAllStops(sortedStops);
        setPopularRoutes(sortedPopularRoutes);
        setToRecommendationsByFrom(serializedToMap);
      } catch (err) {
        console.error("Failed to load route recommendations:", err);
      }
    };

    fetchRecommendations();
  }, []);

  // Search function
  const handleSearch = async (fromValue, toValue) => {
    const safeFrom = String(fromValue ?? from).trim().toLowerCase();
    const safeTo = String(toValue ?? to).trim().toLowerCase();

    if (!safeFrom || !safeTo) {
      setError("Please enter both From and To locations");
      return;
    }

    const fromSlug = safeFrom.replace(/\s+/g, "-");
    const toSlug = safeTo.replace(/\s+/g, "-");
    const targetPath = `/bus/${fromSlug}-to-${toSlug}`;

    if (window.location.pathname !== targetPath) {
      navigate(targetPath);
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await axios.get(
        `${API_URL}/api/buses/search?from=${safeFrom}&to=${safeTo}`
      );

      if (res.data?.success) {
        setResults(res.data.buses || []);
        if (!res.data.buses?.length) {
          setError("No buses found for this route");
        }
      } else {
        setResults(res.data || []);
        if (!res.data?.length) {
          setError("No buses found for this route");
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.message || "No buses found for this route");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const clearSearch = () => {
    setFrom("");
    setTo("");
    setResults([]);
    setError("");
    navigate('/bus');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const normalizeStopName = (value) => String(value || "").trim().toLowerCase();

  const formatStopName = (value) =>
    String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const getSuggestions = (value, source, excludedValue = "") => {
    const normalizedValue = normalizeStopName(value);
    const normalizedExcludedValue = normalizeStopName(excludedValue);

    return source
      .filter((item) => item.normalized !== normalizedExcludedValue)
      .filter((item) =>
        normalizedValue ? item.normalized.includes(normalizedValue) : true
      )
      .slice(0, 6);
  };

  const fromSuggestions = getSuggestions(from, allStops, to);
  const toSource = toRecommendationsByFrom[normalizeStopName(from)] || allStops;
  const toSuggestions = getSuggestions(to, toSource, from);

  const applySuggestion = (field, value) => {
    if (field === "from") {
      setFrom(value);
    } else {
      setTo(value);
    }
    setActiveField(null);
  };

  const applyRouteRecommendation = (recommendedFrom, recommendedTo) => {
    setFrom(recommendedFrom);
    setTo(recommendedTo);
    setError("");
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Form */}
      <div className={`${compact ? "" : "bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6 md:p-8"}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* From Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter departure city"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                onFocus={() => setActiveField("from")}
                onBlur={() => setTimeout(() => setActiveField(null), 120)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            {activeField === "from" && fromSuggestions.length > 0 && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-2xl">
                {fromSuggestions.map((item) => (
                  <button
                    key={item.normalized}
                    type="button"
                    onMouseDown={() => applySuggestion("from", item.label)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-purple-50"
                  >
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-xs text-purple-400">{item.count} buses</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex items-end justify-center md:justify-start">
            <button
              onClick={swapLocations}
              className="p-3 bg-purple-100 hover:bg-purple-200 rounded-full transition-all duration-300 hover:scale-110 group"
              title="Swap locations"
            >
              <svg className="w-5 h-5 text-purple-600 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* To Input */}
          <div className="relative">
            <label className="block text-sm font-semibold text-purple-700 mb-2">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter destination city"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                onFocus={() => setActiveField("to")}
                onBlur={() => setTimeout(() => setActiveField(null), 120)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            {activeField === "to" && toSuggestions.length > 0 && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-2xl">
                {toSuggestions.map((item) => (
                  <button
                    key={item.normalized}
                    type="button"
                    onMouseDown={() => applySuggestion("to", item.label)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-purple-50"
                  >
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-xs text-purple-400">{item.count} matches</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons Container */}
          <div className="flex items-end">
            <div className="w-full space-y-2">
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Clear Button - Separate Row */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={clearSearch}
            className="px-6 py-2 border-2 border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-300 font-semibold flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Clear</span>
          </button>

          {from && !to && toRecommendationsByFrom[normalizeStopName(from)]?.length > 0 && (
            <p className="text-sm text-purple-500">
              Recommended destinations from <span className="font-semibold">{formatStopName(from)}</span>
            </p>
          )}
        </div>
      </div>

      {popularRoutes.length > 0 && (
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8L10 18l-5-5-6 6" />
              </svg>
            </span>
            <div>
              <h3 className="text-sm font-semibold text-purple-700">Recommended routes</h3>
              <p className="text-xs text-purple-400">Quick picks based on available bus routes</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {popularRoutes.map((item) => (
              <button
                key={`${item.fromNormalized}-${item.toNormalized}`}
                type="button"
                onClick={() => applyRouteRecommendation(item.from, item.to)}
                className="rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-medium text-purple-700 transition hover:border-purple-400 hover:bg-purple-100"
              >
                {item.from} to {item.to}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Available Buses
            </h3>
            <p className="text-gray-600">
              Found {results.length} bus{results.length > 1 ? 'es' : ''} for your journey
            </p>
          </div>

          <div className="grid gap-4">
            {results.map((bus, index) => (
              <BusCard key={bus._id || index} bus={bus} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* No Results State */}
      {!loading && !error && results.length === 0 && (from || to) && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Search</h3>
          <p className="text-gray-500">Enter departure and destination cities to find available buses</p>
        </div>
      )}
    </div>
  );
}

export default SearchBus;

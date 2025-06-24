"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WeatherData {
  date: string;
  location: string;
  notes?: string;
  weatherData: any;
}

export default function WeatherLookup() {
  const [lookupId, setLookupId] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    if (!lookupId.trim()) {
      setError("Invalid ID");
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const res = await fetch(`http://localhost:8000/weather/${lookupId}`);
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Input
        placeholder="Enter weather ID"
        value={lookupId}
        onChange={(e) => setLookupId(e.target.value)}
        className="mb-4"
      />
      <Button
        onClick={lookup}
        disabled={loading || !lookupId.trim()}
        className="w-full"
      >
        {loading ? "Loading..." : "Get Weather Data"}
      </Button>

      {error && (
        <p className="mt-4 text-red-600 font-semibold">Error: {error}</p>
      )}

      {weatherData && (
        <div className="mt-4 bg-[#f3f4f6] text-black p-6 rounded-lg w-full shadow-md overflow-auto max-h-96 space-y-3">
          <div className="space-y-1">
            <p className="text-sm">
              <strong>Date:</strong> {weatherData.date}
            </p>
            <p className="text-sm">
              <strong>Location:</strong> {weatherData.location}
            </p>
            {weatherData.notes && (
              <p className="text-sm">
                <strong>Notes:</strong> {weatherData.notes}
              </p>
            )}
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Weather Details
            </h3>
            {weatherData.weatherData?.current ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p>
                  <strong>Temperature:</strong>{" "}
                  {weatherData.weatherData.current.temperature}°C
                </p>
                <p>
                  <strong>Condition:</strong>{" "}
                  {weatherData.weatherData.current.weather_descriptions[0]}
                </p>
                <p>
                  <strong>Humidity:</strong>{" "}
                  {weatherData.weatherData.current.humidity}%
                </p>
                <p>
                  <strong>UV Index:</strong>{" "}
                  {weatherData.weatherData.current.uv_index}
                </p>
              </div>
            ) : (
              <div className="bg-white text-sm text-gray-800 font-mono p-4 rounded border border-gray-300">
                <code>
                  {JSON.stringify(weatherData.weatherData, null, 2)}
                </code>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

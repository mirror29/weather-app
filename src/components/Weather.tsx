"use client";

import React, { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherCard } from "@/components/WeatherCard";
import {
  Search,
  MapPin,
  RefreshCcw,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { getWeatherForecast } from "@/lib/weatherApi";

// 定义所需的数据接口
interface WeatherData {
  city: string;
  list: DailyForecast[];
  country: string;
}

interface DailyForecast {
  dt: number;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  humidity: number;
  wind_speed: number;
}

const POPULAR_CITIES = ["Shanghai", "Beijing", "Tokyo", "London", "New York"];

export function Weather() {
  const [city, setCity] = useState<string>("Shanghai");
  const [searchInput, setSearchInput] = useState<string>("Shanghai");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  // 用于客户端水合的标志
  const [isMounted, setIsMounted] = useState(false);

  // 创建滑动引用
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchWeather = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherForecast(cityName);
      setWeatherData(data);
      setCity(cityName);
      // 设置更新时间为可读字符串，避免日期对象序列化问题
      const now = new Date();
      setLastUpdated(
        `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`
      );
    } catch (err: unknown) {
      console.error("Error fetching weather:", err);
      let errorMessage =
        "Could not fetch weather data. Please try another city.";
      if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 处理滑动
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount =
        direction === "left"
          ? -current.offsetWidth / 2
          : current.offsetWidth / 2;

      current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // 确保组件只在客户端渲染后执行API调用
  useEffect(() => {
    setIsMounted(true);
    fetchWeather(city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 如果组件未挂载(客户端渲染)，返回骨架屏
  if (!isMounted) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Weather Forecast
          </h1>
          <div className="flex gap-2 max-w-md mx-auto mb-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput);
    }
  };

  const handleCityClick = (city: string) => {
    setSearchInput(city);
    fetchWeather(city);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
          {weatherData
            ? `${weatherData.city}, ${weatherData.country}`
            : "Weather Forecast"}
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex gap-2 max-w-md mx-auto mb-4"
        >
          <Input
            type="text"
            placeholder="Enter city name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 shadow-sm"
          />
          <Button type="submit" variant="default" className="shadow-sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {POPULAR_CITIES.map((cityName) => (
            <Button
              key={cityName}
              variant="outline"
              size="sm"
              onClick={() => handleCityClick(cityName)}
              className={`${
                cityName === city ? "bg-primary/20" : ""
              } transition-all hover:scale-105`}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {cityName}
            </Button>
          ))}
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-center mb-4 animate-pulse">
            {error}
          </div>
        )}

        {lastUpdated && (
          <div className="flex justify-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchWeather(city)}
              className="text-xs hover:bg-primary/10 transition-colors"
            >
              <RefreshCcw className="h-3 w-3 mr-1" />
              Last updated: {lastUpdated}
            </Button>
          </div>
        )}
      </div>

      {/* 滑动容器 */}
      <div className="relative">
        {/* 滑动按钮 */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full shadow-md hidden md:flex"
          onClick={() => handleScroll("left")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 md:pb-2 scrollbar-hide snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loading ? (
            Array(7)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4 snap-start"
                >
                  <Skeleton className="h-[250px] w-full rounded-lg" />
                </div>
              ))
          ) : weatherData && weatherData.list.length > 0 ? (
            weatherData.list.map((forecast, index) => (
              <div
                key={forecast.dt}
                className="flex-shrink-0 w-full md:w-1/2 lg:w-1/4 snap-start"
              >
                <WeatherCard forecast={forecast} isToday={index === 0} />
              </div>
            ))
          ) : (
            <div className="flex-1 text-center py-8 text-gray-500">
              No weather data available
            </div>
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full shadow-md hidden md:flex"
          onClick={() => handleScroll("right")}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 额外的天气信息 */}
      {weatherData && !loading && (
        <div className="mt-8 p-4 bg-background/50 rounded-lg shadow-sm border-0 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-2">Weather Information</h2>
          <p className="text-sm text-muted-foreground">
            The weather forecast is provided for {weatherData.city},{" "}
            {weatherData.country} and is updated regularly. The forecast data
            includes temperature, weather conditions, humidity, and wind speed.
          </p>
          <div className="mt-4 text-xs text-muted-foreground text-right">
            Data source: OpenWeatherMap
          </div>
        </div>
      )}
    </div>
  );
}

// 添加默认导出，以便动态导入可以正常工作
export default Weather;

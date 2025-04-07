"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Droplets, Wind, Thermometer } from "lucide-react";

// 导入所需接口
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

// 将OpenWeatherMap图标码映射到图标URL
const getWeatherIconUrl = (iconCode: string): string => {
  // 为了避免SVG路径问题，我们使用备选的官方图标
  if (typeof window !== "undefined") {
    // 客户端尝试使用自定义图标
    const iconMap: Record<string, string> = {
      // 晴天 (clear sky)
      "01d": "clear-day",
      "01n": "clear-night",
      // 少云 (few clouds)
      "02d": "partly-cloudy-day",
      "02n": "partly-cloudy-night",
      // 散云 (scattered clouds)
      "03d": "cloudy",
      "03n": "cloudy",
      // 多云 (broken clouds)
      "04d": "cloudy",
      "04n": "cloudy",
      // 阵雨 (shower rain)
      "09d": "rain",
      "09n": "rain",
      // 小雨/中雨 (rain)
      "10d": "rain",
      "10n": "rain",
      // 雷雨 (thunderstorm)
      "11d": "thunderstorm",
      "11n": "thunderstorm",
      // 雪 (snow)
      "13d": "snow",
      "13n": "snow",
      // 雾霾 (mist)
      "50d": "fog",
      "50n": "fog",
    };

    const iconName = iconMap[iconCode] || "cloudy";
    return `/weather-icons/${iconName}.svg`;
  } else {
    // 服务器端渲染或自定义图标加载失败时使用官方图标
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
};

// Map weather conditions to background gradients for a more visual experience
const weatherBackgrounds: Record<string, string> = {
  Clear:
    "bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-blue-900 dark:to-indigo-950",
  Clouds:
    "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
  Rain: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950",
  Snow: "bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-900",
  Thunderstorm:
    "bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-950",
  Drizzle:
    "bg-gradient-to-br from-blue-100 to-gray-200 dark:from-blue-900 dark:to-gray-900",
  Mist: "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900",
  Smoke:
    "bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-900",
  Haze: "bg-gradient-to-br from-yellow-100 to-gray-200 dark:from-yellow-900 dark:to-gray-900",
  Dust: "bg-gradient-to-br from-yellow-200 to-orange-100 dark:from-yellow-900 dark:to-orange-950",
  Fog: "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900",
};

// 天气图标动画样式
const weatherAnimations: Record<string, string> = {
  Clear: "animate-pulse",
  Clouds: "animate-bounce",
  Rain: "animate-bounce",
  Snow: "animate-spin-slow",
  Thunderstorm: "animate-pulse",
  Drizzle: "animate-bounce",
};

interface WeatherCardProps {
  forecast: DailyForecast;
  isToday?: boolean;
}

// 自定义日期格式化函数，避免使用toLocaleString等方法
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  return `${dayName}, ${monthName} ${dayNum}`;
};

export function WeatherCard({ forecast, isToday = false }: WeatherCardProps) {
  const { temp, weather, humidity, wind_speed, dt } = forecast;
  const weatherData = weather[0];
  const date = formatDate(dt);

  // Choose background based on weather condition or use a default
  const bgClass = weatherBackgrounds[weatherData.main] || "bg-card";

  // Choose animation based on weather condition or use none
  const animationClass = weatherAnimations[weatherData.main] || "";

  return (
    <Card
      className={`w-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 ${
        isToday ? "shadow-primary/20" : ""
      }`}
    >
      <div className={`${bgClass} p-4`}>
        <CardHeader className="p-0 pb-2">
          <CardTitle className={`text-lg ${isToday ? "font-bold" : ""}`}>
            {isToday ? "Today" : date}
          </CardTitle>
          <CardDescription className="font-medium text-foreground/80">
            {weatherData.description}
          </CardDescription>
        </CardHeader>

        <div className="relative h-24 w-24 mx-auto my-4">
          <div className={`${animationClass}`}>
            <Image
              src={getWeatherIconUrl(weatherData.icon)}
              alt={weatherData.description}
              fill
              className="object-contain drop-shadow-md"
            />
          </div>
        </div>
      </div>

      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold flex items-center">
            <Thermometer className="h-6 w-6 mr-1 text-red-500" />
            {Math.round(temp.day)}°C
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm font-medium">
              H: {Math.round(temp.max)}°C
            </div>
            <div className="text-sm text-muted-foreground">
              L: {Math.round(temp.min)}°C
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-sm py-4 bg-background/50">
        <div className="flex items-center gap-1">
          <Droplets className="h-4 w-4 text-blue-500 animate-bounce" />
          <span>{humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-4 w-4 text-gray-500" />
          <span>{Math.round(wind_speed)} km/h</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default WeatherCard;

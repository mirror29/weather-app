"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Droplets, Wind, Thermometer } from "lucide-react";
import WeatherIcon from "./WeatherIcon";

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

// Map weather conditions to background gradients for a more visual experience
const weatherBackgrounds: Record<string, string> = {
  Clear:
    "bg-gradient-to-br from-yellow-100 to-blue-100 dark:from-blue-900 dark:to-indigo-950",
  Clouds:
    "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900",
  "scattered clouds":
    "bg-gradient-to-br from-gray-200 to-blue-100 dark:from-gray-700 dark:to-blue-900",
  "broken clouds":
    "bg-gradient-to-br from-gray-300 to-gray-100 dark:from-gray-800 dark:to-gray-700",
  "few clouds":
    "bg-gradient-to-br from-blue-50 to-gray-100 dark:from-blue-950 dark:to-gray-900",
  "overcast clouds":
    "bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
  Rain: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950",
  "light rain":
    "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-800 dark:to-blue-900",
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
  "scattered clouds": "animate-bounce-slow",
  "broken clouds": "animate-pulse-slow",
  "few clouds": "animate-pulse",
  "overcast clouds": "animate-pulse-slow",
  Rain: "animate-bounce",
  "light rain": "animate-bounce",
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

  // Debug weather conditions
  console.log("Weather condition:", weatherData.description, weatherData.icon);

  // Choose background based on weather condition or description
  const bgClass =
    weatherBackgrounds[weatherData.description] ||
    weatherBackgrounds[weatherData.main] ||
    "bg-card";

  // Choose animation based on weather condition or description
  const animationClass =
    weatherAnimations[weatherData.description] ||
    weatherAnimations[weatherData.main] ||
    "";

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
            <WeatherIcon
              iconCode={weatherData.icon}
              description={weatherData.description}
              className="drop-shadow-md"
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

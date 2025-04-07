"use client";

import { useState } from "react";
import Image from "next/image";

interface WeatherIconProps {
  iconCode: string;
  description: string;
  className?: string;
}

export default function WeatherIcon({
  iconCode,
  description,
  className = "",
}: WeatherIconProps) {
  const [fallbackActive, setFallbackActive] = useState(false);

  // Determine primary SVG path
  const getSvgPath = () => {
    // Standard icon mapping
    const iconMap: Record<string, string> = {
      "01d": "clear-day",
      "01n": "clear-night",
      "02d": "partly-cloudy-day",
      "02n": "partly-cloudy-night",
      "03d": "cloudy",
      "03n": "cloudy",
      "04d": "cloudy",
      "04n": "cloudy",
      "09d": "rain",
      "09n": "rain",
      "10d": "rain",
      "10n": "rain",
      "11d": "thunderstorm",
      "11n": "thunderstorm",
      "13d": "snow",
      "13n": "snow",
      "50d": "fog",
      "50n": "fog",
    };

    const iconName = iconMap[iconCode] || "cloudy";
    return `/weather-icons/${iconName}.svg`;
  };

  // OpenWeatherMap backup URL
  const fallbackUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Handle error loading SVG
  const handleError = () => {
    console.log(`Error loading icon for ${description}, using fallback`);
    setFallbackActive(true);
  };

  // Use fallback immediately for server rendering
  if (typeof window === "undefined") {
    return (
      <Image
        src={fallbackUrl}
        alt={description}
        className={`${className} w-full h-full object-contain min-h-[80px]`}
      />
    );
  }

  return fallbackActive ? (
    // Fallback to OpenWeatherMap official icon
    <Image
      src={fallbackUrl}
      alt={description}
      className={`${className} w-full h-full object-contain min-h-[80px]`}
    />
  ) : (
    // Try SVG icon first
    <Image
      src={getSvgPath()}
      alt={description}
      fill
      className={`${className} object-contain min-h-[80px]`}
      onError={handleError}
    />
  );
}

import axios from "axios";

export interface WeatherData {
  city: string;
  list: DailyForecast[];
  country: string;
}

export interface DailyForecast {
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

export const getWeatherForecast = async (
  city: string = "Shanghai"
): Promise<WeatherData> => {
  try {
    // 使用我们自己的API路由而不是直接调用外部API
    const response = await axios.get(
      `/api/weather?city=${encodeURIComponent(city)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

// Helper function to get weather icon URL
export const getWeatherIconUrl = (iconCode: string): string => {
  // 将OpenWeatherMap图标码映射到图标名称
  const iconMap: Record<string, string> = {
    // 晴天
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
};

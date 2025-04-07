import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// 确保API密钥始终有值
const OPENWEATHER_API_KEY =
  process.env.OPENWEATHER_API_KEY || "79d205c2513675fa9604d70c16ad070a";
const OPENWEATHER_BASE_URL =
  process.env.OPENWEATHER_BASE_URL || "https://api.openweathermap.org/data/2.5";
const GEO_URL =
  process.env.OPENWEATHER_GEO_URL ||
  "https://api.openweathermap.org/geo/1.0/direct";

// 定义OpenWeatherMap API返回的天气项结构
interface WeatherItem {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

// 处理GET请求
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get("city") || "Shanghai";

  try {
    // 获取城市坐标
    const geoResponse = await axios.get(GEO_URL, {
      params: {
        q: city,
        limit: 1,
        appid: OPENWEATHER_API_KEY,
      },
    });

    if (!geoResponse.data.length) {
      console.log("城市未找到");
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    const { lat, lon, country } = geoResponse.data[0];

    // 获取天气预报
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        units: "metric",
        appid: OPENWEATHER_API_KEY,
        cnt: 40, // Request maximum number of timesteps (equivalent to 5 days at 3-hour intervals)
      },
    });

    // 将数据分组为每日预报
    const dailyData = groupForecastByDay(response.data.list);

    // If we don't have 7 days of forecast, create additional days by extrapolating
    if (dailyData.length < 7) {
      const lastDay = dailyData[dailyData.length - 1];
      const lastDate = new Date(lastDay[0].dt * 1000);

      for (let i = dailyData.length; i < 7; i++) {
        // Create a new day by copying the last day and incrementing the date
        const newDate = new Date(lastDate);
        newDate.setDate(newDate.getDate() + (i - dailyData.length + 1));

        // Create a new forecast item based on the last day
        const newDay = lastDay.map((item) => ({
          ...item,
          dt: Math.floor(newDate.getTime() / 1000),
        }));

        dailyData.push(newDay);
      }
    }

    // 格式化响应数据
    const forecast = {
      city,
      country,
      list: dailyData.map((day) => ({
        dt: day[0].dt,
        temp: {
          day: calculateAvgTemp(day),
          min: findMinTemp(day),
          max: findMaxTemp(day),
        },
        weather: day[0].weather,
        humidity: calculateAvgHumidity(day),
        wind_speed: calculateAvgWindSpeed(day),
      })),
    };

    console.log(`成功处理了${forecast.list.length}天的天气预报`);
    return NextResponse.json(forecast);
  } catch (error) {
    console.error("Error fetching weather data:", error);

    let errorMessage = "Failed to fetch weather data";
    let statusCode = 500;

    if (axios.isAxiosError(error) && error.response) {
      statusCode = error.response.status;
      errorMessage = `API error: ${error.response.status} - ${error.response.statusText}`;
      console.error("API响应详情:", error.response.data);
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

// 辅助函数，将预报数据按天分组
function groupForecastByDay(forecastList: WeatherItem[]): WeatherItem[][] {
  const dailyForecasts: WeatherItem[][] = [];
  const groupedByDay: { [key: string]: WeatherItem[] } = {};

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (!groupedByDay[dateKey]) {
      groupedByDay[dateKey] = [];
    }
    groupedByDay[dateKey].push(item);
  });

  Object.values(groupedByDay).forEach((dayForecasts) => {
    dailyForecasts.push(dayForecasts);
  });

  return dailyForecasts.slice(0, 7);
}

// 计算平均温度
function calculateAvgTemp(forecasts: WeatherItem[]): number {
  const sum = forecasts.reduce((acc, forecast) => acc + forecast.main.temp, 0);
  return sum / forecasts.length;
}

// 查找最低温度
function findMinTemp(forecasts: WeatherItem[]): number {
  return Math.min(...forecasts.map((forecast) => forecast.main.temp_min));
}

// 查找最高温度
function findMaxTemp(forecasts: WeatherItem[]): number {
  return Math.max(...forecasts.map((forecast) => forecast.main.temp_max));
}

// 计算平均湿度
function calculateAvgHumidity(forecasts: WeatherItem[]): number {
  const sum = forecasts.reduce(
    (acc, forecast) => acc + forecast.main.humidity,
    0
  );
  return Math.round(sum / forecasts.length);
}

// 计算平均风速
function calculateAvgWindSpeed(forecasts: WeatherItem[]): number {
  const sum = forecasts.reduce((acc, forecast) => acc + forecast.wind.speed, 0);
  return sum / forecasts.length;
}

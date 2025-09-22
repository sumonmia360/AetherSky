"use client";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface WeatherApiResponse {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherData[];
  city: City;
}

export interface WeatherData {
  dt: number;
  main: MainWeatherData;
  weather: WeatherDescription[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  sys: Sys;
  dt_txt: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

export interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Clouds {
  all: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Rain {
  "3h": number;
}

export interface Sys {
  pod: string;
}

export interface City {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export default function Index() {
  const { isPending, error, data } = useQuery<WeatherApiResponse>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=dhaka&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    },
  });
  console.log("Data", data?.city.name);

  if (isPending)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loadnig..</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar></Navbar>
    </div>
  );
}

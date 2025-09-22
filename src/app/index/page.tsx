"use client";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import convertKelvinToCelsius from "@/utils/convertKelvinToCelsius";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

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
  console.log("Data", data?.list[0]);
  const firstData = data?.list[0];

  if (isPending)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loadnig..</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar></Navbar>
      <main className="px-3 max-w-7xl flex flex-col gap-9 mx-auto w-full pb-10 pt-4">
        {/* today Data */}
        <section className="">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>{format(firstData?.dt_txt ?? "", "eeee")}</p>
              <p className="text-lg">
                ({format(firstData?.dt_txt ?? "", "MM/dd/yyyy")})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* temperature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span>Feel like</span>
                  <span>
                    {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className="text-xs space-x-2 ">
                  <span>
                    {" "}
                    {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}°↓
                  </span>
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}°↑
                  </span>
                </p>
              </div>
              {/* Time and wearther icon */}
              <div className="flex gap-10 sm:gap-16  overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-between gap-2 items-center text-sm font-semibold"
                  >
                    <p className="whitespace-nowrap ">
                      {format(d.dt_txt, "h:mm a")}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
        </section>
        {/* 7 days forcast data */}
        <section></section>
      </main>
    </div>
  );
}

"use client";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import convertKelvinToCelsius from "@/utils/convertKelvinToCelsius";
import convertWindSpeed from "@/utils/convertWindSpeed";
import metersToKilometers from "@/utils/metersToKilometers";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  format,
  formatDistance,
  formatRelative,
  fromUnixTime,
  subDays,
} from "date-fns";
import { useAtom } from "jotai";
import { LoadingCityAtom, PlaceAtom } from "../atom";
import { useEffect } from "react";

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
  const [place, setPlace] = useAtom(PlaceAtom);
  const [loadingCity, setLoadingCity] = useAtom(LoadingCityAtom);
  const { isPending, error, data, refetch } = useQuery<WeatherApiResponse>({
    queryKey: ["repoData"],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    },
  });
  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  if (isPending)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loadnig..</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={data?.city.name}></Navbar>
      {loadingCity ? (
        <WeatherSkeleton />
      ) : (
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
                      <WeatherIcon iconname={d.weather[0].icon}></WeatherIcon>
                      <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}</p>
                    </div>
                  ))}
                </div>
                <div></div>
              </Container>
            </div>
            <div className="flex py-4  gap-4">
              {/* Left  */}
              <Container className="w-fit justify-center flex-col px-4 items-center ">
                <div className="capitalize text-center">
                  {firstData?.weather[0].description}
                  <WeatherIcon
                    iconname={firstData?.weather[0].icon ?? ""}
                  ></WeatherIcon>
                </div>
              </Container>
              {/* Right  */}
              <Container className="bg-yellow-300/80  px-6 gap-4  justify-between overflow-x-auto">
                <WeatherDetails
                  visability={metersToKilometers(
                    firstData?.visibility ?? 10000
                  )}
                  humidity={`${firstData?.main.pressure} hpa`}
                  airPressure={`${firstData?.main.humidity} %`}
                  sunrise={format(
                    fromUnixTime(data?.city.sunrise ?? 1025486956),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(data?.city.sunset ?? 1025486956),
                    "H:mm"
                  )}
                  windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.6)}
                ></WeatherDetails>
              </Container>
            </div>
          </section>
          {/* 7 days forcast data */}
        </main>
      )}
    </div>
  );
}
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-300/70 rounded ${className}`} />
);

function WeatherSkeleton() {
  return (
    <main className="px-3 max-w-7xl flex flex-col gap-9 mx-auto w-full pb-10 pt-4">
      {/* Today Data */}
      <section>
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-5 w-28" />
          </h2>
          <div className="flex flex-col md:flex-row gap-10 px-6 items-center">
            {/* Temperature */}
            <div className="flex flex-col px-4 items-start gap-2">
              <Skeleton className="h-12 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            {/* Time + Weather Icon */}
            <div className="flex gap-6 sm:gap-12 overflow-x-auto w-full pr-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-between gap-2 items-center text-sm font-semibold"
                >
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extra Details */}
        <div className="flex py-4 gap-4">
          {/* Left */}
          <div className="w-fit flex-col px-4 items-center justify-center">
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          {/* Right */}
          <div className="bg-yellow-200/50 px-6 gap-4 flex justify-between overflow-x-auto w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 items-center min-w-[80px]"
              >
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

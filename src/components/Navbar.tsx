"use client";
import React, { useState } from "react";
import { MdWbSunny } from "react-icons/md";
import { MdMyLocation } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import SearchBox from "./SearchBox";
import axios from "axios";
import { set } from "date-fns";
import { useAtom } from "jotai";
import { LoadingCityAtom, PlaceAtom } from "@/app/atom";

type Props = { location?: string };

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(PlaceAtom);
  const [loadingCity, setLoadingCity] = useAtom(LoadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
        );
        const suggestionss = response.data.list.map((item: any) => item.name);

        setSuggestions(suggestionss);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoadingCity(true);
    e.preventDefault();
    if (suggestions.length == 0) {
      setError("Location not found ");
      setLoadingCity(false);
    } else {
      setError("");
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
      }, 500);
    }
  }
  return (
    <nav className="shadow-sm top-0 left-0 sticky z-50 bg-white">
      <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3  mx-auto">
        <div className=" flex items-center justify-between  gap-2">
          <h2 className="text-gray-500 text-3xl">weather</h2>
          <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
        </div>
        <section className="flex gap-2 items-center">
          <MdOutlineLocationOn className="text-3xl" />
          <p className="text-slate-900/80 text-sm">{location}</p>
          <div className="relative">
            <SearchBox
              onSubmit={handleSubmitSearch}
              value={city}
              onChange={(e) => handleInputChange(e.target.value)}
            ></SearchBox>
            <SuggestionsBox
              {...{
                showSuggestions,
                suggestions,
                handleSuggestionClick,
                error,
              }}
            ></SuggestionsBox>
          </div>
        </section>
      </div>
    </nav>
  );
}

function SuggestionsBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error,
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {(showSuggestions && suggestions.length > 1) ||
        (error && (
          <ul className="mb-4 bg-white absolute border  top-[44px] left-0 border-gray-300  rounded-md  min-w-[200px]  flex flex-col  gap-1 py-2 px-2 ">
            {error && suggestions.length < 1 && (
              <li className="text-red-500 p-1"> {error}</li>
            )}
            {suggestions.map((item, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(item)}
                className="cursor-pointer  p-1  rounded  hover:bg-gray-200"
              >
                {item}
              </li>
            ))}
          </ul>
        ))}
    </>
  );
}

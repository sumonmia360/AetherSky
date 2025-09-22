import cn from "@/utils/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
  className?: string;
  value: string;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
};

export default function SearchBox(props: Props) {
  return (
    <form
      onSubmit={props.onSubmit}
      className={cn("flex relative justify-center h-10", props.className)}
    >
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search Location.."
        className="px-4 py-2  w-[240px] border border-gray-300 rounded-l-md  focus:outline-none  hover:bg-blue-500  h-full"
      />{" "}
      <button className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md hover:bg-blue-500  h-full ">
        <IoSearch />
      </button>
    </form>
  );
}

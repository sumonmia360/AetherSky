import cn from "@/utils/cn";
import React from "react";

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full border rounded-xl py-4 shadow-sm bg-white",
        props.className
      )}
    />
  );
}

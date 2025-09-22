"use client";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
const queryClient = new QueryClient();

import Index from "./index/page";

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Index></Index>
      </div>
    </QueryClientProvider>
  );
}

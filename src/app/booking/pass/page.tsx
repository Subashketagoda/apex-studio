"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BookingPassClient from "@/components/BookingPassClient";

function BookingPassWrapper() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "APX-1001";
  return <BookingPassClient id={id} />;
}

export default function BookingPassStaticPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-accent font-mono text-xs tracking-widest uppercase">
          RETRIEVING VIP ACCESS PASS...
        </div>
      }
    >
      <BookingPassWrapper />
    </Suspense>
  );
}

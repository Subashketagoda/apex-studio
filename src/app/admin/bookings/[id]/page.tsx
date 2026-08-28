import { Suspense } from "react";
import BookingDetailClient from "@/components/admin/BookingDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return [
    { id: "APX-1001" },
    { id: "APX-1002" },
    { id: "APX-2026-000001" },
  ];
}

export default async function AdminBookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-accent font-mono text-xs tracking-widest uppercase">
          AUDITING RESERVATION DETAILS...
        </div>
      }
    >
      <BookingDetailClient id={id} />
    </Suspense>
  );
}

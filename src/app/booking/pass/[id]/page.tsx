import BookingPassClient from "@/lib/../components/BookingPassClient";

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

export default async function BookingPassPage({ params }: PageProps) {
  const { id } = await params;
  return <BookingPassClient id={id} />;
}

import { Suspense } from "react";
import AdminVerifyClient from "@/components/admin/AdminVerifyClient";

export default function AdminVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-accent font-mono text-xs uppercase tracking-widest">
          INITIALIZING DOOR QR SCANNER...
        </div>
      }
    >
      <AdminVerifyClient />
    </Suspense>
  );
}

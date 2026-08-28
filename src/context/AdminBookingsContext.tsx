"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { Booking, BookingStatus, UpdateBookingRequest } from "@/lib/types/booking";
import { useAdminAuth } from "./AdminAuthContext";

export interface ActivityLogItem {
  id: string;
  action: string;
  bookingId: string;
  details: string;
  timestamp: string;
  admin: string;
  type: "CREATE" | "STATUS" | "RESCHEDULE" | "EDIT" | "PASS" | "SYNC";
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  bookingId?: string;
}

interface AdminBookingsContextType {
  bookings: Booking[];
  loading: boolean;
  isRealtimeActive: boolean;
  activities: ActivityLogItem[];
  notifications: AdminNotification[];
  unreadNotificationCount: number;
  markNotificationsAsRead: () => void;
  refreshBookings: () => Promise<void>;
  updateStatus: (id: string, newStatus: BookingStatus) => Promise<{ success: boolean; data?: Booking; error?: string }>;
  updateDetails: (id: string, updates: UpdateBookingRequest) => Promise<{ success: boolean; data?: Booking; error?: string }>;
  reschedule: (id: string, newDate: string, newStartTime: string) => Promise<{ success: boolean; data?: Booking; error?: string }>;
  regeneratePass: (id: string) => Promise<{ success: boolean; data?: Booking; error?: string }>;
  retrySync: (id: string) => Promise<{ success: boolean; data?: Booking; error?: string }>;
}

const AdminBookingsContext = createContext<AdminBookingsContextType | undefined>(undefined);

export function AdminBookingsProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(false);
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  // Initial fetch from REST API and localStorage
  const refreshBookings = useCallback(async () => {
    // 1. Check localStorage first
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("apex_local_bookings");
        if (raw) {
          const localList: Booking[] = JSON.parse(raw);
          if (Array.isArray(localList) && localList.length > 0) {
            setBookings(localList);
          }
        }
      } catch {}
    }

    try {
      const res = await fetch("/api/bookings");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBookings((prev) => {
          const combined = [...json.data];
          prev.forEach((p) => {
            if (!combined.some((c) => c.id === p.id)) {
              combined.unshift(p);
            }
          });
          return combined;
        });
      }
    } catch (err) {
      console.warn("Notice: REST fetch fallback active:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Connect Real-Time Cloud Firestore Snapshot
  useEffect(() => {
    if (!isAuthenticated) return;

    refreshBookings();

    try {
      const bookingsCol = collection(db, "bookings");
      const q = query(bookingsCol, orderBy("createdAt", "desc"));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const realtimeDocs: Booking[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data() as any;
              realtimeDocs.push({
                ...data,
                id: doc.id,
                version: data.version || data.bookingPassVersion || 1,
              });
            });
            setBookings(realtimeDocs);
            setIsRealtimeActive(true);
            setLoading(false);
          }
        },
        (error) => {
          console.warn("[Firestore] Realtime snapshot listener:", error?.message);
          setIsRealtimeActive(false);
        }
      );

      return () => unsubscribe();
    } catch {
      setIsRealtimeActive(false);
    }
  }, [isAuthenticated, refreshBookings]);

  // Record an activity item
  const recordActivity = (
    action: string,
    bookingId: string,
    details: string,
    type: ActivityLogItem["type"]
  ) => {
    const newActivity: ActivityLogItem = {
      id: "act-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      action,
      bookingId,
      details,
      timestamp: new Date().toISOString(),
      admin: "Producer Desk",
      type,
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 49)]);

    // Generate Notification
    const newNotification: AdminNotification = {
      id: "notif-" + Date.now(),
      title: action,
      message: `${bookingId}: ${details}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: type === "STATUS" ? "success" : type === "RESCHEDULE" ? "warning" : "info",
      bookingId,
    };
    setNotifications((prev) => [newNotification, ...prev.slice(0, 19)]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Actions
  const updateStatus = async (id: string, newStatus: BookingStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? json.data : b)));
        recordActivity(
          `Status changed to ${newStatus}`,
          id,
          `Booking marked as ${newStatus} with Google Calendar and Discord sync.`,
          "STATUS"
        );
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || "Failed to update status." };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error." };
    }
  };

  const updateDetails = async (id: string, updates: UpdateBookingRequest) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? json.data : b)));
        recordActivity(
          "Details Updated",
          id,
          `Modified customer/session metadata. Sync dispatched.`,
          "EDIT"
        );
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || "Failed to save details." };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error." };
    }
  };

  const reschedule = async (id: string, newDate: string, newStartTime: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newDate,
          startTime: newStartTime,
          status: "CONFIRMED",
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? json.data : b)));
        recordActivity(
          "Session Rescheduled",
          id,
          `Moved to ${newDate} at ${newStartTime}. Pass incremented to v${json.data.version}.`,
          "RESCHEDULE"
        );
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || "Reschedule failed." };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error." };
    }
  };

  const regeneratePass = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/regenerate-pass`, { method: "POST" });
      const json = await res.json();
      if (json.success && json.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? json.data : b)));
        recordActivity(
          "Pass Regenerated",
          id,
          `Issued new revision v${json.data.version}. Older passes invalidated.`,
          "PASS"
        );
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || "Pass regeneration failed." };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error." };
    }
  };

  const retrySync = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/sync`, { method: "POST" });
      const json = await res.json();
      if (json.success && json.data) {
        setBookings((prev) => prev.map((b) => (b.id === id ? json.data : b)));
        recordActivity(
          "Sync Retried",
          id,
          `Re-dispatched Google Calendar and Discord sync pipelines.`,
          "SYNC"
        );
        return { success: true, data: json.data };
      }
      return { success: false, error: json.error || "Sync retry failed." };
    } catch (err: any) {
      return { success: false, error: err?.message || "Network error." };
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AdminBookingsContext.Provider
      value={{
        bookings,
        loading,
        isRealtimeActive,
        activities,
        notifications,
        unreadNotificationCount,
        markNotificationsAsRead,
        refreshBookings,
        updateStatus,
        updateDetails,
        reschedule,
        regeneratePass,
        retrySync,
      }}
    >
      {children}
    </AdminBookingsContext.Provider>
  );
}

export function useAdminBookings() {
  const context = useContext(AdminBookingsContext);
  if (!context) {
    throw new Error("useAdminBookings must be used within an AdminBookingsProvider");
  }
  return context;
}

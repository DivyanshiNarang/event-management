import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Event } from "@/lib/types";

export function useEvents(category?: string, search?: string) {
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (category && category !== "All") params.category = category;
      if (search) params.search = search;
      const { data } = await api.get("/events", { params });
      setEvents(data.events);
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => { fetch(); }, [fetch]);

  return { events, loading, error, refetch: fetch };
}

export function useEvent(id: string) {
  const [event, setEvent]     = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data.event);
      } catch (e: any) {
        setError(e.response?.data?.message || "Event not found");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return { event, loading, error };
}

export function useSavedEvents() {
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users/saved-events");
      setEvents(data.events);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const toggleSave = async (eventId: string) => {
    try {
      await api.post(`/events/${eventId}/save`);
      fetch();
    } catch {}
  };

  return { events, loading, refetch: fetch, toggleSave };
}

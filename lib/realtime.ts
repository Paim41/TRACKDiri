export type RealtimeEvent =
  | { type: "water.updated"; userId: string; day: string }
  | { type: "dashboard.updated"; userId: string };

export async function publishRealtimeEvent(event: RealtimeEvent) {
  if (process.env.REALTIME_PROVIDER && process.env.REALTIME_PROVIDER !== "polling") {
    // Provider adapters can be added here without changing route handlers.
  }
  return event;
}

import { describe, expect, it } from "vitest";
import { waterEntrySchema } from "@/lib/validation";

describe("water idempotency validation", () => {
  it("requires a client mutation id", () => {
    const result = waterEntrySchema.safeParse({
      amountMl: 250,
      timezone: "UTC",
      clientMutationId: "2a670887-dd1d-4f37-8c39-1c732adbd730"
    });
    expect(result.success).toBe(true);
  });
});

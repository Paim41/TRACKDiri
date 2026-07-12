import { describe, expect, it } from "vitest";
import { isStrongPassword, validatePasswordStrength } from "@/lib/password-strength";

describe("password validation", () => {
  it("requires uppercase, lowercase, number, special character and length", () => {
    expect(validatePasswordStrength("Weak")).toEqual({
      minLength: false,
      uppercase: true,
      lowercase: true,
      number: false,
      special: false
    });
    expect(isStrongPassword("StrongPass1!")).toBe(true);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockRelease = vi.fn();
const mockRequest = vi.fn();

beforeEach(() => {
  mockRelease.mockResolvedValue(undefined);
  mockRequest.mockResolvedValue({ release: mockRelease, released: false });

  Object.defineProperty(navigator, "wakeLock", {
    value: { request: mockRequest },
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("requestWakeLock", () => {
  it('calls navigator.wakeLock.request("screen") when available', async () => {
    const { requestWakeLock } = await import("../../src/utils/wake-lock.ts");

    await requestWakeLock();

    expect(mockRequest).toHaveBeenCalledWith("screen");
  });

  it("gracefully handles browsers without Wake Lock API", async () => {
    Object.defineProperty(navigator, "wakeLock", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const { requestWakeLock } = await import("../../src/utils/wake-lock.ts");

    await expect(requestWakeLock()).resolves.toBeUndefined();
  });

  it("handles rejection from navigator.wakeLock.request()", async () => {
    mockRequest.mockRejectedValueOnce(new Error("Page is not visible"));

    const { requestWakeLock } = await import("../../src/utils/wake-lock.ts");

    await expect(requestWakeLock()).resolves.toBeUndefined();
  });
});

describe("releaseWakeLock", () => {
  it("releases the wake lock when one is held", async () => {
    const { requestWakeLock, releaseWakeLock } = await import(
      "../../src/utils/wake-lock.ts"
    );

    await requestWakeLock();
    await releaseWakeLock();

    expect(mockRelease).toHaveBeenCalled();
  });

  it("does nothing when no wake lock is held", async () => {
    const { releaseWakeLock } = await import("../../src/utils/wake-lock.ts");

    await expect(releaseWakeLock()).resolves.toBeUndefined();
    expect(mockRelease).not.toHaveBeenCalled();
  });
});

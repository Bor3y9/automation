import { processTextMessage } from "./ai";

describe("processTextMessage", () => {
  test("should correctly extract entities and classify a LEAD intent", () => {
    const message =
      "Hi, I'm Ahmed from Nile Real Estate, we need a dashboard for sales KPIs next month. Phone 01012345678, email ahmed@nile.com";

    const result = processTextMessage(message);

    expect(result.name).toBe("Ahmed");
    expect(result.company).toBe("Nile Real Estate");
    expect(result.email).toBe("ahmed@nile.com");
    expect(result.phone).toBe("01012345678");
    expect(result.intent).toBe("LEAD");
    expect(result.department).toBe("Sales");
    expect(result.keywords).toContain("dashboard");
  });

  test("should correctly classify a SUPPORT intent", () => {
    const message =
      "Hello, my login is not working and I need some help with my account. Can you assist?";

    const result = processTextMessage(message);

    expect(result.intent).toBe("SUPPORT");
    expect(result.department).toBe("Support");
    expect(result.keywords).toContain("help");
    expect(result.keywords).toContain("account");
    expect(result.name).toBeNull();
    expect(result.email).toBeNull();
  });
});

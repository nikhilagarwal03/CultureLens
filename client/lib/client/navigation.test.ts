import { DASHBOARD_ROUTE, ONBOARDING_ROUTE, isDashboardRouteActive, resolveDashboardHref } from "./navigation";

describe("navigation route helpers", () => {
  it("routes profile owners to the dashboard", () => {
    expect(resolveDashboardHref(true)).toBe(DASHBOARD_ROUTE);
  });

  it("routes users without a saved profile to onboarding", () => {
    expect(resolveDashboardHref(false)).toBe(ONBOARDING_ROUTE);
  });

  it("marks the active dashboard route based on the resolved destination", () => {
    expect(isDashboardRouteActive("/app/result", DASHBOARD_ROUTE)).toBe(true);
    expect(isDashboardRouteActive("/onboarding", ONBOARDING_ROUTE)).toBe(true);
    expect(isDashboardRouteActive("/profile", ONBOARDING_ROUTE)).toBe(false);
  });
});
export const DASHBOARD_ROUTE = "/app";
export const ONBOARDING_ROUTE = "/onboarding";

export function resolveDashboardHref(hasSavedProfile: boolean): string {
  return hasSavedProfile ? DASHBOARD_ROUTE : ONBOARDING_ROUTE;
}

export function isDashboardRouteActive(pathname: string, dashboardHref: string): boolean {
  return dashboardHref === DASHBOARD_ROUTE ? pathname.startsWith(DASHBOARD_ROUTE) : pathname === ONBOARDING_ROUTE;
}
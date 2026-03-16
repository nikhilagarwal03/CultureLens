import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppDashboardPage from "./page";
import { useAppState } from "@/components/providers/app-provider";
import { useRouter } from "next/navigation";
import { searchCultureReference } from "@/lib/client/search";

// Mock the dependencies
jest.mock("@/components/providers/app-provider");
jest.mock("next/navigation");
jest.mock("@/lib/client/search");
jest.mock("@/lib/client/api");
jest.mock("@/lib/client/explain-storage");

const mockedUseAppState = useAppState as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;
const mockedSearch = searchCultureReference as jest.Mock;

describe("AppDashboardPage", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({ push: mockPush, replace: mockReplace });
    
    // FIXED: Updated mock to include onboardingComplete and completeOnboarding
    mockedUseAppState.mockReturnValue({
      user: { name: "Test User", country: "India", preferredLanguage: "en" },
      isHydrated: true,
      onboardingComplete: true,
      setUserProfile: jest.fn(),
      updateUser: jest.fn(),
      clearUserProfile: jest.fn(),
      completeOnboarding: jest.fn(),
    });
  });

  it("redirects to onboarding if onboarding is not complete", () => {
    // FIXED: Test the new guard logic
    mockedUseAppState.mockReturnValue({
      user: null,
      isHydrated: true,
      onboardingComplete: false,
      completeOnboarding: jest.fn(),
    });

    render(<AppDashboardPage />);
    expect(mockReplace).toHaveBeenCalledWith("/onboarding");
  });

  it("renders dashboard content when authenticated", () => {
    render(<AppDashboardPage />);
    expect(screen.getByText(/Welcome, Test User/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Type a reference/i)).toBeInTheDocument();
  });

  it("handles search submission successfully", async () => {
    const mockResult = { reference: "Test Ref", originCulture: "Test Culture" };
    mockedSearch.mockResolvedValue(mockResult);

    render(<AppDashboardPage />);
    
    const input = screen.getByPlaceholderText(/Type a reference/i);
    fireEvent.change(input, { target: { value: "What is cricket?" } });
    
    const form = input.closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(mockedSearch).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/app/result");
    });
  });
});
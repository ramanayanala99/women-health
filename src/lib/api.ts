const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type LifeStage = "reproductive" | "perimenopause" | "menopause" | "postmenopause" | "unsure";

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  life_stage: LifeStage;
  is_active: boolean;
  created_at: string;
};

export type ForecastOut = {
  has_data: boolean;
  last_period_start: string | null;
  current_cycle_day: number | null;
  current_phase: string | null;
  avg_cycle_length_days: number;
  avg_period_length_days: number;
  predicted_next_period: string | null;
  predicted_ovulation_date: string | null;
  fertile_window_start: string | null;
  fertile_window_end: string | null;
  days_until_next_period: number | null;
  is_irregular: boolean;
  confidence: number;
  sample_size: number;
  note: string;
};

export type RecommendationOut = {
  icon: string;
  title: string;
  description: string;
};

export type SymptomLikelihoodOut = {
  symptom: string;
  likelihood: number;
  occurrences: number;
};

export type DashboardOut = {
  greeting: string;
  forecast: ForecastOut;
  recent_energy: number | null;
  recent_mood: number | null;
  recent_sleep_hours: number | null;
  recent_stress: number | null;
  recommendations: RecommendationOut[];
  likely_upcoming_symptoms: SymptomLikelihoodOut[];
  disclaimer: string;
};

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, "Can't reach the CycleAI server. It may not be deployed yet — please try again shortly.");
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function register(email: string, password: string, fullName?: string) {
  return request<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name: fullName || undefined }),
  });
}

export function login(email: string, password: string) {
  return request<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getProfile(token: string) {
  return request<UserProfile>("/profile", { method: "GET" }, token);
}

export function getDashboard(token: string) {
  return request<DashboardOut>("/dashboard", { method: "GET" }, token);
}

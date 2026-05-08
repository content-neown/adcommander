export type UserRole = "admin" | "marketer" | "viewer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  team_id: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  created_at: string;
}

export type AdObjective =
  | "Sales / ROAS"
  | "Lead Generation"
  | "Traffic"
  | "App Installs"
  | "Brand Awareness"
  | "Video Views";

export type BudgetRange =
  | "Under $500/mo"
  | "$500–2K/mo"
  | "$2K–10K/mo"
  | "$10K–50K/mo"
  | "$50K+/mo";

export type AdFormat =
  | "Single Image"
  | "Video"
  | "Carousel"
  | "Collection"
  | "Advantage+ Creative"
  | "Stories"
  | "Reels";

export type CampaignStage =
  | "ideation"
  | "scripts"
  | "structure"
  | "creative"
  | "launch";

export interface CampaignBrief {
  product: string;
  url: string;
  audience: string;
  usp: string;
  objective: AdObjective;
  budget: BudgetRange;
  target_metric: string;
  formats: AdFormat[];
  competitors?: string;
  tone?: string;
  extra_context?: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  team_id: string | null;
  title: string;
  brief: CampaignBrief;
  status: "draft" | "active" | "paused" | "archived";
  created_at: string;
  updated_at: string;
}

export interface StageOutput {
  id: string;
  campaign_id: string;
  stage: CampaignStage;
  content: string;
  sources?: SearchSource[];
  created_at: string;
  updated_at: string;
}

export interface SearchSource {
  title: string;
  url: string;
  snippet: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface GenerateRequest {
  campaign_id: string;
  stage: CampaignStage;
  brief: CampaignBrief;
  followUp?: string;
  useSearch?: boolean;
  history?: ChatMessage[];
}

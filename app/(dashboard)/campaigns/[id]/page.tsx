import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CampaignWorkspace } from "./workspace";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("campaigns").select("title").eq("id", id).single();
  return { title: data?.title ?? "Campaign" };
}

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: campaign }, { data: outputs }] = await Promise.all([
    supabase.from("campaigns").select("*").eq("id", id).eq("user_id", user.id).single(),
    supabase.from("stage_outputs").select("*").eq("campaign_id", id),
  ]);

  if (!campaign) notFound();

  const outputMap = Object.fromEntries(
    (outputs ?? []).map((o: { stage: string; content: string }) => [o.stage, o.content])
  );

  return <CampaignWorkspace campaign={campaign} outputMap={outputMap} />;
}

import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BriefForm } from "@/components/campaign/brief-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Edit Brief" };

export default async function EditBriefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: campaign } = await supabase
    .from("campaigns").select("*").eq("id", id).eq("user_id", user.id).single();

  if (!campaign) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/campaigns/${id}`} className="text-slate-500 hover:text-slate-300 transition-colors">
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Edit Brief</h1>
          <p className="text-slate-400 text-sm">{campaign.title}</p>
        </div>
      </div>
      <div className="card-dark p-8">
        <BriefForm
          initialTitle={campaign.title}
          initialBrief={campaign.brief}
          onSave={(newId) => { /* handled in component */ }}
        />
      </div>
    </div>
  );
}

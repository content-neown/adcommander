import { BriefForm } from "@/components/campaign/brief-form";

export const metadata = { title: "New Campaign" };

export default function NewCampaignPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">New Campaign</h1>
        <p className="text-slate-400 text-sm">
          Fill in your campaign brief. The more detail you give, the better Claude's output will be.
        </p>
      </div>
      <div className="card-dark p-8">
        <BriefForm />
      </div>
    </div>
  );
}

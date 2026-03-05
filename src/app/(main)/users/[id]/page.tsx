import { UserProfileContainer } from "@/features/modules/crm/users";

// Next.js 15 kuralı: params artık bir Promise'dir.
export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Promise'i çözüp id'yi alıyoruz
  const cozulenParams = await params;

  return (
    <div className="p-6">
      <UserProfileContainer userId={cozulenParams.id} />
    </div>
  );
}

import { redirect } from "next/navigation";

export default function RootPage() {
  // Kullanıcı localhost:3000'e girdiğinde direkt olarak CRM'in ana modülüne (dashboard) yönlendiriyoruz
  redirect("/dashboard");
}

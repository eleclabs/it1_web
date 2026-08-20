import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AdminUser() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div >
      <h2> Admin </h2>
      <p> แสดงเฉพาะหน้า admin เท่านั้น  </p>

    </div>
  );
}
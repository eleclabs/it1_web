import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function Dashboard() {
  const user = await getSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <div >
        {user?.role === "admin" && (
          <ul>
            <li>
              <Link href="/admin/users">Admin Page</Link>
            </li>
            <li>
              <Link href="/admin/users">Hi</Link>
            </li>
          </ul>
        )}
     
      <h2> Dashbosrd </h2>
      <p>Welcome: {user.name as string}</p>
      <p>Role: {user.role as string}</p>
      <p>{user.school as string}</p>

    </div>
  );
}
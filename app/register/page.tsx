"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();


    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Register successful");
      router.push("/login");
    } else {
      alert("Register failed");
    }
  }


  return (

    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2> สมัครสมาชิก </h2>
        <input
          placeholder="Name"
          type="text"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          placeholder="เบอร์โทร"
          type="text"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <button>Register</button>
      </form>
    </div>
  );
}
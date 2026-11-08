"use client";

import { LockKeyhole, LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter(); const params = useSearchParams(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); const form = new FormData(event.currentTarget); const response = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) }); const data = await response.json(); if (!response.ok) { setError(data.error); setLoading(false); return; } router.push(params.get("next") ?? "/admin"); router.refresh(); }
  return <main className="admin-login"><form className="surface" onSubmit={submit}><LockKeyhole /><p className="eyebrow">Strefa chroniona</p><h1>Panel administratora</h1><p className="muted">Dostęp wymaga konta skonfigurowanego w zmiennych środowiskowych.</p><label className="field"><span>E-mail</span><input name="email" type="email" autoComplete="username" required /></label><label className="field"><span>Hasło</span><input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={loading}>{loading ? <><LoaderCircle className="animate-spin" /> Sprawdzam…</> : "Zaloguj bezpiecznie"}</button></form></main>;
}


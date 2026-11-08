"use client";
import { useEffect } from "react";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error.message); }, [error]); return <main className="confirmation-page"><div className="surface"><p className="eyebrow">Przerwane okrążenie</p><h1>Nie udało się załadować tej części serwisu.</h1><p className="muted">Spróbuj ponownie. Jeśli problem wraca, skontaktuj się ze studiem.</p><button className="button" onClick={reset}>Spróbuj ponownie</button></div></main>; }


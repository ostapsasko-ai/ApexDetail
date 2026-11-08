import { PageShell } from "@/components/page-shell";
import { BookingForm } from "@/components/booking/booking-form";
export default function BookingPage() { return <PageShell eyebrow="Kalendarz studia" title="Umów oględziny lub usługę." description="Wskaż termin i samochód. Potwierdzimy dostępność po sprawdzeniu kalendarza."><div className="shell pb-24"><BookingForm /></div></PageShell>; }

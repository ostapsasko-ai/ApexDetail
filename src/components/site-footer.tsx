import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <p className="brand brand--footer"><span className="brand__mark">A</span> APEX<span>DETAIL</span></p>
          <p className="muted">Precyzyjny detailing, ochrona lakieru i pielęgnacja wnętrza.</p>
        </div>
        <div>
          <p className="footer-heading">Studio</p>
          <p>ul. Torowa 24, 00-950 Warszawa</p>
          <p>Pon.–Pt. 8:00–18:00 · Sob. 9:00–14:00</p>
        </div>
        <div>
          <p className="footer-heading">Kontakt</p>
          <a href="tel:+48225550124">+48 22 555 01 24</a>
          <a href="mailto:studio@apexdetail.pl">studio@apexdetail.pl</a>
        </div>
        <div>
          <p className="footer-heading">Informacje</p>
          <Link href="/o-nas">O nas i standard pracy</Link>
          <Link href="/kontakt">Kontakt i RODO</Link>
          <Link href="/admin">Panel administratora</Link>
        </div>
      </div>
      <div className="shell site-footer__bottom">
        <span>© {new Date().getFullYear()} ApexDetail</span>
        <span>Projekt demonstracyjny · ceny w PLN</span>
      </div>
    </footer>
  );
}


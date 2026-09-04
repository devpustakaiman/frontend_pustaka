import { getArticles } from "@/lib/api";
import KontakClient from "./KontakClient";

export const metadata = {
  title: "Kontak Kami - Pustaka IIMaN",
  description:
    "Hubungi tim Pustaka IIMaN untuk layanan pelanggan, informasi pemesanan buku, pengiriman naskah, dan kerjasama penerbitan.",
};

export default async function KontakPage() {
  const articles = await getArticles();

  return <KontakClient articles={articles} />;
}

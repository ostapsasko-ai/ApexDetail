import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../src/lib/catalog";
import { SERVICES } from "../src/lib/pricing";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await Promise.all(SERVICES.map((service) => prisma.service.upsert({ where: { id: service.id }, update: { name: service.name, price: service.price, description: service.description }, create: { id: service.id, name: service.name, price: service.price, description: service.description } })));
  await Promise.all(PRODUCTS.map((product) => prisma.product.upsert({ where: { id: product.id }, update: { name: product.name, price: product.price, stock: product.stock, description: product.description, category: product.category }, create: { id: product.id, name: product.name, price: product.price, stock: product.stock, description: product.description, category: product.category, imageUrl: "/generated/apexdetail-products.png" } })));
  await Promise.all([
    ["inpost-courier", "InPost Kurier", 17], ["inpost-locker", "InPost Paczkomat", 15], ["dhl", "DHL", 19], ["dpd", "DPD", 18], ["poczta", "Poczta Polska", 16]
  ].map(([id, name, price]) => prisma.shippingRate.upsert({ where: { id: String(id) }, update: { name: String(name), price: Number(price) }, create: { id: String(id), name: String(name), price: Number(price) } })));

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await prisma.user.upsert({ where: { email: process.env.ADMIN_EMAIL }, update: { passwordHash, role: "ADMIN" }, create: { email: process.env.ADMIN_EMAIL, passwordHash, role: "ADMIN", name: "Administrator ApexDetail" } });
    console.log("Utworzono/zaktualizowano konto administratora z danych środowiskowych.");
  }
  console.log(`Seed: ${SERVICES.length} usług, ${PRODUCTS.length} produktów i 5 metod dostawy.`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());


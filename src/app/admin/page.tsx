import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";
import { getPrisma, isDatabaseConfigured } from "@/lib/db";
import { AdminDashboard, type AdminData } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!await verifyAdminToken(token, process.env.AUTH_SECRET)) redirect("/admin/login");
  let data: AdminData = { configured: false, bookings: [], orders: [], services: [], products: [], shippingRates: [], galleryCount: 0, availabilityCount: 0 };
  if (isDatabaseConfigured()) {
    const prisma = getPrisma(); const [bookings, orders, services, products, shippingRates, galleryCount, availabilityCount] = await Promise.all([prisma.booking.findMany({ take: 12, orderBy: { createdAt: "desc" } }), prisma.order.findMany({ take: 12, orderBy: { createdAt: "desc" } }), prisma.service.findMany({ orderBy: { name: "asc" } }), prisma.product.findMany({ orderBy: { name: "asc" } }), prisma.shippingRate.findMany(), prisma.galleryImage.count(), prisma.availability.count()]);
    data = { configured: true, bookings: bookings.map((item) => ({ id: item.id, reference: item.reference, scheduledAt: item.scheduledAt.toISOString(), customerName: item.customerName, status: item.status })), orders: orders.map((item) => ({ id: item.id, reference: item.reference, total: item.total, status: item.status, paymentStatus: item.paymentStatus })), services: services.map(({ id, name, price }) => ({ id, name, price })), products: products.map(({ id, name, stock, price }) => ({ id, name, stock, price })), shippingRates, galleryCount, availabilityCount };
  }
  return <main className="content-section shell"><AdminDashboard initial={data} /></main>;
}

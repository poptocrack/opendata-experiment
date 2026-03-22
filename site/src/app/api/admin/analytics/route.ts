import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const secret = process.env.ADMIN_SECRET;
  const isDev = process.env.NODE_ENV === "development";
  return isDev || (secret && token === secret);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);

  const notCta = { path: { not: { startsWith: "/cta/" } } };
  const isCta = { path: { startsWith: "/cta/" } };

  const [totalViews, todayViews, weekViews, monthViews, topPages, topReferrers, deviceBreakdown, dailyViews, ctaClicks] =
    await Promise.all([
      prisma.pageView.count({ where: notCta }),
      prisma.pageView.count({ where: { ...notCta, createdAt: { gte: today } } }),
      prisma.pageView.count({ where: { ...notCta, createdAt: { gte: sevenDaysAgo } } }),
      prisma.pageView.count({ where: { ...notCta, createdAt: { gte: thirtyDaysAgo } } }),
      prisma.pageView.groupBy({
        by: ["path"],
        where: notCta,
        _count: true,
        orderBy: { _count: { path: "desc" } },
        take: 20,
      }),
      prisma.pageView.groupBy({
        by: ["referrer"],
        where: { referrer: { not: null }, ...notCta },
        _count: true,
        orderBy: { _count: { referrer: "desc" } },
        take: 10,
      }),
      prisma.pageView.groupBy({
        by: ["device"],
        where: notCta,
        _count: true,
        orderBy: { _count: { device: "desc" } },
      }),
      prisma.$queryRawUnsafe<{ day: string; count: bigint }[]>(
        `SELECT date(createdAt) as day, COUNT(*) as count FROM PageView WHERE createdAt >= ? AND path NOT LIKE '/cta/%' GROUP BY date(createdAt) ORDER BY day DESC LIMIT 30`,
        thirtyDaysAgo.toISOString()
      ),
      // CTA clicks grouped by path + referrer (source page)
      prisma.pageView.groupBy({
        by: ["path", "referrer"],
        where: isCta,
        _count: true,
        orderBy: { _count: { path: "desc" } },
      }),
    ]);

  // Aggregate CTA data
  const ctaSummary = ctaClicks.reduce(
    (acc, c) => {
      const key = c.path;
      if (!acc[key]) acc[key] = { total: 0, sources: [] as { page: string; clicks: number }[] };
      acc[key].total += c._count;
      if (c.referrer) acc[key].sources.push({ page: c.referrer, clicks: c._count });
      return acc;
    },
    {} as Record<string, { total: number; sources: { page: string; clicks: number }[] }>
  );

  return NextResponse.json({
    totalViews,
    todayViews,
    weekViews,
    monthViews,
    topPages: topPages.map((p) => ({ path: p.path, views: p._count })),
    topReferrers: topReferrers.map((r) => ({
      referrer: r.referrer,
      views: r._count,
    })),
    deviceBreakdown: deviceBreakdown.map((d) => ({
      device: d.device,
      views: d._count,
    })),
    dailyViews: dailyViews.map((d) => ({
      day: d.day,
      views: Number(d.count),
    })),
    ctaClicks: ctaSummary,
  });
}

import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { headers } from "next/headers"


export const listingRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(8, '15 m'),
    analytics: true,
    prefix: "@ratelimit/listing",
});

export const messageRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '10 s'),
    analytics: true,
    prefix: "@ratelimit/message"
});

export const reviewRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '10 m'),
    analytics: true,
    prefix: "@ratelimit/review"
});

export async function getClientIp(): Promise<string> {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }
    return headerList.get("x-real-ip") || "127.0.0.1";
}
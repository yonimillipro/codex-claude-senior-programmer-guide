import { createHmac } from 'node:crypto';

// Both counters are checked and reserved in one atomic Redis operation. No
// process-local Map: it would reset on cold starts and split across instances.
export const RESERVE_QUOTA = `
local ip = tonumber(redis.call('GET', KEYS[1]) or '0')
local day = tonumber(redis.call('GET', KEYS[2]) or '0')
if ip >= tonumber(ARGV[1]) then return 1 end
if day >= tonumber(ARGV[2]) then return 2 end
redis.call('INCR', KEYS[1])
redis.call('EXPIRE', KEYS[1], 7200)
redis.call('INCR', KEYS[2])
redis.call('EXPIRE', KEYS[2], 172800)
return 0
`;
export function quotaConfig(env) {
  const daily = Number(env.CHAT_DAILY_REQUEST_LIMIT);
  const hourly = Number(env.CHAT_IP_HOURLY_LIMIT || 20);
  let url;
  try { url = new URL(env.UPSTASH_REDIS_REST_URL); } catch { return null; }
  if (url.protocol !== 'https:' || !env.UPSTASH_REDIS_REST_TOKEN || !Number.isInteger(daily) || daily < 1 || daily > 10000 || !Number.isInteger(hourly) || hourly < 1 || hourly > 100) return null;
  return { url: url.href, token: env.UPSTASH_REDIS_REST_TOKEN, daily, hourly };
}
export async function reserveQuota(request, env, fetcher = fetch, now = Date.now()) {
  const config = quotaConfig(env);
  if (!config) throw new Error('quota_not_configured');
  // Vercel's own forwarded address is preferred; unknown clients share a bucket.
  const address = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const id = createHmac('sha256', config.token).update(address).digest('hex').slice(0, 32);
  const hour = Math.floor(now / 3600000);
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Nairobi', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now));
  const response = await fetcher(config.url, {
    method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', RESERVE_QUOTA, '2', `{guide-chat}:hour:${hour}:${id}`, `{guide-chat}:day:${day}`, String(config.hourly), String(config.daily)]),
    signal: AbortSignal.any([request.signal, AbortSignal.timeout(4000)])
  });
  if (!response.ok) throw new Error('quota_unavailable');
  const data = await response.json();
  if (![0, 1, 2].includes(data.result) || data.error) throw new Error('quota_unavailable');
  const reset = data.result === 2 ? (Math.floor((now + 10800000) / 86400000) + 1) * 86400000 - 10800000 : (hour + 1) * 3600000;
  return { allowed: data.result === 0, retryAfter: Math.max(1, Math.ceil((reset - now) / 1000)) };
}

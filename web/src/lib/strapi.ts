import qs from 'qs';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchAPI<T = any>(path: string, params: Record<string, any> = {}): Promise<T | null> {
  const query = qs.stringify(params, { encodeValuesOnly: true });
  const url = `${STRAPI_URL}/api${path}${query ? `?${query}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Strapi request failed (${res.status}): ${url}`);
  }
  const json = await res.json();
  return json.data as T;
}

export async function postAPI(path: string, data: Record<string, any>) {
  const url = `${STRAPI_URL}/api${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error?.message || `Strapi request failed (${res.status})`);
  }
  return res.json();
}

export function mediaUrl(media: { url?: string } | null | undefined): string {
  if (!media?.url) return '';
  return media.url.startsWith('http') ? media.url : `${STRAPI_URL}${media.url}`;
}

export { STRAPI_URL };

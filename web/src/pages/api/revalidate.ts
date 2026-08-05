import type { APIRoute } from 'astro';
import { clearCache } from '../../lib/strapi';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const secret = import.meta.env.REVALIDATE_SECRET;
  const provided = request.headers.get('x-revalidate-secret') || new URL(request.url).searchParams.get('secret');

  if (!secret || provided !== secret) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  clearCache();
  return new Response(JSON.stringify({ revalidated: true }), { status: 200 });
};

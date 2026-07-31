export default ({ env }: { env: (key: string, defaultValue?: string) => string | undefined }) => {
  const corsOrigins = env('CORS_ORIGINS', 'http://localhost:4321')!
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return [
    'strapi::logger',
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        origin: corsOrigins,
      },
    },
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

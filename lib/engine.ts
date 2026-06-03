const ENGINE = process.env.NEXT_PUBLIC_ENGINE_URL ?? 'http://localhost:8080';

export interface CampaignPage {
  id: string;
  slug: string;
  headline: string;
  subheadline: string;
  cta_text: string;
  brand_color: string;       // hex, e.g. "#6366f1"
  form_fields: string[];     // e.g. ["name","email","phone"]
  logo_url?: string;
  company_name?: string;
  tenant_id: string;
}

export async function getPage(slug: string): Promise<CampaignPage | null> {
  try {
    const res = await fetch(`${ENGINE}/p/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.page ?? null;
  } catch {
    return null;
  }
}

export async function submitLead(
  tenantId: string,
  fields: Record<string, string>,
  source: string,
) {
  const res = await fetch(`${ENGINE}/leads/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenantId },
    body: JSON.stringify({
      first_name: fields.name?.split(' ')[0] ?? '',
      last_name:  fields.name?.split(' ').slice(1).join(' ') ?? '',
      email:      fields.email ?? '',
      phone:      fields.phone ?? '',
      source,
    }),
  });
  return res.ok;
}

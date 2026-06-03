import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPage } from '@/lib/engine';
import { LeadForm } from '@/components/LeadForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return {
    title: page?.headline ?? 'Campaign',
    description: page?.subheadline ?? '',
  };
}

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) notFound();

  const brand = page.brand_color || '#6366f1';
  const fields = page.form_fields?.length ? page.form_fields : ['name', 'email', 'phone'];

  return (
    <main className="min-h-screen flex flex-col">

      {/* Hero */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ background: `linear-gradient(135deg, ${brand}22 0%, ${brand}08 100%)` }}
      >
        {page.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={page.logo_url} alt={page.company_name ?? ''} className="h-10 mb-8 object-contain" />
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 max-w-2xl leading-tight">
          {page.headline}
        </h1>

        {page.subheadline && (
          <p className="mt-4 text-lg text-gray-600 max-w-xl">{page.subheadline}</p>
        )}

        {/* Form card */}
        <div className="mt-10 w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <LeadForm
            fields={fields}
            ctaText={page.cta_text || 'Get Started'}
            brandColor={brand}
            tenantId={page.tenant_id}
            slug={slug}
          />
        </div>

        {page.company_name && (
          <p className="mt-8 text-xs text-gray-400">{page.company_name}</p>
        )}
      </div>

    </main>
  );
}

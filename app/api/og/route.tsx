import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const company = searchParams.get('company') || 'Company Name';
  const logo = searchParams.get('logo') || '';
  const batch = searchParams.get('batch') || 'Winter 2030';
  const jobs = searchParams.get('jobs') || '69';
  const url = searchParams.get('url') || 'https://yourcompany.com';
  const tags = searchParams.get('tags')?.split(',') || ['SOFTWARE', 'DATA', 'STARTUP'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#faf9f6',
          fontFamily: 'Inter, sans-serif',
          padding: 48,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <div style={{ width: 160, height: 160, background: '#fff', borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #eee' }}>
            {logo ? (
              <img src={logo} alt="logo" style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 24 }} />
            ) : (
              <span style={{ fontSize: 48, color: '#bbb' }}>Logo</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 56, fontWeight: 700, marginBottom: 16 }}>{company}</div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <span style={{ background: '#ffe6cc', color: '#d97706', borderRadius: 8, fontWeight: 600, fontSize: 28, padding: '4px 16px' }}>Y</span>
              <span style={{ background: '#f3f4f6', color: '#222', borderRadius: 8, fontWeight: 600, fontSize: 28, padding: '4px 16px' }}>{batch}</span>
              <span style={{ background: '#d1fae5', color: '#047857', borderRadius: 9999, fontWeight: 600, fontSize: 28, padding: '4px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 16, background: '#22c55e', borderRadius: 9999, display: 'inline-block', marginRight: 8 }}></span>
                ACTIVE
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              {tags.map((tag) => (
                <span key={tag} style={{ background: '#e5e7eb', color: '#222', borderRadius: 8, fontWeight: 600, fontSize: 24, padding: '2px 12px' }}>{tag}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <span style={{ background: '#f3f4f6', color: '#222', borderRadius: 8, fontWeight: 600, fontSize: 24, padding: '2px 12px' }}>STARTUP</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 80, marginTop: 48, borderTop: '2px solid #eee', paddingTop: 32, fontSize: 28, fontWeight: 600 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: 20, fontWeight: 400 }}>Jobs</span>
            <span>{jobs}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: 20, fontWeight: 400 }}>URL</span>
            <span style={{ color: '#2563eb', textDecoration: 'underline', fontSize: 24 }}>{url}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Content-Type': 'image/png',
      },
    }
  );
} 
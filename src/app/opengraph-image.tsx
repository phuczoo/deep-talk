import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Chuyện Trò — Deep Talk Card Game';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Glow circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.25)',
            filter: 'blur(100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.25)',
            filter: 'blur(100px)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 24px',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            fontSize: '20px',
            fontWeight: 600,
            color: '#fda4af',
            marginBottom: '28px',
          }}
        >
          ✨ Deep Talk & Icebreaker Card Game
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            textAlign: 'center',
            marginBottom: '16px',
            background: 'linear-gradient(to right, #ffffff, #f43f5e, #f59e0b)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Chuyện Trò
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 400,
            textAlign: 'center',
            color: '#a1a1aa',
            maxWidth: '850px',
            lineHeight: 1.4,
          }}
        >
          Bộ câu hỏi trò chuyện chuyền tay — Người Yêu, Bạn Bè, Gia Đình, Đồng Nghiệp
        </div>

        {/* 4 Badges */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '40px',
          }}
        >
          <div style={{ padding: '8px 20px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', fontSize: '18px', fontWeight: 600 }}>❤️ Người Yêu</div>
          <div style={{ padding: '8px 20px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fcd34d', fontSize: '18px', fontWeight: 600 }}>🍻 Bạn Bè</div>
          <div style={{ padding: '8px 20px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontSize: '18px', fontWeight: 600 }}>🏡 Gia Đình</div>
          <div style={{ padding: '8px 20px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#a5b4fc', fontSize: '18px', fontWeight: 600 }}>💼 Đồng Nghiệp</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

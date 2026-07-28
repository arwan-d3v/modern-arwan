import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'CV and portfolio showcase management';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            backgroundImage: 'radial-gradient(circle at 50% 50%, #111111 0%, #000000 100%)',
            border: '2px solid rgba(0, 242, 255, 0.3)',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '400px',
              height: '400px',
              background: 'rgba(0, 242, 255, 0.2)',
              filter: 'blur(100px)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: '400px',
              height: '400px',
              background: 'rgba(157, 0, 255, 0.2)',
              filter: 'blur(100px)',
              borderRadius: '50%',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              zIndex: 10,
              padding: '0 60px',
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#00f2ff',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginBottom: 20,
                borderBottom: '2px solid rgba(0, 242, 255, 0.5)',
                paddingBottom: 10,
              }}
            >
              System_Operative
            </div>
            
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.2,
                marginTop: 20,
                textTransform: 'uppercase',
                letterSpacing: '-0.05em',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: 40,
                fontSize: 24,
                color: '#888888',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Is Arwan DEV &bull; Full-Stack Engineer
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response('Failed to generate image', { status: 500 });
  }
}

import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://chuyen-tro.vercel.app'),
  title: 'Chuyện Trò — Deep Talk Card Game | Bộ Câu Hỏi Kết Nối',
  description:
    'Bộ thẻ câu hỏi trò chuyện chuyền tay dành cho các cặp đôi, bạn bè, gia đình và đồng nghiệp. Khởi động nhẹ nhàng, kết nối sâu sắc.',
  applicationName: 'Chuyện Trò',
  authors: [{ name: 'Chuyện Trò Team' }],
  keywords: [
    'deep talk',
    'chuyện trò',
    'câu hỏi kết nối',
    'trò chơi chuyền tay',
    'câu hỏi người yêu',
    'câu hỏi bạn bè',
    'icebreaker vietnam',
  ],
  openGraph: {
    title: 'Chuyện Trò — Deep Talk Card Game | Bộ Câu Hỏi Kết Nối',
    description:
      'Bộ thẻ câu hỏi trò chuyện chuyền tay dành cho các cặp đôi, hội bạn thân, gia đình và đồng nghiệp. Chơi trực tiếp trên điện thoại không cần tải app.',
    url: 'https://chuyen-tro.vercel.app',
    siteName: 'Chuyện Trò',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Chuyện Trò - Deep Talk Card Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chuyện Trò — Deep Talk Card Game',
    description:
      'Bộ thẻ câu hỏi trò chuyện chuyền tay dành cho cặp đôi, bạn bè, gia đình. Khởi động nhẹ nhàng, kết nối sâu sắc.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <body className="h-full flex flex-col antialiased selection:bg-rose-500/20 selection:text-rose-600">
        <div className="flex-1 w-full max-w-md mx-auto flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

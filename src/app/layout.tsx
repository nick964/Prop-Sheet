import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Container, SSRProvider} from './components/bootstrap';
import NavBar from './NavBar';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prop Sheet Generator',
  description: 'Manage Superbowl Prop Sheets for your friends and family',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SSRProvider>
          <NavBar />
          <main>
          <Container>
            {children}
          </Container>
          </main>
        </SSRProvider>
      </body>
    </html>
  )
}

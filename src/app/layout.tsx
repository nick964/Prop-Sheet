import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Container, SSRProvider} from './components/bootstrap';
import Provider from './context/client-provider';
import { getServerSession } from "next-auth/next";
import { options } from './api/auth/[...nextauth]/options'; // ⚠️ Make sure this is the correct path
import NavBar from './NavBar';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prop Sheet Generator',
  description: 'Manage Superbowl Prop Sheets for your friends and family',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(options);
  return (
    <html lang="en">
      <body className={inter.className}>
        <SSRProvider>
          <Provider session={session}>
            <NavBar />
            <main>
            <Container fluid>
              {children}
            </Container>
            </main>
            <Footer />
          </Provider>
        </SSRProvider>
      </body>
    </html>
  )
}

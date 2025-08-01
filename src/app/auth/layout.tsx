
import LogGuard from '../LogGuard';


export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return <LogGuard>{children}</LogGuard>
}

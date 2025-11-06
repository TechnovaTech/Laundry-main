export function generateStaticParams() {
  return [{ id: 'temp' }];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

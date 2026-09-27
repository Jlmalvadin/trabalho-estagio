// Página inicial do painel admin: redireciona para login ou dashboard
import { redirect } from 'next/navigation';

export default function AdminPage() {
  redirect('/admin/login');
  return null;
}
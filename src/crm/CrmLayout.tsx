import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  TruckIcon,
  UsersIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { apiFetch, clearToken } from './api';
import type { MeUser, Role } from './types';

type MeResponse = { user: MeUser };

type NavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles?: Role[];
};

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
    isActive ? 'bg-white/10 text-white' : 'text-white/75 hover:text-white hover:bg-white/5',
  ].join(' ');
}

export default function CrmLayout() {
  const navigate = useNavigate();
  const [me, setMe] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const items: NavItem[] = useMemo(
    () => [
      { to: '/crm/dashboard', label: 'Dashboard', icon: <ChartBarIcon className="w-5 h-5" /> },
      { to: '/crm/leads', label: 'Leads', icon: <UserGroupIcon className="w-5 h-5" />, roles: ['admin', 'sales'] },
      { to: '/crm/customers', label: 'Customers', icon: <UsersIcon className="w-5 h-5" />, roles: ['admin', 'sales'] },
      { to: '/crm/quotes', label: 'Quotes', icon: <DocumentTextIcon className="w-5 h-5" />, roles: ['admin', 'sales'] },
      { to: '/crm/shipments', label: 'Shipments', icon: <TruckIcon className="w-5 h-5" />, roles: ['admin', 'operations', 'sales', 'accountant'] },
      { to: '/crm/documents', label: 'Documents', icon: <ClipboardDocumentListIcon className="w-5 h-5" />, roles: ['admin', 'operations', 'sales'] },
      { to: '/crm/vendors', label: 'Vendors', icon: <BuildingOffice2Icon className="w-5 h-5" />, roles: ['admin', 'operations', 'accountant'] },
      { to: '/crm/admin/users', label: 'User Management', icon: <RectangleStackIcon className="w-5 h-5" />, roles: ['admin'] },
    ],
    [],
  );

  const visibleItems = useMemo(() => {
    if (!me) return items.filter((i) => !i.roles);
    return items.filter((i) => !i.roles || i.roles.includes(me.role));
  }, [items, me]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiFetch('/auth/me');
        if (!res.ok) {
          clearToken();
          navigate('/login?from=/crm', { replace: true });
          return;
        }
        const data = (await res.json()) as MeResponse;
        if (!alive) return;
        setMe(data.user);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);

  function logout() {
    clearToken();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-secondary-900 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-secondary-900/80 backdrop-blur-sm">
          <div className="px-5 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                <span className="font-bold">AG</span>
              </div>
              <div className="leading-tight">
                <div className="font-semibold">Ajiva Global CRM</div>
                <div className="text-xs text-white/60">Deal-to-Shipment Workflow</div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 space-y-1">
            {visibleItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-auto px-4 py-4 border-t border-white/10">
            {me && (
              <div className="mb-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="text-sm font-semibold">{me.full_name}</div>
                <div className="text-xs text-white/60">{me.role}</div>
              </div>
            )}
            <button
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="md:hidden border-b border-white/10 bg-secondary-900/80 backdrop-blur-sm">
            <div className="container-custom py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                  <span className="font-bold">AG</span>
                </div>
                <div className="leading-tight">
                  <div className="font-semibold">Ajiva Global CRM</div>
                  <div className="text-xs text-white/60">{me ? me.role : 'Loading…'}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <main className="container-custom py-8">
            {loading ? <div className="text-white/70">Loading CRM…</div> : <Outlet context={{ me }} />}
          </main>
        </div>
      </div>
    </div>
  );
}

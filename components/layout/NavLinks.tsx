'use client';

import { usePathname } from '@/navigation';
import { Link } from '@/navigation';

type NavLink = { href: string; label: string; route?: boolean };

const linkCls = `
  px-3 lg:px-4 py-2 rounded-lg
  text-sm font-medium
  transition-colors duration-150
  min-h-[44px] inline-flex items-center relative
`;

function isActive(pathname: string, href: string): boolean {
  if (href.startsWith('#')) return false;
  return pathname === href || pathname.startsWith(href + '/');
}

export default function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <ul className="hidden md:flex items-center gap-0.5 lg:gap-1">
      {links.map(({ href, label, route }) => {
        const active = isActive(pathname, href);
        const colorCls = active
          ? 'text-white bg-brand-blue/[0.08]'
          : 'text-slate-400 hover:text-white hover:bg-brand-blue/[0.08]';

        return (
          <li key={href}>
            {route ? (
              <Link href={href} className={`${linkCls} ${colorCls}`}>
                {label}
                {active && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-blue"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ) : (
              <a href={href} className={`${linkCls} ${colorCls}`}>
                {label}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

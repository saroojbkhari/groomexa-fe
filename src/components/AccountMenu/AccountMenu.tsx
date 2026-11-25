"use client";

import useLogout from "@/hooks/auth/useLogout";
import useSession from "@/hooks/auth/useSession";
import Icon from "@/components/Icon";
import type { TRole } from "@/typings/auth";

const ROLE_LABEL: Record<TRole, string> = { superadmin: "Owner", manager: "Manager", groomer: "Groomer" };

const itemClass =
  "flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-3 text-left text-[15px] font-medium text-mint/85 hover:bg-white/6 hover:text-white";

/**
 * The signed-in user, and the two ways to log out. Buttons, not links: logging out changes state,
 * so it must never be a GET a prefetch could trigger. A native <details> keeps it accessible with no extra library.
 */
export default function AccountMenu() {
  const { user } = useSession();
  const { logout, logoutAll } = useLogout();

  return (
    <details className="group relative">
      <summary className={`${itemClass} list-none [&::-webkit-details-marker]:hidden`}>
        <Icon name="user" size={20} className="shrink-0 text-mist" />
        <span className="hidden min-w-0 flex-1 sm:block">
          <span className="block truncate text-white">{user?.name ?? "Account"}</span>
          {user && <span className="block text-xs text-mist">{ROLE_LABEL[user.role] ?? user.role}</span>}
        </span>
        <span className="sr-only sm:hidden">Account</span>
        <Icon name="chevron" size={16} className="hidden text-mist transition-transform group-open:rotate-180 sm:block lg:rotate-180 lg:group-open:rotate-0" />
      </summary>
      <div className="absolute top-full right-0 z-20 mt-2 w-60 rounded-2xl bg-ink p-1.5 shadow-xl ring-1 ring-white/10 lg:top-auto lg:right-auto lg:bottom-full lg:left-0 lg:mt-0 lg:mb-2 lg:w-full">
        <button type="button" onClick={logout} className={itemClass}>
          <Icon name="logout" size={20} className="text-mist" />
          Log out
        </button>
        <button type="button" onClick={logoutAll} className={itemClass}>
          <Icon name="logout" size={20} className="text-coral" />
          Log out of all devices
        </button>
      </div>
    </details>
  );
}

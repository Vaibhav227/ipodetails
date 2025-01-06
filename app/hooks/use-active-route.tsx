import { useLocation } from "react-router";
import { data } from "~/components/app-sidebar";

export function useActiveRoute() {
  const location = useLocation();
  const pathname = location.pathname;

  const getActiveItem = () => {
    // Check all top-level items
    for (const navItem of data.navMain) {
      // Check if it's a direct match (for items without children)
      if (navItem.url === pathname) {
        return { parent: navItem, child: null };
      }

      // Check child items if they exist
      if (navItem.items) {
        const activeChild = navItem.items.find((item) => item.url === pathname);
        if (activeChild) {
          return { parent: navItem, child: activeChild };
        }
      }
    }

    return null;
  };

  return getActiveItem();
}

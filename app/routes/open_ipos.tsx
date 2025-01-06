import { OpenIpoList } from "~/modules/OpenIpoList";
import type { Route } from "./+types/open_ipos";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function List() {
  return <OpenIpoList />;
}

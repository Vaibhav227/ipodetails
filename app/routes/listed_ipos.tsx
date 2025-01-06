import type { Route } from "./+types/listed_ipos";
import { ListedIpoList } from "~/modules/ListedIpoList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function List() {
  return <ListedIpoList />;
}

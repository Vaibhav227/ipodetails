import type { Route } from "./+types/closed_ipos";
import { ClosedIpoList } from "~/modules/ClosedIpoList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function List() {
  return <ClosedIpoList />;
}

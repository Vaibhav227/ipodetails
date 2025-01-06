import type { Route } from "./+types/upcoming_ipos";
import { UpcomingIpoList } from "~/modules/UpcomingIpoList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function List() {
  return <UpcomingIpoList />;
}

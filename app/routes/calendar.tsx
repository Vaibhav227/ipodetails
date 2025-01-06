import type { Route } from "./+types/calendar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Calendar() {
  return <div>Calendar</div>;
}

import { createFileRoute } from "@tanstack/react-router";
import { RiteApp } from "@/components/rite/rite-app";

export const Route = createFileRoute("/")({
  ssr: false,
  component: RiteApp,
});

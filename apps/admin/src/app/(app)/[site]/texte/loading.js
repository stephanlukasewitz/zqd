import { HeadSk, ListSk } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Wird geladen">
      <div className="top-progress" />
      <HeadSk />
      <ListSk rows={8} />
    </div>
  );
}

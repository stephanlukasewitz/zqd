import { HeadSk, CardsSk } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Wird geladen">
      <div className="top-progress" />
      <HeadSk />
      <CardsSk />
    </div>
  );
}

import { HeadSk, FormSk } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Wird geladen">
      <div className="top-progress" />
      <HeadSk actions={1} />
      <FormSk />
    </div>
  );
}

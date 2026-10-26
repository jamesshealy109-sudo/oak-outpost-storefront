import { LoaderCircle } from "lucide-react";
export default function Loading() {
  return (
    <div className="loading-state" role="status">
      <LoaderCircle
        size={24}
        className="spin"
        style={{ margin: "0 auto 20px" }}
      />
      <p>Finding the good things…</p>
    </div>
  );
}

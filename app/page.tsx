import Image from "next/image";
import DynamicTable from "./ui/molecules/mol-dyn-table";

export const experimental_ppr = true;

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <h1>Root Page.tsx</h1>
      <DynamicTable />
    </div>
  );
}

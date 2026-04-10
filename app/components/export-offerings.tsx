"use client";

import { Download } from "lucide-react";
import { Offering } from "@/app/hooks/useOffering";

interface ExportOfferingsProps {
  offerings: Offering[];
}

export default function ExportOfferings({ offerings }: ExportOfferingsProps) {
  const exportToCSV = () => {
    const headers = ["Date", "Amount", "Type", "Member Name", "Note"];
    const csvData = offerings.map(offering => [
      new Date(offering.date).toLocaleString(),
      offering.amount,
      offering.type,
      offering.memberName || "",
      offering.note || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offerings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <button
      onClick={exportToCSV}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      <Download size={18} />
      Export CSV
    </button>
  );
}
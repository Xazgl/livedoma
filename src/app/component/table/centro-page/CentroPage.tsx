"use client";
import { generateSurveyExcel } from "@/lib/centro-tilda";
import { GenericTable } from "@/shared/components";
import { Tilda } from "@prisma/client";
import { createColumns, parseSurveyData } from "../centro-utils";

export default function CentroPage({
  applications,
}: {
  applications: {
    applicationsExcel: Tilda[];
    allFilteredSales: Tilda[];
  };
}) {
  const urlForUpdate = "/api/app-centro";

  return (
    <GenericTable<Tilda>
      fetchUrl={urlForUpdate}
      generateExcel={generateSurveyExcel}
      createColumns={createColumns}
      initialApplications={applications}
      parseData={parseSurveyData}
    />
  );
}

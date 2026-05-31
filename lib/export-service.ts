import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { AthleteRecord, CoachRecord } from "@/types";

export const exportAthletesToExcel = (athletes: AthleteRecord[]) => {
  const flattened = athletes.map(a => ({
    "Athlete ID": a.athleteId,
    "Full Name": a.personalDetails.fullName,
    "Email": a.personalDetails.email,
    "Mobile": a.personalDetails.mobile,
    "Sport": a.sportName,
    "Club": a.clubDetails.clubName,
    "Status": a.status,
    "Applied On": new Date(a.createdAt).toLocaleDateString(),
    "Age Group": a.competitionDetails.ageGroup,
    "Gender": a.personalDetails.gender,
  }));

  const worksheet = XLSX.utils.json_to_sheet(flattened);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Athletes");
  
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
  saveAs(data, `Athletes_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportAthletesToCSV = (athletes: AthleteRecord[]) => {
  const headers = ["ID", "Name", "Email", "Mobile", "Sport", "Club", "Status", "Date"];
  const rows = athletes.map(a => [
    a.athleteId,
    a.personalDetails.fullName,
    a.personalDetails.email,
    a.personalDetails.mobile,
    a.sportName,
    a.clubDetails.clubName,
    a.status,
    new Date(a.createdAt).toLocaleDateString(),
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `Athletes_Export_${new Date().toISOString().split('T')[0]}.csv`);
};

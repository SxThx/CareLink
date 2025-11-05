import * as XLSX from "xlsx";

const DEFAULT_VITALS_FILE_URL = new URL("../assets/data/Vital.xlsx", import.meta.url).href;

const normaliseString = (value) =>
  (value ?? "")
    .toString()
    .trim();

const toNumber = (value, fractionDigits = null) => {
  const raw = normaliseString(value).replace(/,/g, ".");
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    return null;
  }
  if (typeof fractionDigits === "number") {
    return Number(parsed.toFixed(fractionDigits));
  }
  return parsed;
};

const composeDateTime = (dateValue, timeValue) => {
  const dateStr = normaliseString(dateValue);
  const timeStr = normaliseString(timeValue);

  if (!dateStr && !timeStr) {
    return "";
  }

  const parseExcelDate = (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    if (typeof value === "number") {
      const milliseconds = Math.round((value - 25569) * 86400 * 1000);
      return new Date(milliseconds);
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const datePart = parseExcelDate(dateStr);
  const timePart = parseExcelDate(timeStr);

  if (datePart && timePart) {
    const combined = new Date(datePart);
    combined.setHours(timePart.getHours(), timePart.getMinutes(), timePart.getSeconds(), timePart.getMilliseconds());
    return combined.toISOString();
  }

  if (datePart) {
    return datePart.toISOString();
  }

  if (timePart) {
    return timePart.toISOString();
  }

  return `${dateStr} ${timeStr}`.trim();
};

const buildVitalRecord = (row, index) => {
  const nric = normaliseString(row.NRIC || row.nric);
  const patientId = normaliseString(row["Patient ID"] || row.PatientID || row.patientId);

  return {
    id: `${patientId || nric || "unknown"}-${index}`,
    patientId,
    reportDate: normaliseString(row["Report Date"] || row.ReportDate || row.reportDate),
    name: normaliseString(row.Name || row.name),
    nric,
    gender: normaliseString(row.Gender || row.gender),
    dateOfBirth: normaliseString(row.DOB || row.dob || row["Date Of Birth"]),
    age: toNumber(row.Age || row.age),
    vitalDate: normaliseString(row["Vital Date"] || row.vitalDate),
    vitalTime: normaliseString(row.Time || row.time),
    takenOn: composeDateTime(row["Vital Date"] || row.vitalDate, row.Time || row.time),
    temperature: toNumber(row["Temperature (°C)"]),
    heartRate: toNumber(row["Pulse Rate (/min)"]),
    respiratoryRate: toNumber(row["Respiratory Rate (/min)"]),
    oxygenSaturation: toNumber(row["SpO2 (%)"]),
    twoHPP: toNumber(row["2HPP (mmol/ L)"]),
    bpLying: normaliseString(row["BP (Lying) (mm hg)"]),
    bpSitting: normaliseString(row["BP (Sitting) (mm hg)"]),
    bpStanding: normaliseString(row["BP (Standing) (mm hg)"]),
    height: toNumber(row["Height (cm)"]),
    weight: toNumber(row["Weight (kg)"]),
    remarks: normaliseString(row.Remarks || row.notes || row["Remarks "]),
  };
};

export const loadPatientVitalsFromExcel = async (fileUrl) => {
  const targetUrl = fileUrl ?? DEFAULT_VITALS_FILE_URL;
  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error(`Unable to load patient vitals: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames?.[0];

  if (!firstSheetName) {
    throw new Error("Patient vitals file does not contain any sheets.");
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  return rawRows
    .map((row, index) => buildVitalRecord(row, index))
    .filter((record) => record.nric);
};

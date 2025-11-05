import * as XLSX from "xlsx";

const DEFAULT_PATIENT_FILE_URL = new URL("../assets/data/Patients.xlsx", import.meta.url).href;

const normaliseString = (value) =>
  (value ?? "")
    .toString()
    .trim();

const splitName = (rawName) => {
  const fullName = normaliseString(rawName);
  if (!fullName) {
    return {
      fullName: "",
      firstName: "",
      lastName: "",
    };
  }

  const parts = fullName.split(/\s+/);
  if (parts.length === 1) {
    return {
      fullName,
      firstName: fullName,
      lastName: "",
    };
  }

  return {
    fullName,
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
};

const buildPatientRecord = (row, index) => {
  const nric = normaliseString(
    row.NRIC ||
      row.nric ||
      row["NRIC "] ||
      row["NRIC No"] ||
      row["NRIC Number"]
  );

  const {
    fullName,
    firstName,
    lastName,
  } = splitName(row.Name || row.name);

  const nursingHomeName = normaliseString(
    row["NH name"] ||
      row.NHName ||
      row.NursingHome ||
      row["Nursing Home"] ||
      row.nursingHome
  );
  const sex = normaliseString(row.Gender || row.gender || row.Sex || row.sex);
  const dateOfBirth = normaliseString(
    row.DOB ||
      row["Date Of Birth"] ||
      row.DateOfBirth ||
      row["Date of Birth"] ||
      row.dob
  );
  const emergencyContactName = normaliseString(
    row["Emergency Contact Name"] ||
      row.EmergencyContactName ||
      row["Emergency Contact"] ||
      row.emergencyContactName
  );
  const emergencyContactNumber = normaliseString(
    row["Emergency Contact Contact"] ||
      row.EmergencyContactContact ||
      row["Emergency Contact Number"] ||
      row.emergencyContactNumber
  );
  const emergencyContactRelationship = normaliseString(
    row.Relationship ||
      row["Relationship To Emergency Contact"] ||
      row.EmergencyContactRelationship ||
      row.emergencyContactRelationship
  );

  const patientId = normaliseString(row["Patient ID"] || row.PatientID || row.patientId);
  const mfecNumber = normaliseString(row["MFEC no."] || row.MFECNo || row.mfecNumber);
  const reportDate = normaliseString(row["Report Date"] || row.ReportDate || row.reportDate);
  const sourceFile = normaliseString(row["Source File"] || row.SourceFile || row.sourceFile);

  const ageRaw = normaliseString(row.Age || row.age);
  const age = ageRaw ? Number(ageRaw) : null;

  return {
    id: patientId || nric || `patient-${index + 1}`,
    nric,
    patientId,
    reportDate,
    firstName,
    lastName,
    fullName,
    nursingHomeName,
    sex,
    dateOfBirth,
    age: Number.isNaN(age) ? null : age,
    mfecNumber,
    emergencyContactName,
    emergencyContactNumber,
    emergencyContactRelationship,
    sourceFile,
  };
};

export const loadPatientDirectoryFromExcel = async (fileUrl) => {
  const targetUrl = fileUrl ?? DEFAULT_PATIENT_FILE_URL;
  const response = await fetch(targetUrl);
  if (!response.ok) {
    throw new Error(`Unable to load patient directory: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames?.[0];

  if (!firstSheetName) {
    throw new Error("Patient directory file does not contain any sheets.");
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  const cleaned = rawRows
    .map((row, index) => buildPatientRecord(row, index))
    .filter((record) => record.nric);

  return cleaned;
};
 
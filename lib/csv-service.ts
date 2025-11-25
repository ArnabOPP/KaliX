// Google Sheets CSV fetching and parsing service

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSoUrbuhtYLt8rgvqUa50dR1t8xYvrZvIZE0HXP3otUOEKICNi52AaKMs1W_sKcnTEsJlYNnRRcq1Qr/pub?gid=0&single=true&output=csv"

export interface CSVUser {
  email: string
  password: string
  name: string
  status: string
  contact: string
  phone: string // Added phone field to store phone numbers
}

export interface ParsedUser {
  email: string
  password: string
  name: string
  status: "online" | "offline" | "busy"
  phone: string // Changed from contacts array to single phone field
}

// Parse CSV text into records - improved parser for edge cases
function parseCSV(text: string): Record<string, string>[] {
  const lines = text
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0)

  console.log("[v0] CSV lines count:", lines.length)
  console.log("[v0] First line (headers):", lines[0])

  if (lines.length === 0) {
    console.log("[v0] No data found in CSV")
    return []
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
  console.log("[v0] Parsed headers:", headers)

  const records = lines.slice(1).map((line, idx) => {
    const values = line.split(",").map((v) => v.trim())
    const record: Record<string, string> = {}

    headers.forEach((header, index) => {
      record[header] = values[index] || ""
    })

    if (record.email) {
      console.log(`[v0] Row ${idx + 2}: ${record.email}`)
    }

    return record
  })

  console.log("[v0] Total records parsed:", records.length)
  return records
}

// Fetch and cache CSV data
let cachedData: ParsedUser[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function fetchUsersFromCSV(): Promise<ParsedUser[]> {
  // Return cached data if still valid
  if (cachedData && Date.now() - lastFetchTime < CACHE_DURATION) {
    console.log("[v0] Returning cached data")
    return cachedData
  }

  try {
    console.log("[v0] Fetching CSV from:", CSV_URL)
    const response = await fetch(CSV_URL, { cache: "no-store" })

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`)
    }

    const csvText = await response.text()
    console.log("[v0] CSV response length:", csvText.length)
    console.log("[v0] First 500 chars:", csvText.substring(0, 500))

    const records = parseCSV(csvText)

    cachedData = records
      .filter((record) => record.email && record.email.length > 0)
      .map((record) => ({
        email: record.email || "",
        password: record.password || "",
        name: record.name || "",
        status: (record.status?.toLowerCase() || "offline") as "online" | "offline" | "busy",
        phone: record.contact || "", // Map contact column to phone field
      }))

    console.log("[v0] Processed users count:", cachedData.length)
    console.log("[v0] Processed users:", cachedData)

    lastFetchTime = Date.now()
    return cachedData
  } catch (error) {
    console.error("[v0] Failed to fetch CSV:", error)
    return []
  }
}

// Find user by email
export async function findUserByEmail(email: string): Promise<ParsedUser | undefined> {
  const users = await fetchUsersFromCSV()
  const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  console.log("[v0] Finding user:", email, "Found:", !!found)
  return found
}

// Get all users
export async function getAllUsers(): Promise<ParsedUser[]> {
  return fetchUsersFromCSV()
}

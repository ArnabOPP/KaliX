// Test CSV service to verify Google Sheets connection
export async function testCSVConnection() {
  try {
    const response = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSoUrbuhtYLt8rgvqUa50dR1t8xYvrZvIZE0HXP3otUOEKICNi52AaKMs1W_sKcnTEsJlYNnRRcq1Qr/pub?gid=0&single=true&output=csv",
    )
    const text = await response.text()
    console.log("[v0] CSV Connection Test - Raw Data:", text)
    return text
  } catch (error) {
    console.error("[v0] CSV Connection Test Failed:", error)
    return null
  }
}

export const cleanJsonResponse = (jsonInputS: string) => {
  let cleanedResponse = jsonInputS
    .replace(/^```json\s*/g, "")
    .replace(/\s*```$/, "")
    .trim();

  // Remove trailing backticks specifically
  cleanedResponse = cleanedResponse.replace(/```$/, ""); // Remove exactly three trailing backticks

  // Log the cleaned response for further inspection
  console.log("Cleaned Response:", cleanedResponse);

  // Remove only non-printable characters and leave everything else intact
  cleanedResponse = cleanedResponse.replace(
    /[^\x20-\x7E\u0600-\u06FF\u00A0-\u00FF]/g,
    ""
  ); // Keep Arabic and other characters intact
  cleanedResponse = cleanedResponse.replace(/\s+$/, ""); // Remove trailing spaces

  return cleanedResponse;
};

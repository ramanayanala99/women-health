// Selection directory reused from user-provided Friendly Teacher code. Not official syllabus content.
const COUNTRIES = ["India", "Canada", "United States", "United Kingdom", "UAE", "Singapore", "Australia", "Other"];

const STATES_BY_COUNTRY = {
  India: ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
  Canada: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"],
  "United States": ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  UAE: ["Abu Dhabi", "Dubai", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"],
  Singapore: ["Singapore"],
  Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory"],
};

// Curriculum type — the actual program a school follows, which can differ from the
// country's default (e.g. British, American, IB, and CBSE schools all coexist in UAE).
const CURRICULA_BY_COUNTRY = {
  India: ["NCERT / CBSE", "ICSE / CISCE", "State Board Curriculum", "IB (PYP/MYP/DP)", "Cambridge International (IGCSE)"],
  Canada: ["Provincial Curriculum", "IB (PYP/MYP/DP)", "Cambridge International (IGCSE)"],
  "United States": ["Common Core", "My State's Standards", "IB (PYP/MYP/DP)", "Cambridge International (IGCSE)", "Classical / Charter"],
  "United Kingdom": ["UK National Curriculum (England)", "Scottish Curriculum for Excellence", "Welsh Curriculum", "Northern Ireland Curriculum", "IB (PYP/MYP/DP)"],
  UAE: ["British (UK National Curriculum)", "American (US Common Core)", "Indian (CBSE / NCERT)", "Indian (ICSE)", "IB (PYP/MYP/DP)", "UAE MOE (Ministry Curriculum)"],
  Singapore: ["Singapore MOE", "IB (PYP/MYP/DP)", "Cambridge International (IGCSE)"],
  Australia: ["Australian Curriculum (ACARA)", "NSW Syllabus", "Victorian Curriculum", "Queensland Syllabus", "WA Curriculum", "IB (PYP/MYP/DP)"],
  Other: ["National Curriculum", "British (UK National Curriculum)", "American (US Common Core)", "IB (PYP/MYP/DP)", "Cambridge International (IGCSE)"],
};

const BOARDS_BY_COUNTRY = {
  India: ["CBSE", "ICSE", "State Board", "IB", "Cambridge (IGCSE)", "NIOS", "Other"],
  Canada: ["Ontario Curriculum", "Alberta Program of Studies", "BC Curriculum", "Quebec Education Program", "Manitoba Curriculum", "Saskatchewan Curriculum", "Atlantic Canada Curriculum", "IB", "Other"],
  "United States": ["Common Core", "State Standards", "IB", "Cambridge (IGCSE)", "Other"],
  "United Kingdom": ["National Curriculum (England)", "Scottish Curriculum for Excellence", "Welsh Curriculum", "Northern Ireland Curriculum", "GCSE / IGCSE", "IB", "Other"],
  UAE: ["MOE UAE Curriculum", "CBSE", "British Curriculum", "American Curriculum", "IB", "Other"],
  Singapore: ["MOE Singapore", "IB", "Cambridge (IGCSE)", "Other"],
  Australia: ["Australian Curriculum (ACARA)", "NSW Syllabus", "Victorian Curriculum", "IB", "Other"],
  Other: ["IB", "Cambridge (IGCSE)", "Common Core", "Other"],
};
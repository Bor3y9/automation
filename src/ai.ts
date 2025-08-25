// a word frequency counter ( which maps through the text and check if the word exists and count it
// else adds it with a count of 1 ( intializing ))
class Counter {
  private map: Map<string, number>;

  constructor(words: string[]) {
    this.map = new Map();
    for (const word of words) {
      this.map.set(word, (this.map.get(word) || 0) + 1);
    }
  }

  mostCommon(n: number): [string, number][] {
    return [...this.map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  }
}
const STOP_WORDS = new Set([
  "hi",
  "iam",
  "i'm",
  "im",
  "a",
  "from",
  "we",
  "need",
  "for",
  "the",
  "next",
  "to",
  "and",
  "is",
  "in",
  "at",
  "on",
]);

export function processTextMessage(text: string) {
  const lowerText = text.toLowerCase();

  // using regex
  const name = text.match(/I'm (\w+)|my name is (\w+)/i)?.[1] || null;
  const company =
    text.match(/from ([\w\s]+?)(,|,? we|,? phone)/i)?.[1]?.trim() || null;
  const email = text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || null;
  const phone = text.match(/\d{10,11}/)?.[0] || null;
  const dates = text.match(/next month/i) ? [getNextMonth()] : [];

  // 2. remove punctuation and stop words and then extract important keywords we need
  const words = lowerText.replace(/[^\w\s]/g, "").split(/\s+/);
  const filteredWords = words.filter((word) => word && !STOP_WORDS.has(word));
  // #what does filterWords return ?
  // 
  const keywords = new Counter(filteredWords)
    .mostCommon(5)
    .map((item: [string, number]) => item[0]);

  // 3. specify the intent (او الغرض  الهدف )
  let intent: "LEAD" | "SUPPORT" | "INVOICE" | "OTHER" = "OTHER";
  if (
    filteredWords.includes("dashboard") ||
    filteredWords.includes("kpis") ||
    filteredWords.includes("sales")
  ) {
    intent = "LEAD";
  } else if (
    filteredWords.includes("help") ||
    filteredWords.includes("issue") ||
    filteredWords.includes("support") ||
    filteredWords.includes("assist")
  ) {
    intent = "SUPPORT";
  } else if (
    filteredWords.includes("invoice") ||
    filteredWords.includes("payment")
  ) {
    intent = "INVOICE";
  }

  // 4. Classify Department
  let department: "Sales" | "Support" | "Finance" | "Ops" | "Unknown" =
    "Unknown";
  if (intent === "LEAD") {
    department = "Sales";
  } else if (intent === "SUPPORT") {
    department = "Support";
  } else if (intent === "INVOICE") {
    department = "Finance";
  }

  return {
    name,
    company,
    email,
    phone,
    dates,
    keywords,
    intent,
    department,
  };
}

/**
 * Helper to get next month in YYYY-MM-DD format.
 */
function getNextMonth(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
}

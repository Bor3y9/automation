import fs from "fs";
import path from "path";

interface IngestData {
  intent: "LEAD" | "SUPPORT" | "INVOICE" | "OTHER";
  [key: string]: any;
}

const outputDir = path.join(process.cwd(), "out");

export async function performAction(data: IngestData): Promise<string> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const timestamp = new Date().toISOString();
  let actionFired = "No action taken.";

  switch (data.intent) {
    case "LEAD": {
      const fileName = `crm_lead_${timestamp}.json`;
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      actionFired = `Created CRM lead file: ${fileName}`;
      break;
    }
    case "INVOICE": {
      const fileName = `finance_task_${timestamp}.json`;
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      actionFired = `Created finance task file: ${fileName}`;
      break;
    }
    case "SUPPORT": {
      const logFile = path.join(outputDir, "support_queue.log");
      const logEntry = `${timestamp}: User ${data.name || "Unknown"} (${
        data.email || "N/A"
      }) requires support.\n`;
      fs.appendFileSync(logFile, logEntry);
      actionFired = "Appended entry to support_queue.log";
      break;
    }
  }

  return actionFired;
}

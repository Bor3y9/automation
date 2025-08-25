import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'out');


export function getServiceStatus() {
  let leadCount = 0;
  let financeTaskCount = 0;
  let supportEntryCount = 0;

  if (fs.existsSync(outputDir)) {
    const files = fs.readdirSync(outputDir);

    files.forEach(file => {
      if (file.startsWith('crm_lead_')) {
        leadCount++;
      } else if (file.startsWith('finance_task_')) {
        financeTaskCount++;
      }
    });

    const supportLogPath = path.join(outputDir, 'support_queue.log');
    if (fs.existsSync(supportLogPath)) {
      const logContent = fs.readFileSync(supportLogPath, 'utf-8');
      supportEntryCount = logContent.split('\n').filter(line => line).length;
    }
  }

  return {
    status: 'OK',
    artifacts: {
      leads: leadCount,
      finance_tasks: financeTaskCount,
      support_entries: supportEntryCount,
    },
  };
}
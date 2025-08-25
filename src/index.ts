import express, { Request, Response } from "express";
import { processTextMessage } from "./ai";
import { performAction } from "./automation";
import { getServiceStatus } from "./health";

const app = express();
app.use(express.json());

app.post("/ingest", async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res
      .status(400)
      .json({ error: 'A non-empty "message" string is required.' });
  }

  const processedData = await processTextMessage(message);

  res.status(200).json(processedData);
});

app.post("/auto-action", async (req: Request, res: Response) => {
  const ingestData = req.body;

  if (!ingestData || !ingestData.intent) {
    return res
      .status(400)
      .json({ error: 'Invalid data. "intent" field is required.' });
  }

  const actionFired = await performAction(ingestData);

  res.status(200).json({ actionFired });
});

app.get("/health", (req: Request, res: Response) => {
  const status = getServiceStatus();

  res.status(200).json(status);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

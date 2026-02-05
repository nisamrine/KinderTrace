
import { Child, DailyLog } from "../types";

export const fetchChildLogs = async (child: Child, month: string = 'january'): Promise<DailyLog[]> => {
  // Mapping child IDs to filenames to handle specific typos like 'januray' for Rita
  const fileMapping: Record<string, string> = {
    '001': `001_rita_fora_daily_januray.json`, // Using the actual name from the directory
    '002': `002_liam_rey_daily_january.json`,
    '003': `003_iyad_mimi_daily_january.json`
  };

  const fileName = fileMapping[child.id] || `${child.id}_${child.name.toLowerCase().replace(/\s+/g, '_')}_daily_${month.toLowerCase()}.json`;
  const url = `data/logs/${fileName}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch logs: ${response.statusText}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading logs for ${child.name}:`, error);
    return [];
  }
};

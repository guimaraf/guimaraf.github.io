export enum AppStatus {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface DocumentData {
  fileName: string;
  originalText: string;
  organizedText: string;
}

export interface ProcessingError {
  message: string;
  details?: string;
}

export enum AppView {
  DOCKS = 'DOCKS',
  SCAN = 'SCAN',
  VOYAGE = 'VOYAGE',
  CHART = 'CHART'
}

export interface NavLogEntry {
  timestamp: string;
  source: 'COMMAND' | 'VOID' | 'CARTOGRAPHER';
  message: string;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface ScanResult {
  summary: string;
  constellationName: string;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  coordinates: Coordinate[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface VoyageData {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
}

export interface AscensionStep {
  phase: string;
  instruction: string;
  objective: string;
}

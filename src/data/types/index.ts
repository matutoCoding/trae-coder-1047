export interface TransmissionLine {
  id: string;
  lineName: string;
  lineCode: string;
  voltageLevel: string;
  totalLength: number;
  towerCount: number;
  operationDate: string;
  status: "running" | "maintenance" | "outage";
  region: string;
  lineType: string;
  designCompany: string;
  constructionCompany: string;
}

export interface Tower {
  id: string;
  towerNo: string;
  lineId: string;
  lineName: string;
  towerType: string;
  height: number;
  material: string;
  erectionDate: string;
  longitude: number;
  latitude: number;
  status: "normal" | "abnormal" | "maintenance";
  elevation: number;
  span: number;
  towerWeight: number;
  foundationType: string;
}

export interface Defect {
  id: string;
  defectCode: string;
  towerId: string;
  towerNo: string;
  lineId: string;
  lineName: string;
  defectType: string;
  level: "critical" | "major" | "minor" | "general";
  description: string;
  status: "pending" | "processing" | "handled" | "closed";
  foundDate: string;
  foundBy: string;
  handledDate?: string;
  handler?: string;
  location: string;
  images?: string[];
}

export interface InspectionPlan {
  id: string;
  planName: string;
  planType: "routine" | "special" | "accident";
  startDate: string;
  endDate: string;
  inspector: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  towerIds: string[];
  towerCount: number;
  completedCount: number;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface InspectionRecord {
  id: string;
  planId: string;
  planName: string;
  towerId: string;
  towerNo: string;
  lineName: string;
  checkTime: string;
  inspector: string;
  weather: string;
  temperature: number;
  remark: string;
  hasDefect: boolean;
  defectCount: number;
  checkItems: string[];
}

export interface DroneMission {
  id: string;
  missionName: string;
  lineId: string;
  lineName: string;
  flightDate: string;
  pilot: string;
  status: "planned" | "flying" | "completed" | "cancelled";
  flightDuration: number;
  photoCount: number;
  videoCount: number;
  distance: number;
  startTower: string;
  endTower: string;
  weather: string;
  windSpeed: number;
}

export interface InsulatorDetection {
  id: string;
  missionId: string;
  missionName: string;
  towerId: string;
  towerNo: string;
  lineName: string;
  insulatorType: string;
  totalCount: number;
  defectCount: number;
  result: "normal" | "suspicious" | "abnormal";
  detectionTime: string;
  defectTypes: string[];
}

export interface InfraredRecord {
  id: string;
  missionId: string;
  missionName: string;
  towerId: string;
  towerNo: string;
  lineName: string;
  equipment: string;
  maxTemperature: number;
  minTemperature: number;
  ambientTemp: number;
  temperatureDifference: number;
  anomalyType: string;
  level: "normal" | "attention" | "abnormal" | "dangerous";
  detectionTime: string;
}

export interface LiveWorkingTicket {
  id: string;
  ticketNo: string;
  lineId: string;
  lineName: string;
  workType: string;
  planDate: string;
  workLeader: string;
  workerCount: number;
  status: "draft" | "approved" | "in_progress" | "completed" | "cancelled";
  dangerLevel: "low" | "medium" | "high" | "extreme";
  workContent: string;
  safetyMeasures: string[];
  createdAt: string;
  approver?: string;
  approveTime?: string;
}

export interface WorkRecord {
  id: string;
  ticketId: string;
  ticketNo: string;
  lineName: string;
  startTime: string;
  endTime: string;
  workers: string[];
  workLeader: string;
  result: string;
  remark: string;
  weather: string;
  tools: string[];
}

export interface ChannelHazard {
  id: string;
  lineId: string;
  lineName: string;
  hazardType: string;
  hazardLevel: "low" | "medium" | "high";
  description: string;
  location: string;
  distance: number;
  status: "pending" | "processing" | "resolved";
  foundDate: string;
  plannedDate?: string;
  handler?: string;
}

export interface IcingMonitor {
  id: string;
  lineId: string;
  lineName: string;
  towerNo: string;
  icingThickness: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  timestamp: string;
  level: "normal" | "light" | "medium" | "heavy";
}

export interface GallopingMonitor {
  id: string;
  lineId: string;
  lineName: string;
  towerNo: string;
  amplitude: number;
  frequency: number;
  windSpeed: number;
  timestamp: string;
  level: "normal" | "attention" | "warning" | "dangerous";
}

export interface DashboardStats {
  totalLines: number;
  totalTowers: number;
  totalDefects: number;
  pendingDefects: number;
  todayInspections: number;
  completedInspections: number;
  droneMissions: number;
  liveWorkings: number;
  lineHealthRate: number;
  inspectionCompletionRate: number;
}

export interface MenuItem {
  key: string;
  label: string;
  icon: string;
  path: string;
  children?: MenuItem[];
}

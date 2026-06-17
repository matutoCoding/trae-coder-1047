import {
  LayoutDashboard,
  MapPin,
  TowerControl,
  ClipboardList,
  AlertTriangle,
  Plane,
  Zap,
  BarChart3,
} from "lucide-react";

export interface MenuConfig {
  key: string;
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
}

export const menuConfig: MenuConfig[] = [
  {
    key: "dashboard",
    label: "工作台",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    key: "transmission-lines",
    label: "线路台账",
    icon: MapPin,
    path: "/transmission-lines",
  },
  {
    key: "towers",
    label: "杆塔档案",
    icon: TowerControl,
    path: "/towers",
  },
  {
    key: "inspection-plans",
    label: "巡检计划",
    icon: ClipboardList,
    path: "/inspection-plans",
  },
  {
    key: "defects",
    label: "缺陷管理",
    icon: AlertTriangle,
    path: "/defects",
  },
  {
    key: "drone-inspection",
    label: "无人机巡检",
    icon: Plane,
    path: "/drone-inspection",
  },
  {
    key: "live-working",
    label: "带电作业",
    icon: Zap,
    path: "/live-working",
  },
  {
    key: "statistics",
    label: "运行统计",
    icon: BarChart3,
    path: "/statistics",
  },
];

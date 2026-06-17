import { useState } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Activity,
  CloudRain,
  Snowflake,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import {
  channelHazards,
  icingMonitors,
  gallopingMonitors,
  defectTrendData,
  defectLevelDistribution,
  lineDefectData,
  defects,
  transmissionLines,
} from "@/data/mock";

const Statistics = () => {
  const [timeRange, setTimeRange] = useState("year");

  const lineDefectChartData = transmissionLines
    .map((line) => {
      const lineDefects = defects.filter((d) => d.lineId === line.id);
      if (lineDefects.length === 0) {
        const existing = lineDefectData.find(
          (ld) => line.lineName.includes(ld.line.replace("线", ""))
        );
        if (existing) {
          return {
            name: line.lineName,
            紧急: existing.critical,
            重大: existing.major,
            一般: existing.minor,
            其他: existing.general,
          };
        }
      }
      return {
        name: line.lineName,
        紧急: lineDefects.filter((d) => d.level === "critical").length,
        重大: lineDefects.filter((d) => d.level === "major").length,
        一般: lineDefects.filter((d) => d.level === "minor").length,
        其他: lineDefects.filter((d) => d.level === "general").length,
      };
    })
    .filter((d) => d.紧急 + d.重大 + d.一般 + d.其他 > 0);

  const trendData = defectTrendData.map((item) => ({
    month: item.month,
    发现数量: item.count,
    消除数量: item.handled,
  }));

  const levelData = defectLevelDistribution.map((item) => ({
    name: item.name,
    value: item.value,
    color: item.color,
  }));

  const hazardTypeMap: Record<string, number> = {};
  channelHazards.forEach((h) => {
    const key = h.hazardType || "其他隐患";
    hazardTypeMap[key] = (hazardTypeMap[key] || 0) + 1;
  });
  const hazardTypeData = Object.entries(hazardTypeMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#1677ff", "#52c41a", "#fa8c16", "#ff4d4f", "#722ed1"];

  const getHazardLevelLabel = (level: string) => {
    switch (level) {
      case "high":
        return "重大";
      case "medium":
        return "一般";
      case "low":
        return "轻微";
      default:
        return "轻微";
    }
  };

  const getHazardLevelClass = (level: string) => {
    switch (level) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      default:
        return "default";
    }
  };

  const getHazardStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "待处理";
      case "processing":
        return "处理中";
      case "resolved":
        return "已消除";
      default:
        return "待处理";
    }
  };

  const getHazardStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "resolved":
        return "success";
      default:
        return "warning";
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-800">
            运行统计概览
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="h-9 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:border-primary-400"
            >
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="year">本年度</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-primary-700/70">线路健康率</p>
                <p className="text-2xl font-bold text-primary-700">96.8%</p>
              </div>
            </div>
            <p className="text-xs text-primary-600 mt-3">↑ 同比提升 2.3%</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-success-50 to-success-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-success-700/70">巡检完成率</p>
                <p className="text-2xl font-bold text-success-700">92.5%</p>
              </div>
            </div>
            <p className="text-xs text-success-600 mt-3">↑ 环比提升 5.1%</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-warning-50 to-warning-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-warning-700/70">缺陷消缺率</p>
                <p className="text-2xl font-bold text-warning-700">85.3%</p>
              </div>
            </div>
            <p className="text-xs text-warning-600 mt-3">紧急缺陷 100%</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-violet-700/70">可用率</p>
                <p className="text-2xl font-bold text-violet-700">99.2%</p>
              </div>
            </div>
            <p className="text-xs text-violet-600 mt-3">全年停运 28小时</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary-500" />
              缺陷趋势
            </h4>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorDefect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1677ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#8c8c8c" fontSize={12} />
                <YAxis stroke="#8c8c8c" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="发现数量"
                  stroke="#1677ff"
                  fill="url(#colorDefect)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="消除数量"
                  stroke="#52c41a"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary-500" />
              缺陷等级分布
            </h4>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            各线路缺陷统计
          </h4>
        </div>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lineDefectChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#8c8c8c" fontSize={11} />
              <YAxis stroke="#8c8c8c" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
              <Bar dataKey="紧急" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
              <Bar dataKey="重大" fill="#fa8c16" radius={[4, 4, 0, 0]} />
              <Bar dataKey="一般" fill="#faad14" radius={[4, 4, 0, 0]} />
              <Bar dataKey="其他" fill="#52c41a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h4 className="text-base font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-primary-500" />
            通道隐患分布
          </h4>
          <div className="h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hazardTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {hazardTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="text-sm">
              <span className="text-neutral-500">隐患总数：</span>
              <span className="font-medium text-neutral-800">
                {channelHazards.length} 处
              </span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h4 className="text-base font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-primary-500" />
            覆冰舞动监测
          </h4>
          <div className="space-y-3">
            {icingMonitors.map((monitor) => {
              const galloping = gallopingMonitors.find(
                (g) => g.lineId === monitor.lineId && g.towerNo === monitor.towerNo
              );
              const thickness = monitor.icingThickness;
              let levelLabel = "正常";
              let levelClass = "success";
              if (thickness >= 10) {
                levelLabel = "严重";
                levelClass = "danger";
              } else if (thickness >= 5) {
                levelLabel = "注意";
                levelClass = "warning";
              } else if (thickness > 0) {
                levelLabel = "轻微";
                levelClass = "warning";
              }

              return (
                <div
                  key={monitor.id}
                  className="p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-800">
                      {monitor.lineName} {monitor.towerNo}号塔
                    </span>
                    <span className={`status-tag ${levelClass}`}>
                      {levelLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-neutral-500">覆冰厚度</span>
                      <p className="text-neutral-700 font-medium">
                        {thickness} mm
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">环境温度</span>
                      <p className="text-neutral-700 font-medium">
                        {monitor.temperature}°C
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">风速</span>
                      <p className="text-neutral-700 font-medium">
                        {monitor.windSpeed}m/s
                      </p>
                    </div>
                  </div>
                  {galloping && (
                    <div className="grid grid-cols-2 gap-2 text-xs mt-2 pt-2 border-t border-neutral-200/50">
                      <div>
                        <span className="text-neutral-500">舞动幅值</span>
                        <p className="text-neutral-700 font-medium">
                          {galloping.amplitude} m
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-500">舞动频率</span>
                        <p className="text-neutral-700 font-medium">
                          {galloping.frequency} Hz
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-primary-500 hover:text-primary-600 font-medium">
            查看全部监测点 →
          </button>
        </div>
      </div>

      <div className="card p-5">
        <h4 className="text-base font-semibold text-neutral-800 mb-4">
          通道隐患列表
        </h4>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>隐患编号</th>
                <th>所属线路</th>
                <th>隐患类型</th>
                <th>隐患位置</th>
                <th>隐患等级</th>
                <th>发现日期</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {channelHazards.map((hazard) => (
                <tr key={hazard.id}>
                  <td className="font-medium text-neutral-700 font-mono">
                    {hazard.id}
                  </td>
                  <td className="text-neutral-600">{hazard.lineName}</td>
                  <td className="text-neutral-600">
                    {hazard.hazardType || "其他隐患"}
                  </td>
                  <td className="text-neutral-500">
                    {hazard.location || "-"}
                  </td>
                  <td>
                    <span
                      className={`status-tag ${getHazardLevelClass(
                        hazard.hazardLevel
                      )}`}
                    >
                      {getHazardLevelLabel(hazard.hazardLevel)}
                    </span>
                  </td>
                  <td className="text-neutral-500">{hazard.foundDate}</td>
                  <td>
                    <span
                      className={`status-tag ${getHazardStatusClass(
                        hazard.status
                      )}`}
                    >
                      {getHazardStatusLabel(hazard.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

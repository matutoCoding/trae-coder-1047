import { useState, useMemo } from "react";
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
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
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

const ANALYSIS_COLORS = {
  树木隐患: "#1677ff",
  施工隐患: "#52c41a",
  山体滑坡: "#fa8c16",
  违章建筑: "#ff4d4f",
  其他隐患: "#722ed1",
  高: "#ff4d4f",
  中: "#fa8c16",
  低: "#52c41a",
  待处理: "#fa8c16",
  处理中: "#1677ff",
  已消除: "#52c41a",
};

const Statistics = () => {
  const [timeRange, setTimeRange] = useState("year");
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<
    "overview" | "governance"
  >("overview");
  const [filterLine, setFilterLine] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

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

  const getHazardLevelDisplayName = (level: string) => {
    if (level === "high") return "高";
    if (level === "medium") return "中";
    if (level === "low") return "低";
    return "低";
  };

  const governanceStats = useMemo(() => {
    const total = channelHazards.length;
    const pending = channelHazards.filter((h) => h.status === "pending").length;
    const processing = channelHazards.filter(
      (h) => h.status === "processing"
    ).length;
    const resolved = channelHazards.filter((h) => h.status === "resolved").length;
    const high = channelHazards.filter((h) => h.hazardLevel === "high").length;
    const medium = channelHazards.filter(
      (h) => h.hazardLevel === "medium"
    ).length;
    const low = channelHazards.filter((h) => h.hazardLevel === "low").length;

    return {
      total,
      pending,
      processing,
      resolved,
      high,
      medium,
      low,
      rate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    };
  }, []);

  const lineHazardData = useMemo(() => {
    const lineMap: Record<string, { total: number; resolved: number; pending: number; processing: number }> = {};
    channelHazards.forEach((h) => {
      if (!lineMap[h.lineName]) {
        lineMap[h.lineName] = { total: 0, resolved: 0, pending: 0, processing: 0 };
      }
      lineMap[h.lineName].total++;
      if (h.status === "resolved") lineMap[h.lineName].resolved++;
      else if (h.status === "pending") lineMap[h.lineName].pending++;
      else if (h.status === "processing") lineMap[h.lineName].processing++;
    });
    return Object.entries(lineMap)
      .map(([line, data]) => ({
        name: line.replace(/^\d+kV/, ""),
        已消除: data.resolved,
        处理中: data.processing,
        待处理: data.pending,
        ...data,
      }))
      .sort((a, b) => b.total - a.total);
  }, []);

  const typeHazardData = useMemo(() => {
    const typeMap: Record<string, { total: number; resolved: number }> = {};
    channelHazards.forEach((h) => {
      const key = h.hazardType || "其他隐患";
      if (!typeMap[key]) {
        typeMap[key] = { total: 0, resolved: 0 };
      }
      typeMap[key].total++;
      if (h.status === "resolved") typeMap[key].resolved++;
    });
    return Object.entries(typeMap).map(([name, data]) => ({
      name,
      value: data.total,
      已消除: data.resolved,
      未消除: data.total - data.resolved,
    }));
  }, []);

  const levelStatusData = useMemo(() => {
    const levels = ["high", "medium", "low"];
    const statuses = ["pending", "processing", "resolved"];
    const result: Array<{ level: string; status: string; count: number }> = [];

    levels.forEach((level) => {
      statuses.forEach((status) => {
        const count = channelHazards.filter(
          (h) => h.hazardLevel === level && h.status === status
        ).length;
        result.push({
          level: getHazardLevelDisplayName(level),
          status: getHazardStatusLabel(status),
          count,
        });
      });
    });

    return result;
  }, []);

  const filteredHazards = useMemo(() => {
    return channelHazards.filter((h) => {
      if (filterLine && h.lineName !== filterLine) return false;
      if (filterType && h.hazardType !== filterType) return false;
      if (filterLevel && h.hazardLevel !== filterLevel) return false;
      if (filterStatus && h.status !== filterStatus) return false;
      return true;
    });
  }, [filterLine, filterType, filterLevel, filterStatus]);

  const activeFiltersCount = [
    filterLine,
    filterType,
    filterLevel,
    filterStatus,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterLine(null);
    setFilterType(null);
    setFilterLevel(null);
    setFilterStatus(null);
  };

  const handleLineClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const name = data.activePayload[0].payload.name;
      const fullLineName = transmissionLines.find((l) =>
        l.lineName.includes(name)
      )?.lineName;
      if (fullLineName) {
        setFilterLine(filterLine === fullLineName ? null : fullLineName);
      }
    }
  };

  const handleTypeClick = (data: any) => {
    if (data && data.name) {
      setFilterType(filterType === data.name ? null : data.name);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-neutral-800">
            运行统计分析
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex bg-neutral-100 rounded-lg p-0.5">
              <button
                onClick={() => setActiveAnalysisTab("overview")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeAnalysisTab === "overview"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-800"
                }`}
              >
                运行概览
              </button>
              <button
                onClick={() => setActiveAnalysisTab("governance")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeAnalysisTab === "governance"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-neutral-600 hover:text-neutral-800"
                }`}
              >
                隐患治理分析
              </button>
            </div>
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

      {activeAnalysisTab === "overview" && (
        <>
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
                    (g) =>
                      g.lineId === monitor.lineId &&
                      g.towerNo === monitor.towerNo
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
        </>
      )}

      {activeAnalysisTab === "governance" && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">隐患总数</p>
                  <p className="text-xl font-bold text-neutral-800">
                    {governanceStats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning-500" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">待处理</p>
                  <p className="text-xl font-bold text-warning-600">
                    {governanceStats.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">处理中</p>
                  <p className="text-xl font-bold text-blue-600">
                    {governanceStats.processing}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success-500" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">
                    已消除 / 治理率
                  </p>
                  <p className="text-xl font-bold text-success-600">
                    {governanceStats.resolved} / {governanceStats.rate}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 card p-5">
              <h4 className="text-base font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-500" />
                各线路隐患治理进度
                <span className="text-xs font-normal text-neutral-400 ml-2">
                  点击柱状图筛选对应线路
                </span>
              </h4>
              {filterLine && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-md">
                    线路: {filterLine}
                    <button
                      onClick={() => setFilterLine(null)}
                      className="ml-1 hover:text-primary-700"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              )}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={lineHazardData}
                    onClick={handleLineClick}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#8c8c8c" fontSize={11} />
                    <YAxis stroke="#8c8c8c" fontSize={12} />
                    <Tooltip
                      cursor={{ fill: "rgba(22, 119, 255, 0.05)" }}
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e8e8e8",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="待处理"
                      stackId="a"
                      fill="#fa8c16"
                      radius={[0, 0, 0, 0]}
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="处理中"
                      stackId="a"
                      fill="#1677ff"
                      radius={[0, 0, 0, 0]}
                      cursor="pointer"
                    />
                    <Bar
                      dataKey="已消除"
                      stackId="a"
                      fill="#52c41a"
                      radius={[4, 4, 0, 0]}
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card p-5">
              <h4 className="text-base font-semibold text-neutral-800 mb-2 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-primary-500" />
                隐患类型分布
                <span className="text-xs font-normal text-neutral-400 ml-2">
                  点击筛选
                </span>
              </h4>
              {filterType && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-50 text-warning-600 text-xs rounded-md">
                    类型: {filterType}
                    <button
                      onClick={() => setFilterType(null)}
                      className="ml-1 hover:text-warning-700"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              )}
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart onClick={handleTypeClick}>
                    <Pie
                      data={typeHazardData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      cursor="pointer"
                    >
                      {typeHazardData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={
                            ANALYSIS_COLORS[
                              entry.name as keyof typeof ANALYSIS_COLORS
                            ] || "#722ed1"
                          }
                          opacity={
                            filterType && filterType !== entry.name ? 0.4 : 1
                          }
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
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      fontSize={11}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h4 className="text-base font-semibold text-neutral-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-500" />
              隐患等级 × 处理状态 矩阵
            </h4>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="level" stroke="#8c8c8c" fontSize={12} />
                  <YAxis stroke="#8c8c8c" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#fff",
                      border: "1px solid #e8e8e8",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="count"
                    name="数量"
                    fill="#1677ff"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-500" />
                隐患治理明细
                {activeFiltersCount > 0 && (
                  <span className="text-xs font-normal bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">
                    {activeFiltersCount} 个筛选
                  </span>
                )}
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <select
                    value={filterLevel || ""}
                    onChange={(e) =>
                      setFilterLevel(e.target.value || null)
                    }
                    className="h-8 px-2 rounded-md border border-neutral-200 text-xs bg-white focus:outline-none focus:border-primary-400"
                  >
                    <option value="">全部等级</option>
                    <option value="high">重大</option>
                    <option value="medium">一般</option>
                    <option value="low">轻微</option>
                  </select>
                  <select
                    value={filterStatus || ""}
                    onChange={(e) =>
                      setFilterStatus(e.target.value || null)
                    }
                    className="h-8 px-2 rounded-md border border-neutral-200 text-xs bg-white focus:outline-none focus:border-primary-400"
                  >
                    <option value="">全部状态</option>
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="resolved">已消除</option>
                  </select>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-neutral-500 hover:text-primary-600 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    清除筛选
                  </button>
                )}
              </div>
            </div>

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
                    <th>计划消除</th>
                    <th>状态</th>
                    <th>负责人</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHazards.length > 0 ? (
                    filteredHazards.map((hazard) => (
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
                        <td className="text-neutral-500">
                          {hazard.foundDate}
                        </td>
                        <td className="text-neutral-500">
                          {hazard.plannedDate || "-"}
                        </td>
                        <td>
                          <span
                            className={`status-tag ${getHazardStatusClass(
                              hazard.status
                            )}`}
                          >
                            {getHazardStatusLabel(hazard.status)}
                          </span>
                        </td>
                        <td className="text-neutral-600">
                          {hazard.handler || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-8 text-neutral-400"
                      >
                        无符合筛选条件的隐患
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>
                共 {filteredHazards.length} 条记录
                {activeFiltersCount > 0 && (
                  <span className="ml-1">
                    （从 {channelHazards.length} 条中筛选）
                  </span>
                )}
              </span>
              <span className="flex items-center gap-4">
                <span>
                  待处理:{" "}
                  <span className="text-warning-600 font-medium">
                    {filteredHazards.filter((h) => h.status === "pending").length}
                  </span>
                </span>
                <span>
                  处理中:{" "}
                  <span className="text-blue-600 font-medium">
                    {
                      filteredHazards.filter((h) => h.status === "processing")
                        .length
                    }
                  </span>
                </span>
                <span>
                  已消除:{" "}
                  <span className="text-success-600 font-medium">
                    {
                      filteredHazards.filter((h) => h.status === "resolved")
                        .length
                    }
                  </span>
                </span>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;

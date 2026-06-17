import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  MapPin,
  TowerControl,
  AlertTriangle,
  ClipboardList,
  Plane,
  Zap,
  TrendingUp,
  Clock,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  dashboardStats,
  defectTrendData,
  defectLevelDistribution,
  defects,
  inspectionPlans,
  lineDefectData,
} from "@/data/mock";
import { useNavigate } from "react-router-dom";

const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  color,
  trend,
  trendValue,
  onClick,
}: {
  title: string;
  value: number | string;
  unit?: string;
  icon: React.ElementType;
  color: string;
  trend?: "up" | "down";
  trendValue?: string;
  onClick?: () => void;
}) => (
  <div
    className={`card p-5 cursor-pointer hover:shadow-card-hover transition-all duration-300 ${onClick ? "hover:-translate-y-0.5" : ""}`}
    onClick={onClick}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-neutral-500 mb-2">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-neutral-800">{value}</span>
          {unit && <span className="text-sm text-neutral-500">{unit}</span>}
        </div>
        {trend && trendValue && (
          <div className="flex items-center gap-1 mt-2">
            {trend === "up" ? (
              <ArrowUpRight className="w-4 h-4 text-success-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-danger-500" />
            )}
            <span
              className={`text-xs ${
                trend === "up" ? "text-success-500" : "text-danger-500"
              }`}
            >
              {trendValue}
            </span>
            <span className="text-xs text-neutral-400">较上月</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const pendingDefects = defects.filter((d) => d.status === "pending");
  const inProgressPlans = inspectionPlans.filter(
    (p) => p.status === "in_progress"
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="输电线路"
          value={dashboardStats.totalLines}
          unit="条"
          icon={MapPin}
          color="bg-gradient-to-br from-primary-500 to-primary-600"
          onClick={() => navigate("/transmission-lines")}
        />
        <StatCard
          title="杆塔总数"
          value={dashboardStats.totalTowers}
          unit="基"
          icon={TowerControl}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          onClick={() => navigate("/towers")}
        />
        <StatCard
          title="待处理缺陷"
          value={dashboardStats.pendingDefects}
          unit="处"
          icon={AlertTriangle}
          color="bg-gradient-to-br from-warning-500 to-orange-500"
          trend="down"
          trendValue="8.2%"
          onClick={() => navigate("/defects")}
        />
        <StatCard
          title="今日巡检"
          value={dashboardStats.todayInspections}
          unit="次"
          icon={ClipboardList}
          color="bg-gradient-to-br from-violet-500 to-violet-600"
          onClick={() => navigate("/inspection-plans")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-neutral-800">
              缺陷趋势分析
            </h3>
            <button
              onClick={() => navigate("/statistics")}
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              查看详情
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defectTrendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1677ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHandled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#52c41a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="发现缺陷"
                  stroke="#1677ff"
                  strokeWidth={2}
                  fill="url(#colorCount)"
                />
                <Area
                  type="monotone"
                  dataKey="handled"
                  name="已处理"
                  stroke="#52c41a"
                  strokeWidth={2}
                  fill="url(#colorHandled)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-base font-semibold text-neutral-800 mb-4">
            缺陷等级分布
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defectLevelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {defectLevelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-neutral-800">
              各线路缺陷统计
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineDefectData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="line" tick={{ fontSize: 12 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="critical" name="紧急缺陷" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="major" name="重大缺陷" fill="#fa8c16" radius={[4, 4, 0, 0]} />
                <Bar dataKey="minor" name="一般缺陷" fill="#faad14" radius={[4, 4, 0, 0]} />
                <Bar dataKey="general" name="其他" fill="#52c41a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-neutral-800">
              运行指标
            </h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary-50 to-blue-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">线路健康率</span>
                <span className="text-lg font-bold text-primary-600">
                  {dashboardStats.lineHealthRate}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill primary"
                  style={{ width: `${dashboardStats.lineHealthRate}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-success-50 to-green-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">巡检完成率</span>
                <span className="text-lg font-bold text-success-600">
                  {dashboardStats.inspectionCompletionRate}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill success"
                  style={{ width: `${dashboardStats.inspectionCompletionRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-3 rounded-lg bg-orange-50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/drone-inspection")}
              >
                <Plane className="w-5 h-5 text-orange-500 mb-2" />
                <p className="text-xs text-neutral-500">无人机任务</p>
                <p className="text-lg font-bold text-neutral-800">
                  {dashboardStats.droneMissions}
                </p>
              </div>
              <div
                className="p-3 rounded-lg bg-purple-50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate("/live-working")}
              >
                <Zap className="w-5 h-5 text-purple-500 mb-2" />
                <p className="text-xs text-neutral-500">带电作业</p>
                <p className="text-lg font-bold text-neutral-800">
                  {dashboardStats.liveWorkings}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-neutral-800">
              近期缺陷
            </h3>
            <button
              onClick={() => navigate("/defects")}
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              全部缺陷
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {pendingDefects.slice(0, 5).map((defect) => (
              <div
                key={defect.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                onClick={() => navigate("/defects")}
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    defect.level === "critical"
                      ? "bg-danger-500"
                      : defect.level === "major"
                      ? "bg-warning-500"
                      : defect.level === "minor"
                      ? "bg-yellow-500"
                      : "bg-primary-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-700 truncate">
                    {defect.defectType}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {defect.lineName} - {defect.towerNo}号塔
                  </p>
                </div>
                <span className="text-xs text-neutral-400 flex-shrink-0">
                  {defect.foundDate}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-neutral-800">
              进行中的巡检
            </h3>
            <button
              onClick={() => navigate("/inspection-plans")}
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              全部计划
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {inProgressPlans.map((plan) => {
              const progress =
                plan.towerCount > 0
                  ? Math.round((plan.completedCount / plan.towerCount) * 100)
                  : 0;
              return (
                <div
                  key={plan.id}
                  className="p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
                  onClick={() => navigate("/inspection-plans")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-neutral-700">
                      {plan.planName}
                    </p>
                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      进行中
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-neutral-500">
                      {plan.inspector}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {plan.startDate} ~ {plan.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 progress-bar">
                      <div
                        className="progress-fill primary"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-neutral-600 w-10 text-right">
                      {progress}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

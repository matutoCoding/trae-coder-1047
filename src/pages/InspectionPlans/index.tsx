import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle,
  PlayCircle,
  AlertCircle,
  FileText,
  Map,
} from "lucide-react";
import { inspectionPlans, inspectionRecords } from "@/data/mock";
import type { InspectionPlan } from "@/data/types";

const statusMap = {
  pending: { label: "待执行", className: "default", icon: Clock },
  in_progress: { label: "进行中", className: "info", icon: PlayCircle },
  completed: { label: "已完成", className: "success", icon: CheckCircle },
  cancelled: { label: "已取消", className: "danger", icon: AlertCircle },
};

const typeMap = {
  routine: { label: "例行巡检", className: "info" },
  special: { label: "专项巡检", className: "warning" },
  accident: { label: "事故特巡", className: "danger" },
};

const InspectionPlans = () => {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState<"plans" | "records">("plans");
  const [selectedPlan, setSelectedPlan] = useState<InspectionPlan | null>(null);

  const filteredPlans = inspectionPlans.filter(
    (plan) =>
      plan.planName.includes(searchText) ||
      plan.inspector.includes(searchText)
  );

  const handleViewDetail = (plan: InspectionPlan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex items-center gap-4">
          <div className="flex bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("plans")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "plans"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              巡检计划
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "records"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              巡检记录
            </button>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索计划名称、巡检员..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-default flex items-center gap-2">
              <Filter className="w-4 h-4" />
              筛选
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新建计划
            </button>
          </div>
        </div>
      </div>

      {activeTab === "plans" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPlans.map((plan) => {
            const progress =
              plan.towerCount > 0
                ? Math.round((plan.completedCount / plan.towerCount) * 100)
                : 0;
            const statusInfo = statusMap[plan.status];
            const typeInfo = typeMap[plan.planType];
            const StatusIcon = statusInfo?.icon || Clock;

            return (
              <div
                key={plan.id}
                className="card p-5 hover:shadow-card-hover transition-all cursor-pointer"
                onClick={() => handleViewDetail(plan)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-neutral-800 mb-1">
                        {plan.planName}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`status-tag ${typeInfo?.className}`}>
                          {typeInfo?.label}
                        </span>
                        <span
                          className={`status-tag ${statusInfo?.className}`}
                        >
                          {statusInfo?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusIcon
                    className={`w-5 h-5 ${
                      plan.status === "completed"
                        ? "text-success-500"
                        : plan.status === "in_progress"
                        ? "text-primary-500"
                        : "text-neutral-400"
                    }`}
                  />
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <User className="w-4 h-4" />
                    <span>巡检员：{plan.inspector}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {plan.startDate} ~ {plan.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Map className="w-4 h-4" />
                    <span>杆塔数量：{plan.towerCount} 基</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-neutral-600">完成进度</span>
                    <span className="text-sm font-medium text-neutral-800">
                      {plan.completedCount}/{plan.towerCount} 基 ({progress}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${
                        plan.status === "completed"
                          ? "success"
                          : plan.status === "in_progress"
                          ? "primary"
                          : ""
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {plan.status === "in_progress" && (
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <button className="btn btn-default btn-sm">查看详情</button>
                    <button className="btn btn-primary btn-sm">
                      继续巡检
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>记录编号</th>
                  <th>线路名称</th>
                  <th>杆塔号</th>
                  <th>巡检时间</th>
                  <th>巡检员</th>
                  <th>天气</th>
                  <th>温度</th>
                  <th>缺陷情况</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {inspectionRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="font-medium text-neutral-700">
                      {record.id}
                    </td>
                    <td className="text-neutral-600">{record.lineName}</td>
                    <td className="text-neutral-600">{record.towerNo}号塔</td>
                    <td className="text-neutral-500">{record.checkTime}</td>
                    <td className="text-neutral-600">{record.inspector}</td>
                    <td className="text-neutral-500">{record.weather}</td>
                    <td className="text-neutral-500">{record.temperature}°C</td>
                    <td>
                      {record.hasDefect ? (
                        <span className="status-tag danger">
                          {record.defectCount}处缺陷
                        </span>
                      ) : (
                        <span className="status-tag success">无缺陷</span>
                      )}
                    </td>
                    <td>
                      <button className="text-primary-500 hover:text-primary-600 text-sm">
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50 animate-fade-in">
          <div className="w-[480px] h-full bg-white shadow-xl animate-slide-in-left">
            <div className="h-14 flex items-center justify-between px-5 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-800">
                计划详情
              </h3>
              <button
                onClick={() => setSelectedPlan(null)}
                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-5 overflow-y-auto h-[calc(100%-56px)]">
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-neutral-800 mb-2">
                  {selectedPlan.planName}
                </h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`status-tag ${
                      typeMap[selectedPlan.planType]?.className
                    }`}
                  >
                    {typeMap[selectedPlan.planType]?.label}
                  </span>
                  <span
                    className={`status-tag ${
                      statusMap[selectedPlan.status]?.className
                    }`}
                  >
                    {statusMap[selectedPlan.status]?.label}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-3">
                    基本信息
                  </h5>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">巡检员</span>
                      <span className="text-neutral-700">
                        {selectedPlan.inspector}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">开始日期</span>
                      <span className="text-neutral-700">
                        {selectedPlan.startDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">结束日期</span>
                      <span className="text-neutral-700">
                        {selectedPlan.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">杆塔数量</span>
                      <span className="text-neutral-700">
                        {selectedPlan.towerCount} 基
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">创建人</span>
                      <span className="text-neutral-700">
                        {selectedPlan.createdBy}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">创建时间</span>
                      <span className="text-neutral-700">
                        {selectedPlan.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-3">
                    计划描述
                  </h5>
                  <p className="text-sm text-neutral-600">
                    {selectedPlan.description}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-primary-50">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-medium text-primary-700">
                      完成进度
                    </h5>
                    <span className="text-lg font-bold text-primary-600">
                      {selectedPlan.completedCount}/
                      {selectedPlan.towerCount}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill primary"
                      style={{
                        width: `${
                          selectedPlan.towerCount > 0
                            ? (selectedPlan.completedCount /
                                selectedPlan.towerCount) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-primary w-full">编辑计划</button>
                  <button className="btn btn-default w-full">
                    {selectedPlan.status === "in_progress"
                      ? "继续巡检"
                      : "开始巡检"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionPlans;

import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  AlertTriangle,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  PlayCircle,
  XCircle,
  FileText,
  Eye,
  Edit,
  ArrowRight,
} from "lucide-react";
import { defects } from "@/data/mock";
import type { Defect } from "@/data/types";

const levelMap = {
  critical: { label: "紧急缺陷", className: "danger", color: "#ff4d4f" },
  major: { label: "重大缺陷", className: "warning", color: "#fa8c16" },
  minor: { label: "一般缺陷", className: "warning", color: "#faad14" },
  general: { label: "其他缺陷", className: "default", color: "#52c41a" },
};

const statusMap = {
  pending: { label: "待处理", className: "warning", icon: Clock, step: 0 },
  processing: { label: "处理中", className: "info", icon: PlayCircle, step: 1 },
  handled: { label: "已处理", className: "success", icon: CheckCircle, step: 2 },
  closed: { label: "已闭环", className: "success", icon: CheckCircle, step: 3 },
};

const steps = ["待处理", "处理中", "已处理", "已闭环"];

const Defects = () => {
  const [searchText, setSearchText] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);

  const filteredDefects = defects.filter((defect) => {
    const matchSearch =
      defect.defectType.includes(searchText) ||
      defect.defectCode.includes(searchText) ||
      defect.lineName.includes(searchText);
    const matchLevel = levelFilter === "all" || defect.level === levelFilter;
    const matchStatus = statusFilter === "all" || defect.status === statusFilter;
    return matchSearch && matchLevel && matchStatus;
  });

  const handleViewDetail = (defect: Defect) => {
    setSelectedDefect(defect);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(levelMap).map(([key, value]) => {
          const count = defects.filter((d) => d.level === key).length;
          return (
            <div
              key={key}
              className={`card p-4 cursor-pointer transition-all hover:shadow-card-hover ${
                levelFilter === key ? "ring-2 ring-offset-2" : ""
              }`}
              style={
                levelFilter === key
                  ? { ringColor: value.color, boxShadow: `0 0 0 2px ${value.color}20` }
                  : {}
              }
              onClick={() =>
                setLevelFilter(levelFilter === key ? "all" : key)
              }
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">{value.label}</p>
                  <p className="text-2xl font-bold" style={{ color: value.color }}>
                    {count}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${value.color}15` }}
                >
                  <AlertTriangle
                    className="w-5 h-5"
                    style={{ color: value.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索缺陷编号、类型、线路..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {}}
                className="btn btn-default flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                状态
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:border-primary-400"
            >
              <option value="all">全部状态</option>
              <option value="pending">待处理</option>
              <option value="processing">处理中</option>
              <option value="handled">已处理</option>
              <option value="closed">已闭环</option>
            </select>

            <button className="btn btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              登记缺陷
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>缺陷编号</th>
                <th>缺陷类型</th>
                <th>所属线路</th>
                <th>杆塔号</th>
                <th>缺陷等级</th>
                <th>状态</th>
                <th>发现日期</th>
                <th>发现人</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredDefects.map((defect) => {
                const levelInfo = levelMap[defect.level];
                const statusInfo = statusMap[defect.status];

                return (
                  <tr key={defect.id}>
                    <td className="font-medium text-neutral-700 font-mono">
                      {defect.defectCode}
                    </td>
                    <td className="text-neutral-600">{defect.defectType}</td>
                    <td className="text-neutral-600">{defect.lineName}</td>
                    <td className="text-neutral-600">{defect.towerNo}号塔</td>
                    <td>
                      <span className={`status-tag ${levelInfo?.className}`}>
                        {levelInfo?.label}
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag ${statusInfo?.className}`}>
                        {statusInfo?.label}
                      </span>
                    </td>
                    <td className="text-neutral-500">{defect.foundDate}</td>
                    <td className="text-neutral-600">{defect.foundBy}</td>
                    <td>
                      <button
                        onClick={() => handleViewDetail(defect)}
                        className="text-primary-500 hover:text-primary-600 text-sm flex items-center gap-1"
                      >
                        查看详情
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100">
          <span className="text-sm text-neutral-500">
            共 {filteredDefects.length} 条记录
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-600 transition-colors">
              上一页
            </button>
            <button className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded">
              1
            </button>
            <button className="px-3 py-1.5 text-sm border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-600 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 text-sm border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-600 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>

      {selectedDefect && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50 animate-fade-in">
          <div className="w-[520px] h-full bg-white shadow-xl animate-slide-in-left">
            <div className="h-14 flex items-center justify-between px-5 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-800">
                缺陷详情
              </h3>
              <button
                onClick={() => setSelectedDefect(null)}
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
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-800">
                      {selectedDefect.defectType}
                    </h4>
                    <p className="text-sm text-neutral-500 mt-1">
                      {selectedDefect.defectCode}
                    </p>
                  </div>
                  <span
                    className={`status-tag ${
                      levelMap[selectedDefect.level]?.className
                    }`}
                  >
                    {levelMap[selectedDefect.level]?.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`status-tag ${
                      statusMap[selectedDefect.status]?.className
                    }`}
                  >
                    {statusMap[selectedDefect.status]?.label}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-sm font-medium text-neutral-700 mb-3">
                  处理进度
                </h5>
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const currentStep =
                      statusMap[selectedDefect.status]?.step || 0;
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isCompleted
                              ? "bg-primary-500 text-white"
                              : "bg-neutral-200 text-neutral-500"
                          } ${isCurrent ? "ring-4 ring-primary-100" : ""}`}
                        >
                          {index + 1}
                        </div>
                        <span
                          className={`text-xs mt-2 ${
                            isCompleted
                              ? "text-neutral-700"
                              : "text-neutral-400"
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex -mt-6 mx-4 relative z-0">
                  <div className="h-0.5 bg-neutral-200 flex-1" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-3">
                    基本信息
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-neutral-500">所属线路</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedDefect.lineName}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">杆塔编号</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedDefect.towerNo}号塔
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">缺陷位置</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedDefect.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">发现日期</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedDefect.foundDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">发现人</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedDefect.foundBy}
                      </p>
                    </div>
                    {selectedDefect.handler && (
                      <div>
                        <span className="text-neutral-500">处理人</span>
                        <p className="text-neutral-700 mt-0.5">
                          {selectedDefect.handler}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-2">
                    缺陷描述
                  </h5>
                  <p className="text-sm text-neutral-600">
                    {selectedDefect.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-primary w-full">处理缺陷</button>
                  <button className="btn btn-default w-full">编辑信息</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Defects;

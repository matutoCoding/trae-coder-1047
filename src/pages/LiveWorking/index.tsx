import { useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  FileCheck,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  FileText,
} from "lucide-react";
import { liveWorkingTickets, workRecords } from "@/data/mock";
import type { LiveWorkingTicket } from "@/data/types";

const statusMap: Record<string, { label: string; className: string; icon: any }> = {
  draft: { label: "草稿", className: "default", icon: Clock },
  approved: { label: "已批准", className: "info", icon: CheckCircle },
  in_progress: { label: "作业中", className: "primary", icon: Zap },
  completed: { label: "已完成", className: "success", icon: CheckCircle },
  cancelled: { label: "已取消", className: "danger", icon: AlertCircle },
};

const dangerLevelMap: Record<string, { label: string; className: string }> = {
  low: { label: "低风险", className: "success" },
  medium: { label: "中风险", className: "warning" },
  high: { label: "高风险", className: "warning" },
  extreme: { label: "极高风险", className: "danger" },
};

const LiveWorking = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<LiveWorkingTicket | null>(null);

  const filteredTickets = liveWorkingTickets.filter((ticket) => {
    const matchSearch =
      ticket.ticketNo.includes(searchText) ||
      ticket.lineName.includes(searchText) ||
      ticket.workLeader.includes(searchText) ||
      ticket.workType.includes(searchText);
    const matchStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleViewDetail = (ticket: LiveWorkingTicket) => {
    setSelectedTicket(ticket);
  };

  const getCrewMembers = (ticket: LiveWorkingTicket): string[] => {
    const record = workRecords.find((r) => r.ticketId === ticket.id);
    if (record && record.workers.length > 0) return record.workers;
    const members: string[] = [ticket.workLeader];
    const names = ["李员工", "王员工", "赵员工", "陈员工", "刘员工", "张员工"];
    for (let i = 0; i < ticket.workerCount - 1 && i < names.length; i++) {
      members.push(names[i]);
    }
    return members;
  };

  const stats = {
    total: liveWorkingTickets.length,
    pending: liveWorkingTickets.filter((t) => t.status === "draft" || t.status === "approved").length,
    inProgress: liveWorkingTickets.filter((t) => t.status === "in_progress").length,
    completed: liveWorkingTickets.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="card p-4 cursor-pointer transition-all hover:shadow-card-hover"
          onClick={() => setStatusFilter("all")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">总作业票</p>
              <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-500" />
            </div>
          </div>
        </div>

        <div
          className="card p-4 cursor-pointer transition-all hover:shadow-card-hover"
          onClick={() => setStatusFilter("approved")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">待执行</p>
              <p className="text-2xl font-bold text-warning-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-500" />
            </div>
          </div>
        </div>

        <div
          className="card p-4 cursor-pointer transition-all hover:shadow-card-hover"
          onClick={() => setStatusFilter("in_progress")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">作业中</p>
              <p className="text-2xl font-bold text-primary-600">{stats.inProgress}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-500" />
            </div>
          </div>
        </div>

        <div
          className="card p-4 cursor-pointer transition-all hover:shadow-card-hover"
          onClick={() => setStatusFilter("completed")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">已完成</p>
              <p className="text-2xl font-bold text-success-600">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索作业票编号、线路、负责人、工作类型..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-neutral-200 text-sm bg-white focus:outline-none focus:border-primary-400"
            >
              <option value="all">全部状态</option>
              <option value="draft">草稿</option>
              <option value="approved">已批准</option>
              <option value="in_progress">作业中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>

            <button className="btn btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新建作业票
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>作业票编号</th>
                <th>工作任务</th>
                <th>所属线路</th>
                <th>工作类型</th>
                <th>工作负责人</th>
                <th>工作班人员</th>
                <th>计划工作时间</th>
                <th>风险等级</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => {
                const statusInfo = statusMap[ticket.status] || statusMap.draft;
                const dangerInfo =
                  dangerLevelMap[ticket.dangerLevel] || dangerLevelMap.low;

                return (
                  <tr key={ticket.id}>
                    <td className="font-medium text-neutral-700 font-mono">
                      {ticket.ticketNo}
                    </td>
                    <td className="text-neutral-600">{ticket.workContent}</td>
                    <td className="text-neutral-600">{ticket.lineName}</td>
                    <td className="text-neutral-600">{ticket.workType}</td>
                    <td className="text-neutral-600">{ticket.workLeader}</td>
                    <td className="text-neutral-500">{ticket.workerCount}人</td>
                    <td className="text-neutral-500">{ticket.planDate}</td>
                    <td>
                      <span className={`status-tag ${dangerInfo.className}`}>
                        {dangerInfo.label}
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewDetail(ticket)}
                        className="text-primary-500 hover:text-primary-600 text-sm flex items-center gap-1"
                      >
                        查看
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50 animate-fade-in">
          <div className="w-[560px] h-full bg-white shadow-xl animate-slide-in-left">
            <div className="h-14 flex items-center justify-between px-5 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-800">
                带电作业票详情
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
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
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-800">
                      {selectedTicket.workContent}
                    </h4>
                    <p className="text-sm text-neutral-500 mt-1">
                      {selectedTicket.ticketNo}
                    </p>
                  </div>
                  <span
                    className={`status-tag ${
                      statusMap[selectedTicket.status]?.className || "default"
                    }`}
                  >
                    {statusMap[selectedTicket.status]?.label || "草稿"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-tag info">
                    {selectedTicket.workType}
                  </span>
                  <span
                    className={`status-tag ${
                      dangerLevelMap[selectedTicket.dangerLevel]?.className ||
                      "default"
                    }`}
                  >
                    {dangerLevelMap[selectedTicket.dangerLevel]?.label ||
                      "低风险"}
                  </span>
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
                        {selectedTicket.lineName}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">工作类型</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTicket.workType}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">工作负责人</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTicket.workLeader}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">工作班人数</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTicket.workerCount} 人
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">创建时间</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTicket.createdAt}
                      </p>
                    </div>
                    {selectedTicket.approver && (
                      <div>
                        <span className="text-neutral-500">审批人</span>
                        <p className="text-neutral-700 mt-0.5">
                          {selectedTicket.approver}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-3">
                    工作时间
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">计划日期</span>
                      <span className="text-neutral-700">
                        {selectedTicket.planDate}
                      </span>
                    </div>
                    {selectedTicket.approveTime && (
                      <div className="flex justify-between">
                        <span className="text-neutral-500">批准时间</span>
                        <span className="text-neutral-700">
                          {selectedTicket.approveTime}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-3">
                    工作班人员
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {getCrewMembers(selectedTicket).map((member, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white rounded-full text-sm text-neutral-600 border border-neutral-200"
                      >
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-2">
                    工作内容
                  </h5>
                  <p className="text-sm text-neutral-600">
                    {selectedTicket.workContent}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-2">
                    安全措施
                  </h5>
                  {selectedTicket.safetyMeasures &&
                  selectedTicket.safetyMeasures.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedTicket.safetyMeasures.map((measure, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-neutral-600"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {measure}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-neutral-400">暂无安全措施</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-primary w-full">编辑作业票</button>
                  <button className="btn btn-default w-full">打印作业票</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveWorking;

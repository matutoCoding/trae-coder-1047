import { useState, useMemo } from "react";
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
  X,
  Edit3,
  Printer,
  FileSpreadsheet,
  Users,
  Shield,
  Workflow,
  Wrench,
  Cloud,
} from "lucide-react";
import { liveWorkingTickets, workRecords } from "@/data/mock";
import type { LiveWorkingTicket, WorkRecord } from "@/data/types";

const statusMap: Record<
  string,
  { label: string; className: string; icon: any }
> = {
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

interface ProgressStep {
  key: string;
  label: string;
  icon: any;
  description: string;
  completed: boolean;
  active: boolean;
  date?: string;
  operator?: string;
}

const LiveWorking = () => {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<LiveWorkingTicket | null>(
    null
  );

  const getStatusMatch = (ticketStatus: string, filter: string): boolean => {
    if (filter === "all") return true;
    if (filter === "pending") {
      return ticketStatus === "draft" || ticketStatus === "approved";
    }
    return ticketStatus === filter;
  };

  const filteredTickets = liveWorkingTickets.filter((ticket) => {
    const matchSearch =
      ticket.ticketNo.includes(searchText) ||
      ticket.lineName.includes(searchText) ||
      ticket.workLeader.includes(searchText) ||
      ticket.workType.includes(searchText);
    const matchStatus = getStatusMatch(ticket.status, statusFilter);
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

  const getTicketWorkRecord = (
    ticketId: string
  ): WorkRecord | undefined => {
    return workRecords.find((r) => r.ticketId === ticketId);
  };

  const getProgressSteps = (ticket: LiveWorkingTicket): ProgressStep[] => {
    const statusOrder = ["draft", "approved", "in_progress", "completed"];
    const currentIndex = statusOrder.indexOf(ticket.status);
    const record = getTicketWorkRecord(ticket.id);

    const steps: ProgressStep[] = [
      {
        key: "draft",
        label: "创建草稿",
        icon: Edit3,
        description: "作业票创建与填写",
        completed: currentIndex >= 0,
        active: ticket.status === "draft",
        date: ticket.createdAt,
        operator: ticket.workLeader,
      },
      {
        key: "approved",
        label: "审核批准",
        icon: FileCheck,
        description: "主管审核并批准作业票",
        completed: currentIndex >= 1,
        active: ticket.status === "approved",
        date: ticket.approveTime,
        operator: ticket.approver,
      },
      {
        key: "in_progress",
        label: "现场作业",
        icon: Wrench,
        description: "工作班开展现场作业",
        completed: currentIndex >= 2,
        active: ticket.status === "in_progress",
        date: record?.startTime?.split(" ")[0],
        operator: ticket.workLeader,
      },
      {
        key: "completed",
        label: "完工验收",
        icon: CheckCircle,
        description: "作业完成验收销号",
        completed: currentIndex >= 3,
        active: ticket.status === "completed",
        date: record?.endTime?.split(" ")[0],
        operator: ticket.approver,
      },
    ];

    return steps;
  };

  const stats = useMemo(
    () => ({
      total: liveWorkingTickets.length,
      pending: liveWorkingTickets.filter(
        (t) => t.status === "draft" || t.status === "approved"
      ).length,
      inProgress: liveWorkingTickets.filter((t) => t.status === "in_progress")
        .length,
      completed: liveWorkingTickets.filter((t) => t.status === "completed")
        .length,
    }),
    []
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={`card p-4 cursor-pointer transition-all hover:shadow-card-hover ${statusFilter === "all" ? "ring-2 ring-primary-400" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">总作业票</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats.total}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-500" />
            </div>
          </div>
        </div>

        <div
          className={`card p-4 cursor-pointer transition-all hover:shadow-card-hover ${statusFilter === "pending" ? "ring-2 ring-warning-400" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">待执行</p>
              <p className="text-2xl font-bold text-warning-600">
                {stats.pending}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-500" />
            </div>
          </div>
        </div>

        <div
          className={`card p-4 cursor-pointer transition-all hover:shadow-card-hover ${statusFilter === "in_progress" ? "ring-2 ring-primary-400" : ""}`}
          onClick={() => setStatusFilter("in_progress")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">作业中</p>
              <p className="text-2xl font-bold text-primary-600">
                {stats.inProgress}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-500" />
            </div>
          </div>
        </div>

        <div
          className={`card p-4 cursor-pointer transition-all hover:shadow-card-hover ${statusFilter === "completed" ? "ring-2 ring-success-400" : ""}`}
          onClick={() => setStatusFilter("completed")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">已完成</p>
              <p className="text-2xl font-bold text-success-600">
                {stats.completed}
              </p>
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
              <option value="pending">待执行</option>
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
              {filteredTickets.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-8 text-neutral-400"
                  >
                    未找到匹配的作业票
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50 animate-fade-in">
          <div className="w-[600px] h-full bg-white shadow-xl animate-slide-in-left flex flex-col">
            <div className="h-14 flex items-center justify-between px-5 border-b border-neutral-200 flex-shrink-0">
              <h3 className="text-base font-semibold text-neutral-800">
                带电作业票详情
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-5">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-800">
                        {selectedTicket.workContent}
                      </h4>
                      <p className="text-sm text-neutral-500 mt-1 font-mono">
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

                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-primary-500" />
                    作业进度
                  </h5>
                  <div className="relative">
                    <div className="absolute top-5 left-6 right-6 h-0.5 bg-neutral-200 z-0" />
                    <div className="flex justify-between relative z-10">
                      {getProgressSteps(selectedTicket).map(
                        (step, index, arr) => {
                          const StepIcon = step.icon;
                          const isLast = index === arr.length - 1;
                          return (
                            <div
                              key={step.key}
                              className="flex flex-col items-center"
                              style={{
                                width: `${100 / arr.length}%`,
                                maxWidth: "120px",
                              }}
                            >
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                                  step.completed
                                    ? "bg-primary-500 text-white"
                                    : step.active
                                    ? "bg-primary-100 text-primary-600 ring-4 ring-primary-50"
                                    : "bg-neutral-200 text-neutral-400"
                                }`}
                              >
                                <StepIcon className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-medium text-neutral-700 mt-2 text-center">
                                {step.label}
                              </p>
                              {step.date && (
                                <p className="text-xs text-neutral-500 mt-0.5 text-center">
                                  {step.date}
                                </p>
                              )}
                              {step.operator && (
                                <p className="text-xs text-primary-600 mt-0.5 text-center">
                                  {step.operator}
                                </p>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-neutral-50">
                    <h5 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-primary-500" />
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
                    <h5 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-500" />
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
                      {getTicketWorkRecord(selectedTicket.id)?.startTime && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">实际开工</span>
                          <span className="text-neutral-700">
                            {
                              getTicketWorkRecord(selectedTicket.id)
                                ?.startTime
                            }
                          </span>
                        </div>
                      )}
                      {getTicketWorkRecord(selectedTicket.id)?.endTime && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">实际完工</span>
                          <span className="text-neutral-700">
                            {getTicketWorkRecord(selectedTicket.id)?.endTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50">
                    <h5 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary-500" />
                      工作班人员
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {getCrewMembers(selectedTicket).map((member, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white rounded-full text-sm text-neutral-600 border border-neutral-200"
                        >
                          {member}
                          {member === selectedTicket.workLeader && (
                            <span className="text-primary-500 ml-1 text-xs">
                              (负责人)
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50">
                    <h5 className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-500" />
                      工作内容
                    </h5>
                    <p className="text-sm text-neutral-600">
                      {selectedTicket.workContent}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50">
                    <h5 className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary-500" />
                      安全措施
                    </h5>
                    {selectedTicket.safetyMeasures &&
                    selectedTicket.safetyMeasures.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedTicket.safetyMeasures.map(
                          (measure, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-neutral-600"
                            >
                              <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              {measure}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-neutral-400">暂无安全措施</p>
                    )}
                  </div>

                  {getTicketWorkRecord(selectedTicket.id) && (
                    <div className="p-4 rounded-lg bg-primary-50/50">
                      <h5 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-primary-500" />
                        作业记录
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">作业时长</span>
                          <span className="text-neutral-700 font-medium">
                            {(() => {
                              const record = getTicketWorkRecord(
                                selectedTicket.id
                              );
                              if (!record?.startTime || !record?.endTime)
                                return "-";
                              const start = new Date(record.startTime);
                              const end = new Date(record.endTime);
                              const hours =
                                (end.getTime() - start.getTime()) / 3600000;
                              return `${hours.toFixed(1)} 小时`;
                            })()}
                          </span>
                        </div>
                        {getTicketWorkRecord(selectedTicket.id)?.weather && (
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500 flex items-center gap-1">
                              <Cloud className="w-3 h-3" />
                              天气
                            </span>
                            <span className="text-neutral-700">
                              {getTicketWorkRecord(selectedTicket.id)?.weather}
                            </span>
                          </div>
                        )}
                        {getTicketWorkRecord(selectedTicket.id)?.result && (
                          <div className="pt-2 mt-2 border-t border-primary-100">
                            <span className="text-neutral-500">作业结果</span>
                            <p className="text-neutral-700 mt-1">
                              {getTicketWorkRecord(selectedTicket.id)?.result}
                            </p>
                          </div>
                        )}
                        {getTicketWorkRecord(selectedTicket.id)?.remark && (
                          <div className="pt-2 border-t border-primary-100">
                            <span className="text-neutral-500">备注</span>
                            <p className="text-neutral-700 mt-1">
                              {getTicketWorkRecord(selectedTicket.id)?.remark}
                            </p>
                          </div>
                        )}
                        {getTicketWorkRecord(selectedTicket.id)?.tools &&
                          getTicketWorkRecord(selectedTicket.id)!.tools
                            .length > 0 && (
                            <div className="pt-2 border-t border-primary-100">
                              <span className="text-neutral-500">使用工器具</span>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {getTicketWorkRecord(selectedTicket.id)!.tools.map(
                                  (tool, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 bg-white text-xs text-neutral-600 rounded border border-neutral-200"
                                    >
                                      {tool}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      编辑作业票
                    </button>
                    <button className="btn btn-default w-full flex items-center justify-center gap-2">
                      <Printer className="w-4 h-4" />
                      打印作业票
                    </button>
                  </div>
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

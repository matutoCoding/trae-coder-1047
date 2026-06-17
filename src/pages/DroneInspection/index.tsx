import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  Plane,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  PlayCircle,
  Thermometer,
  Zap,
  Eye,
  ArrowRight,
  Image as ImageIcon,
  Activity,
} from "lucide-react";
import { droneMissions, infraredRecords, insulatorDetections } from "@/data/mock";
import type { DroneMission } from "@/data/types";

const statusMap = {
  pending: { label: "待执行", className: "default", icon: Clock },
  in_progress: { label: "进行中", className: "info", icon: PlayCircle },
  completed: { label: "已完成", className: "success", icon: CheckCircle },
  failed: { label: "执行失败", className: "danger", icon: Activity },
};

const typeMap = {
  routine: { label: "例行航巡", className: "info" },
  infrared: { label: "红外测温", className: "warning" },
  insulator: { label: "绝缘子检测", className: "success" },
  emergency: { label: "应急巡检", className: "danger" },
};

const DroneInspection = () => {
  const [activeTab, setActiveTab] = useState<
    "missions" | "infrared" | "insulator"
  >("missions");
  const [searchText, setSearchText] = useState("");
  const [selectedMission, setSelectedMission] = useState<DroneMission | null>(null);

  const filteredMissions = droneMissions.filter(
    (mission) =>
      mission.missionName.includes(searchText) ||
      mission.operator.includes(searchText)
  );

  const handleViewDetail = (mission: DroneMission) => {
    setSelectedMission(mission);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">总飞行架次</p>
              <p className="text-2xl font-bold text-primary-600">156</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <p className="text-xs text-success-600 mt-2">↑ 本周 +12 架次</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">累计飞行时长</p>
              <p className="text-2xl font-bold text-success-600">
                98.5<span className="text-sm font-normal">小时</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-success-500" />
            </div>
          </div>
          <p className="text-xs text-success-600 mt-2">↑ 本月 +18.5小时</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">红外测温点</p>
              <p className="text-2xl font-bold text-warning-600">842</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning-50 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-warning-500" />
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-2">异常点 23 处</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">绝缘子检测</p>
              <p className="text-2xl font-bold text-danger-600">
                2,340<span className="text-sm font-normal">片</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-danger-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-danger-500" />
            </div>
          </div>
          <p className="text-xs text-danger-600 mt-2">缺陷 18 片</p>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("missions")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "missions"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              飞行任务
            </button>
            <button
              onClick={() => setActiveTab("infrared")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "infrared"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              红外测温
            </button>
            <button
              onClick={() => setActiveTab("insulator")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "insulator"
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-800"
              }`}
            >
              绝缘子检测
            </button>
          </div>

          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索任务名称、操作员..."
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
              创建任务
            </button>
          </div>
        </div>
      </div>

      {activeTab === "missions" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMissions.map((mission) => {
            const statusInfo = statusMap[mission.status];
            const typeInfo = typeMap[mission.missionType];
            const StatusIcon = statusInfo?.icon || Clock;

            return (
              <div
                key={mission.id}
                className="card p-5 hover:shadow-card-hover transition-all cursor-pointer"
                onClick={() => handleViewDetail(mission)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-neutral-800 mb-1">
                        {mission.missionName}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className={`status-tag ${typeInfo?.className}`}>
                          {typeInfo?.label}
                        </span>
                        <span className={`status-tag ${statusInfo?.className}`}>
                          {statusInfo?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <StatusIcon
                    className={`w-5 h-5 ${
                      mission.status === "completed"
                        ? "text-success-500"
                        : mission.status === "in_progress"
                        ? "text-primary-500"
                        : "text-neutral-400"
                    }`}
                  />
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <User className="w-4 h-4" />
                    <span>操作员：{mission.operator}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Calendar className="w-4 h-4" />
                    <span>执行时间：{mission.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <MapPin className="w-4 h-4" />
                    <span>作业线路：{mission.lineName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{mission.flightDuration}分钟</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{mission.photoCount}张</span>
                    </div>
                  </div>
                  <button className="text-primary-500 hover:text-primary-600 text-sm flex items-center gap-1">
                    查看详情
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {mission.status === "in_progress" && (
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <button className="btn btn-default btn-sm">查看画面</button>
                    <button className="btn btn-primary btn-sm">
                      实时监控
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "infrared" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>检测编号</th>
                  <th>线路名称</th>
                  <th>杆塔号</th>
                  <th>设备部位</th>
                  <th>最高温度</th>
                  <th>最低温度</th>
                  <th>温差</th>
                  <th>检测结果</th>
                  <th>检测时间</th>
                </tr>
              </thead>
              <tbody>
                {infraredRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="font-medium text-neutral-700 font-mono">
                      {record.id}
                    </td>
                    <td className="text-neutral-600">{record.lineName}</td>
                    <td className="text-neutral-600">{record.towerNo}号塔</td>
                    <td className="text-neutral-600">{record.location}</td>
                    <td>
                      <span className="text-danger-600 font-medium">
                        {record.maxTemp}°C
                      </span>
                    </td>
                    <td className="text-neutral-500">{record.minTemp}°C</td>
                    <td>
                      {record.tempDiff > 10 ? (
                        <span className="text-danger-600 font-medium">
                          {record.tempDiff}°C
                        </span>
                      ) : (
                        <span className="text-neutral-600">
                          {record.tempDiff}°C
                        </span>
                      )}
                    </td>
                    <td>
                      {record.isAbnormal ? (
                        <span className="status-tag danger">异常</span>
                      ) : (
                        <span className="status-tag success">正常</span>
                      )}
                    </td>
                    <td className="text-neutral-500">{record.checkTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "insulator" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insulatorDetections.map((detection) => (
            <div
              key={detection.id}
              className="card p-4 hover:shadow-card-hover transition-all cursor-pointer"
            >
              <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                <ImageIcon className="w-12 h-12 text-neutral-300" />
                <div className="absolute inset-0 flex items-end justify-end p-3">
                  {detection.hasDefect ? (
                    <span className="status-tag danger">检测到缺陷</span>
                  ) : (
                    <span className="status-tag success">状态良好</span>
                  )}
                </div>
              </div>

              <h4 className="font-medium text-neutral-800 mb-2">
                {detection.lineName} - {detection.towerNo}号塔
              </h4>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">绝缘子类型</span>
                  <span className="text-neutral-700">
                    {detection.insulatorType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">检测数量</span>
                  <span className="text-neutral-700">{detection.totalCount}片</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">缺陷数量</span>
                  <span
                    className={
                      detection.defectCount > 0
                        ? "text-danger-600 font-medium"
                        : "text-neutral-700"
                    }
                  >
                    {detection.defectCount}片
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">检测时间</span>
                  <span className="text-neutral-500">{detection.checkTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMission && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50 animate-fade-in">
          <div className="w-[520px] h-full bg-white shadow-xl animate-slide-in-left">
            <div className="h-14 flex items-center justify-between px-5 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-800">
                任务详情
              </h3>
              <button
                onClick={() => setSelectedMission(null)}
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
                      {selectedMission.missionName}
                    </h4>
                  </div>
                  <span
                    className={`status-tag ${
                      statusMap[selectedMission.status]?.className
                    }`}
                  >
                    {statusMap[selectedMission.status]?.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`status-tag ${
                      typeMap[selectedMission.missionType]?.className
                    }`}
                  >
                    {typeMap[selectedMission.missionType]?.label}
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
                      <span className="text-neutral-500">任务编号</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedMission.id}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">作业线路</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedMission.lineName}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">操作员</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedMission.operator}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">计划日期</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedMission.scheduledDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">飞行时长</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedMission.flightDuration} 分钟
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">拍摄照片</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedMission.photoCount} 张
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-2">
                    任务描述
                  </h5>
                  <p className="text-sm text-neutral-600">
                    {selectedMission.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-primary w-full">查看航迹</button>
                  <button className="btn btn-default w-full">查看照片</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DroneInspection;

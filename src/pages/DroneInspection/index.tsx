import { useState, useMemo } from "react";
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
  ArrowRight,
  Image as ImageIcon,
  Activity,
  X,
  Video,
  Navigation,
  AlertTriangle,
  Layers,
} from "lucide-react";
import {
  droneMissions,
  infraredRecords,
  insulatorDetections,
} from "@/data/mock";
import type {
  DroneMission,
  InfraredRecord,
  InsulatorDetection,
} from "@/data/types";

const statusMap: Record<
  string,
  { label: string; className: string; icon: any; color: string }
> = {
  planned: {
    label: "待执行",
    className: "default",
    icon: Clock,
    color: "#8c8c8c",
  },
  flying: {
    label: "进行中",
    className: "info",
    icon: PlayCircle,
    color: "#1677ff",
  },
  completed: {
    label: "已完成",
    className: "success",
    icon: CheckCircle,
    color: "#52c41a",
  },
  cancelled: {
    label: "已取消",
    className: "danger",
    icon: Activity,
    color: "#ff4d4f",
  },
};

const statusOrder = ["planned", "flying", "completed"];

const getMissionType = (
  name: string
): { label: string; className: string } => {
  if (name.includes("红外"))
    return { label: "红外测温", className: "warning" };
  if (name.includes("绝缘子"))
    return { label: "绝缘子检测", className: "success" };
  if (name.includes("隐患") || name.includes("排查"))
    return { label: "隐患排查", className: "danger" };
  return { label: "例行航巡", className: "info" };
};

const DroneInspection = () => {
  const [activeTab, setActiveTab] = useState<
    "missions" | "infrared" | "insulator"
  >("missions");
  const [searchText, setSearchText] = useState("");
  const [selectedMission, setSelectedMission] = useState<DroneMission | null>(
    null
  );

  const getMissionInfrared = (missionId: string): InfraredRecord[] => {
    return infraredRecords.filter((r) => r.missionId === missionId);
  };

  const getMissionInsulator = (missionId: string): InsulatorDetection[] => {
    return insulatorDetections.filter((d) => d.missionId === missionId);
  };

  const filteredMissions = useMemo(() => {
    if (!searchText.trim()) return droneMissions;
    const keyword = searchText.toLowerCase();
    return droneMissions.filter((mission) => {
      const matchName = mission.missionName.toLowerCase().includes(keyword);
      const matchLine = mission.lineName.toLowerCase().includes(keyword);
      const matchPilot = mission.pilot.toLowerCase().includes(keyword);
      const matchStartTower = mission.startTower.includes(keyword);
      const matchEndTower = mission.endTower.includes(keyword);
      const matchId = mission.id.toLowerCase().includes(keyword);
      return (
        matchName ||
        matchLine ||
        matchPilot ||
        matchStartTower ||
        matchEndTower ||
        matchId
      );
    });
  }, [searchText]);

  const filteredInfrared = useMemo(() => {
    if (!searchText.trim()) return infraredRecords;
    const keyword = searchText.toLowerCase();
    return infraredRecords.filter((r) => {
      const mission = droneMissions.find((m) => m.id === r.missionId);
      const matchMissionName = mission?.missionName
        .toLowerCase()
        .includes(keyword);
      const matchLine = r.lineName.toLowerCase().includes(keyword);
      const matchTower = r.towerNo.includes(keyword);
      const matchEquipment = r.equipment.toLowerCase().includes(keyword);
      return matchMissionName || matchLine || matchTower || matchEquipment;
    });
  }, [searchText]);

  const filteredInsulator = useMemo(() => {
    if (!searchText.trim()) return insulatorDetections;
    const keyword = searchText.toLowerCase();
    return insulatorDetections.filter((d) => {
      const mission = droneMissions.find((m) => m.id === d.missionId);
      const matchMissionName = mission?.missionName
        .toLowerCase()
        .includes(keyword);
      const matchLine = d.lineName.toLowerCase().includes(keyword);
      const matchTower = d.towerNo.includes(keyword);
      const matchType = d.insulatorType.toLowerCase().includes(keyword);
      return matchMissionName || matchLine || matchTower || matchType;
    });
  }, [searchText]);

  const groupedMissions = useMemo(() => {
    const groups: Record<string, DroneMission[]> = {};
    statusOrder.forEach((s) => (groups[s] = []));
    filteredMissions.forEach((m) => {
      if (groups[m.status]) {
        groups[m.status].push(m);
      }
    });
    return groups;
  }, [filteredMissions]);

  const stats = {
    total: droneMissions.length,
    planned: droneMissions.filter((m) => m.status === "planned").length,
    flying: droneMissions.filter((m) => m.status === "flying").length,
    completed: droneMissions.filter((m) => m.status === "completed").length,
    infraredCount: infraredRecords.length,
    infraredAbnormal: infraredRecords.filter((r) => r.level !== "normal")
      .length,
    insulatorTotal: insulatorDetections.reduce((s, d) => s + d.totalCount, 0),
    insulatorDefect: insulatorDetections.reduce((s, d) => s + d.defectCount, 0),
  };

  const getHazardLevelClass = (level: string) => {
    switch (level) {
      case "dangerous":
      case "abnormal":
        return "danger";
      case "attention":
        return "warning";
      default:
        return "success";
    }
  };

  const getHazardLevelLabel = (level: string) => {
    switch (level) {
      case "dangerous":
        return "严重";
      case "abnormal":
        return "异常";
      case "attention":
        return "注意";
      default:
        return "正常";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">总飞行架次</p>
              <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Plane className="w-5 h-5 text-primary-500" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-neutral-500">
              进行中: <span className="text-primary-600 font-medium">{stats.flying}</span>
            </span>
            <span className="text-neutral-500">
              已完成: <span className="text-success-600 font-medium">{stats.completed}</span>
            </span>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">累计飞行时长</p>
              <p className="text-2xl font-bold text-success-600">
                {Math.round(
                  droneMissions.reduce((s, m) => s + m.flightDuration, 0) / 60
                ).toFixed(1)}
                <span className="text-sm font-normal">小时</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-success-500" />
            </div>
          </div>
          <p className="text-xs text-success-600 mt-2">
            总里程: {droneMissions.reduce((s, m) => s + m.distance, 0).toFixed(1)}{" "}
            km
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">红外测温点</p>
              <p className="text-2xl font-bold text-warning-600">
                {stats.infraredCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning-50 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-warning-500" />
            </div>
          </div>
          <p className="text-xs text-warning-600 mt-2">
            异常点 {stats.infraredAbnormal} 处
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 mb-1">绝缘子检测</p>
              <p className="text-2xl font-bold text-danger-600">
                {stats.insulatorTotal}
                <span className="text-sm font-normal">片</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-danger-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-danger-500" />
            </div>
          </div>
          <p className="text-xs text-danger-600 mt-2">
            缺陷 {stats.insulatorDefect} 片
          </p>
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
              飞行任务看板
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
                placeholder={
                  activeTab === "missions"
                    ? "搜索任务名称、线路、杆塔、操作员..."
                    : "搜索任务名称、线路、杆塔、设备..."
                }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {statusOrder.map((statusKey) => {
            const statusInfo = statusMap[statusKey];
            const StatusIcon = statusInfo.icon;
            const missions = groupedMissions[statusKey] || [];

            return (
              <div key={statusKey} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusInfo.color }}
                    />
                    <h3 className="text-sm font-semibold text-neutral-700">
                      {statusInfo.label}
                    </h3>
                    <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {missions.length}
                    </span>
                  </div>
                  <StatusIcon
                    className="w-4 h-4"
                    style={{ color: statusInfo.color }}
                  />
                </div>

                <div className="space-y-3">
                  {missions.map((mission) => {
                    const typeInfo = getMissionType(mission.missionName);
                    const missionInfrared = getMissionInfrared(mission.id);
                    const missionInsulator = getMissionInsulator(mission.id);

                    return (
                      <div
                        key={mission.id}
                        className="card p-4 hover:shadow-card-hover transition-all cursor-pointer"
                        onClick={() => setSelectedMission(mission)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: statusInfo.color }}
                              />
                              <h4 className="text-sm font-semibold text-neutral-800 truncate">
                                {mission.missionName}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <span
                                className={`status-tag ${typeInfo.className} text-xs`}
                              >
                                {typeInfo.label}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-neutral-400 font-mono flex-shrink-0 ml-2">
                            {mission.id}
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs mb-3 ml-4">
                          <div className="flex items-center gap-2 text-neutral-500">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{mission.lineName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-500">
                            <Navigation className="w-3 h-3 flex-shrink-0" />
                            <span>
                              {mission.startTower}# ~ {mission.endTower}#
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-500">
                            <User className="w-3 h-3 flex-shrink-0" />
                            <span>{mission.pilot}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-500">
                            <Calendar className="w-3 h-3 flex-shrink-0" />
                            <span>{mission.flightDate}</span>
                          </div>
                        </div>

                        {mission.status !== "planned" && (
                          <div className="grid grid-cols-3 gap-2 ml-4 pt-2 border-t border-neutral-100">
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-neutral-500">
                                <ImageIcon className="w-3 h-3" />
                                <span className="text-xs">
                                  {mission.photoCount}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400">照片</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-neutral-500">
                                <Video className="w-3 h-3" />
                                <span className="text-xs">
                                  {mission.videoCount}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400">视频</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1 text-neutral-500">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">
                                  {mission.flightDuration}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400">分钟</p>
                            </div>
                          </div>
                        )}

                        {(missionInfrared.length > 0 ||
                          missionInsulator.length > 0) && (
                          <div className="flex items-center gap-3 ml-4 mt-2 pt-2 border-t border-neutral-100">
                            {missionInfrared.length > 0 && (
                              <div className="flex items-center gap-1 text-xs">
                                <Thermometer className="w-3 h-3 text-warning-500" />
                                <span className="text-neutral-600">
                                  红外 {missionInfrared.length}
                                </span>
                                {missionInfrared.some(
                                  (r) => r.level !== "normal"
                                ) && (
                                  <span className="text-danger-500 font-medium">
                                    !
                                  </span>
                                )}
                              </div>
                            )}
                            {missionInsulator.length > 0 && (
                              <div className="flex items-center gap-1 text-xs">
                                <Zap className="w-3 h-3 text-danger-500" />
                                <span className="text-neutral-600">
                                  绝缘子 {missionInsulator.length}
                                </span>
                                {missionInsulator.some(
                                  (d) => d.defectCount > 0
                                ) && (
                                  <span className="text-danger-500 font-medium">
                                    !
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {mission.status === "flying" && (
                          <div className="flex items-center justify-end gap-2 mt-3">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="btn btn-default btn-sm"
                            >
                              查看画面
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="btn btn-primary btn-sm"
                            >
                              实时监控
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {missions.length === 0 && (
                    <div className="card p-8 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-50 flex items-center justify-center">
                        <Plane className="w-6 h-6 text-neutral-300" />
                      </div>
                      <p className="text-sm text-neutral-400">暂无任务</p>
                    </div>
                  )}
                </div>
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
                  <th>关联任务</th>
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
                {filteredInfrared.map((record) => {
                  const mission = droneMissions.find(
                    (m) => m.id === record.missionId
                  );
                  return (
                    <tr
                      key={record.id}
                      className="cursor-pointer hover:bg-primary-50/30 transition-colors"
                      onClick={() => mission && setSelectedMission(mission)}
                    >
                      <td className="font-medium text-neutral-700 font-mono">
                        {record.id}
                      </td>
                      <td className="text-primary-600 text-xs">
                        {mission?.missionName || "-"}
                      </td>
                      <td className="text-neutral-600">{record.lineName}</td>
                      <td className="text-neutral-600">{record.towerNo}号塔</td>
                      <td className="text-neutral-600">{record.equipment}</td>
                      <td>
                        <span className="text-danger-600 font-medium">
                          {record.maxTemperature}°C
                        </span>
                      </td>
                      <td className="text-neutral-500">
                        {record.minTemperature}°C
                      </td>
                      <td>
                        {record.temperatureDifference > 10 ? (
                          <span className="text-danger-600 font-medium">
                            {record.temperatureDifference}°C
                          </span>
                        ) : (
                          <span className="text-neutral-600">
                            {record.temperatureDifference}°C
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`status-tag ${getHazardLevelClass(
                            record.level
                          )}`}
                        >
                          {getHazardLevelLabel(record.level)}
                        </span>
                      </td>
                      <td className="text-neutral-500">
                        {record.detectionTime}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredInfrared.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-neutral-400">未找到匹配的检测记录</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "insulator" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInsulator.map((detection) => {
            const mission = droneMissions.find(
              (m) => m.id === detection.missionId
            );
            return (
              <div
                key={detection.id}
                className="card p-4 hover:shadow-card-hover transition-all cursor-pointer"
                onClick={() => mission && setSelectedMission(mission)}
              >
                {mission && (
                  <div className="text-xs text-primary-600 mb-2 pb-2 border-b border-neutral-100 truncate">
                    关联：{mission.missionName}
                  </div>
                )}

                <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  <Layers className="w-12 h-12 text-neutral-300" />
                  <div className="absolute inset-0 flex items-end justify-end p-3">
                    {detection.defectCount > 0 ? (
                      <span className="status-tag danger">
                        {detection.defectCount}片缺陷
                      </span>
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
                    <span className="text-neutral-700">
                      {detection.totalCount}片
                    </span>
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
                  {detection.defectTypes &&
                    detection.defectTypes.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-neutral-100">
                        <span className="text-neutral-500 text-xs">
                          缺陷类型:{" "}
                        </span>
                        <span className="text-danger-600 text-xs">
                          {detection.defectTypes.join("、")}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between pt-1">
                    <span className="text-neutral-500">检测时间</span>
                    <span className="text-neutral-500">
                      {detection.detectionTime}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredInsulator.length === 0 && (
            <div className="card p-8 text-center col-span-full">
              <p className="text-sm text-neutral-400">未找到匹配的检测记录</p>
            </div>
          )}
        </div>
      )}

      {selectedMission && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50 animate-fade-in">
          <div className="w-[600px] h-full bg-white shadow-xl animate-slide-in-left flex flex-col">
            <div className="h-14 flex items-center justify-between px-5 border-b border-neutral-200 flex-shrink-0">
              <h3 className="text-base font-semibold text-neutral-800">
                任务详情
              </h3>
              <button
                onClick={() => setSelectedMission(null)}
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
                        {selectedMission.missionName}
                      </h4>
                      <p className="text-xs text-neutral-400 font-mono mt-1">
                        {selectedMission.id}
                      </p>
                    </div>
                    <span
                      className={`status-tag ${
                        statusMap[selectedMission.status]?.className ||
                        "default"
                      }`}
                    >
                      {statusMap[selectedMission.status]?.label || "待执行"}
                    </span>
                  </div>
                  <span
                    className={`status-tag ${
                      getMissionType(selectedMission.missionName).className
                    }`}
                  >
                    {getMissionType(selectedMission.missionName).label}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary-50 to-sky-50">
                    <h5 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-primary-500" />
                      航线范围
                    </h5>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
                          起
                        </div>
                        <p className="text-sm font-medium text-neutral-800">
                          {selectedMission.startTower}号塔
                        </p>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-0.5 bg-gradient-to-r from-primary-400 to-sky-400 rounded-full relative">
                          <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary-500" />
                        </div>
                        <p className="text-center text-xs text-neutral-500 mt-1.5">
                          里程 {selectedMission.distance} km
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-success-500 text-white flex items-center justify-center text-xs font-bold">
                          终
                        </div>
                        <p className="text-sm font-medium text-neutral-800">
                          {selectedMission.endTower}号塔
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-neutral-50 text-center">
                      <ImageIcon className="w-5 h-5 mx-auto mb-1 text-primary-500" />
                      <p className="text-lg font-bold text-neutral-800">
                        {selectedMission.photoCount}
                      </p>
                      <p className="text-xs text-neutral-500">照片(张)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-50 text-center">
                      <Video className="w-5 h-5 mx-auto mb-1 text-violet-500" />
                      <p className="text-lg font-bold text-neutral-800">
                        {selectedMission.videoCount}
                      </p>
                      <p className="text-xs text-neutral-500">视频(段)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-50 text-center">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-success-500" />
                      <p className="text-lg font-bold text-neutral-800">
                        {selectedMission.flightDuration}
                      </p>
                      <p className="text-xs text-neutral-500">时长(分)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-neutral-50 text-center">
                      <Thermometer className="w-5 h-5 mx-auto mb-1 text-warning-500" />
                      <p className="text-lg font-bold text-neutral-800">
                        {getMissionInfrared(selectedMission.id).length}
                      </p>
                      <p className="text-xs text-neutral-500">测温(点)</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50">
                    <h5 className="text-sm font-medium text-neutral-700 mb-3">
                      基本信息
                    </h5>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-neutral-500">作业线路</span>
                        <p className="text-neutral-700 mt-0.5">
                          {selectedMission.lineName}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-500">操作员</span>
                        <p className="text-neutral-700 mt-0.5">
                          {selectedMission.pilot}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-500">飞行日期</span>
                        <p className="text-neutral-700 mt-0.5">
                          {selectedMission.flightDate}
                        </p>
                      </div>
                      <div>
                        <span className="text-neutral-500">飞行距离</span>
                        <p className="text-neutral-700 mt-0.5">
                          {selectedMission.distance} km
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedMission.weather && (
                    <div className="p-4 rounded-lg bg-neutral-50">
                      <h5 className="text-sm font-medium text-neutral-700 mb-3">
                        气象条件
                      </h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-neutral-500">天气</span>
                          <p className="text-neutral-700 mt-0.5">
                            {selectedMission.weather}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-500">风速</span>
                          <p className="text-neutral-700 mt-0.5">
                            {selectedMission.windSpeed} m/s
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {getMissionInfrared(selectedMission.id).length > 0 && (
                    <div className="p-4 rounded-lg bg-warning-50/50">
                      <h5 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-warning-500" />
                        关联红外测温记录 (
                        {getMissionInfrared(selectedMission.id).length})
                      </h5>
                      <div className="space-y-2">
                        {getMissionInfrared(selectedMission.id).map(
                          (record) => (
                            <div
                              key={record.id}
                              className="p-3 rounded-lg bg-white border border-warning-100 flex items-center justify-between"
                            >
                              <div>
                                <p className="text-sm font-medium text-neutral-800">
                                  {record.towerNo}号塔 - {record.equipment}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {record.detectionTime}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-sm font-medium ${
                                    record.level !== "normal"
                                      ? "text-danger-600"
                                      : "text-success-600"
                                  }`}
                                >
                                  {record.maxTemperature}°C / 温差{" "}
                                  {record.temperatureDifference}°C
                                </p>
                                <span
                                  className={`status-tag ${getHazardLevelClass(
                                    record.level
                                  )} text-xs`}
                                >
                                  {getHazardLevelLabel(record.level)}
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {getMissionInsulator(selectedMission.id).length > 0 && (
                    <div className="p-4 rounded-lg bg-danger-50/50">
                      <h5 className="text-sm font-medium text-neutral-700 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-danger-500" />
                        关联绝缘子检测记录 (
                        {getMissionInsulator(selectedMission.id).length})
                      </h5>
                      <div className="space-y-2">
                        {getMissionInsulator(selectedMission.id).map(
                          (detection) => (
                            <div
                              key={detection.id}
                              className="p-3 rounded-lg bg-white border border-danger-100 flex items-center justify-between"
                            >
                              <div>
                                <p className="text-sm font-medium text-neutral-800">
                                  {detection.towerNo}号塔 -{" "}
                                  {detection.insulatorType}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {detection.detectionTime}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-neutral-700">
                                  共{" "}
                                  <span className="font-medium">
                                    {detection.totalCount}
                                  </span>{" "}
                                  片
                                  {detection.defectCount > 0 && (
                                    <span className="text-danger-600 ml-2">
                                      缺陷{" "}
                                      <span className="font-medium">
                                        {detection.defectCount}
                                      </span>{" "}
                                      片
                                    </span>
                                  )}
                                </p>
                                {detection.defectTypes &&
                                  detection.defectTypes.length > 0 && (
                                    <p className="text-xs text-danger-600 mt-0.5">
                                      {detection.defectTypes.join("、")}
                                    </p>
                                  )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button className="btn btn-primary w-full">查看航迹</button>
                    <button className="btn btn-default w-full">查看照片</button>
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

export default DroneInspection;

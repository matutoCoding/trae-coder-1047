import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  MapPin,
  Ruler,
  Calendar,
  Layers,
} from "lucide-react";
import { towers, transmissionLines } from "@/data/mock";
import type { Tower } from "@/data/types";

const statusMap = {
  normal: { label: "正常", className: "success" },
  abnormal: { label: "异常", className: "danger" },
  maintenance: { label: "检修中", className: "warning" },
};

const Towers = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedLineId, setSelectedLineId] = useState<string>("all");
  const [showLineFilter, setShowLineFilter] = useState(false);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);

  const filteredTowers = towers.filter((tower) => {
    const matchSearch =
      tower.towerNo.includes(searchText) ||
      tower.towerType.includes(searchText) ||
      tower.lineName.includes(searchText);
    const matchLine =
      selectedLineId === "all" || tower.lineId === selectedLineId;
    return matchSearch && matchLine;
  });

  const handleViewDetail = (tower: Tower) => {
    setSelectedTower(tower);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <div className="w-60 flex-shrink-0">
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              线路列表
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedLineId("all")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedLineId === "all"
                    ? "bg-primary-50 text-primary-600 font-medium"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                全部线路
                <span className="float-right text-neutral-400">
                  {towers.length}
                </span>
              </button>
              {transmissionLines.map((line) => {
                const towerCount = towers.filter(
                  (t) => t.lineId === line.id
                ).length;
                return (
                  <button
                    key={line.id}
                    onClick={() => setSelectedLineId(line.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedLineId === line.id
                        ? "bg-primary-50 text-primary-600 font-medium"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <span className="truncate block">{line.lineName}</span>
                    <span className="float-right text-neutral-400 text-xs mt-0.5">
                      {towerCount}基
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px] max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="搜索杆塔号、类型..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLineFilter(!showLineFilter)}
                  className="btn btn-default flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  筛选
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button className="btn btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  新增杆塔
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTowers.map((tower) => (
              <div
                key={tower.id}
                className="card p-4 hover:shadow-card-hover transition-all cursor-pointer"
                onClick={() => handleViewDetail(tower)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-neutral-800">
                        {tower.towerNo}号塔
                      </h4>
                      <p className="text-xs text-neutral-500">
                        {tower.lineName}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`status-tag ${
                      statusMap[tower.status]?.className || "default"
                    }`}
                  >
                    {statusMap[tower.status]?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Ruler className="w-4 h-4" />
                    <span>{tower.height} m</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <MapPin className="w-4 h-4" />
                    <span>{tower.towerType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Calendar className="w-4 h-4" />
                    <span>{tower.erectionDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Layers className="w-4 h-4" />
                    <span>{tower.material}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-neutral-100">
                  <button
                    className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-primary-500 transition-colors"
                    title="查看详情"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-primary-500 transition-colors"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-danger-500 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
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
      </div>

      {selectedTower && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50 animate-fade-in">
          <div className="w-96 h-full bg-white shadow-xl animate-slide-in-left">
            <div className="h-14 flex items-center justify-between px-5 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-800">
                杆塔详情
              </h3>
              <button
                onClick={() => setSelectedTower(null)}
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <Layers className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-neutral-800">
                      {selectedTower.towerNo}号塔
                    </h4>
                    <p className="text-sm text-neutral-500">
                      {selectedTower.lineName}
                    </p>
                  </div>
                </div>

                <span
                  className={`status-tag ${
                    statusMap[selectedTower.status]?.className || "default"
                  }`}
                >
                  {statusMap[selectedTower.status]?.label}
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-3">
                    基本参数
                  </h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-neutral-500">杆塔类型</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTower.towerType}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">杆塔高度</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTower.height} m
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">材质</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTower.material}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">塔重</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTower.towerWeight} t
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">档距</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTower.span} m
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">海拔</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedTower.elevation} m
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-3">
                    位置信息
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">经度</span>
                      <span className="text-neutral-700 font-mono">
                        {selectedTower.longitude.toFixed(4)}°
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">纬度</span>
                      <span className="text-neutral-700 font-mono">
                        {selectedTower.latitude.toFixed(4)}°
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">基础型式</span>
                      <span className="text-neutral-700">
                        {selectedTower.foundationType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-3">
                    建设信息
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">组立日期</span>
                      <span className="text-neutral-700">
                        {selectedTower.erectionDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-primary w-full">编辑杆塔</button>
                  <button className="btn btn-default w-full">查看缺陷</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Towers;

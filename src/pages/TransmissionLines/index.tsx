import { useState } from "react";
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2, ChevronDown } from "lucide-react";
import { transmissionLines } from "@/data/mock";
import type { TransmissionLine } from "@/data/types";

const statusMap = {
  running: { label: "运行中", className: "success" },
  maintenance: { label: "检修中", className: "warning" },
  outage: { label: "停运", className: "danger" },
};

const TransmissionLines = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedLine, setSelectedLine] = useState<TransmissionLine | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredLines = transmissionLines.filter(
    (line) =>
      line.lineName.includes(searchText) ||
      line.lineCode.includes(searchText) ||
      line.voltageLevel.includes(searchText)
  );

  const handleViewDetail = (line: TransmissionLine) => {
    setSelectedLine(line);
    setShowDetail(true);
  };

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="搜索线路名称、编号、电压等级..."
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
              新增线路
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>线路名称</th>
                <th>线路编号</th>
                <th>电压等级</th>
                <th>线路长度</th>
                <th>杆塔数量</th>
                <th>投运日期</th>
                <th>运行状态</th>
                <th>所属区域</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredLines.map((line) => (
                <tr key={line.id}>
                  <td>
                    <span className="font-medium text-neutral-700">
                      {line.lineName}
                    </span>
                  </td>
                  <td className="text-neutral-500">{line.lineCode}</td>
                  <td>
                    <span className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-600 rounded">
                      {line.voltageLevel}
                    </span>
                  </td>
                  <td className="text-neutral-600">{line.totalLength} km</td>
                  <td className="text-neutral-600">{line.towerCount} 基</td>
                  <td className="text-neutral-500">{line.operationDate}</td>
                  <td>
                    <span
                      className={`status-tag ${
                        statusMap[line.status]?.className || "default"
                      }`}
                    >
                      {statusMap[line.status]?.label || line.status}
                    </span>
                  </td>
                  <td className="text-neutral-500">{line.region}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewDetail(line)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100">
          <span className="text-sm text-neutral-500">
            共 {filteredLines.length} 条记录
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

      {showDetail && selectedLine && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50 animate-fade-in">
          <div className="w-96 h-full bg-white shadow-xl animate-slide-in-left">
            <div className="h-14 flex items-center justify-between px-5 border-b border-neutral-200">
              <h3 className="text-base font-semibold text-neutral-800">
                线路详情
              </h3>
              <button
                onClick={() => setShowDetail(false)}
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
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-800">
                      {selectedLine.lineName}
                    </h4>
                    <p className="text-sm text-neutral-500">
                      {selectedLine.lineCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`status-tag ${
                      statusMap[selectedLine.status]?.className || "default"
                    }`}
                  >
                    {statusMap[selectedLine.status]?.label}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium bg-primary-50 text-primary-600 rounded">
                    {selectedLine.voltageLevel}
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
                      <span className="text-neutral-500">线路类型</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedLine.lineType}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">总长度</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedLine.totalLength} km
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">杆塔数量</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedLine.towerCount} 基
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">投运日期</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedLine.operationDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-neutral-500">所属区域</span>
                      <p className="text-neutral-700 mt-0.5">
                        {selectedLine.region}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-50">
                  <h5 className="text-sm font-medium text-neutral-700 mb-3">
                    建设信息
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">设计单位</span>
                      <span className="text-neutral-700">
                        {selectedLine.designCompany}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">施工单位</span>
                      <span className="text-neutral-700">
                        {selectedLine.constructionCompany}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-primary w-full">编辑线路</button>
                  <button className="btn btn-default w-full">查看杆塔</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransmissionLines;

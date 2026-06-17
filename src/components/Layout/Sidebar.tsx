import { NavLink, useLocation } from "react-router-dom";
import { menuConfig } from "@/router/config";
import useAppStore from "@/store/useAppStore";
import { Zap } from "lucide-react";

const Sidebar = () => {
  const { sidebarCollapsed } = useAppStore();
  const location = useLocation();

  return (
    <aside
      className={`h-full bg-white shadow-nav flex flex-col transition-width duration-300 ${
        sidebarCollapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="h-16 flex items-center justify-center border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold text-neutral-800">
                输电线路巡检
              </span>
              <span className="text-xs text-neutral-500">运维管理系统</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="space-y-1">
          {menuConfig.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.key}>
                <NavLink
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-50 text-primary-600 font-medium"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? "text-primary-500" : ""
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="text-sm whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {!sidebarCollapsed && (
        <div className="p-4 border-t border-neutral-200">
          <div className="p-3 rounded-lg bg-gradient-to-r from-primary-50 to-blue-50">
            <p className="text-xs text-neutral-600 mb-2">系统版本</p>
            <p className="text-sm font-medium text-primary-600">v2.1.0</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

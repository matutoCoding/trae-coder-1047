import { useLocation } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import useAppStore from "@/store/useAppStore";
import { menuConfig } from "@/router/config";
import { useState } from "react";

const Header = () => {
  const { toggleSidebar, currentUser, notifications } = useAppStore();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentPage = menuConfig.find(
    (item) => item.path === location.pathname
  );

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 sticky top-0 z-10">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-neutral-100 transition-colors mr-2"
      >
        <Menu className="w-5 h-5 text-neutral-600" />
      </button>

      <div className="flex-1 flex items-center">
        <h1 className="text-lg font-semibold text-neutral-800">
          {currentPage?.label || "工作台"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="w-4 h-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="搜索线路、杆塔、缺陷..."
            className="w-64 h-9 pl-10 pr-4 rounded-lg bg-neutral-50 border border-neutral-200 text-sm focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <Bell className="w-5 h-5 text-neutral-600" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
              {currentUser.avatar}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-neutral-700">
                {currentUser.name}
              </p>
              <p className="text-xs text-neutral-500">{currentUser.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20 animate-fade-in">
              <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                <User className="w-4 h-4" />
                个人中心
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                系统设置
              </button>
              <div className="my-1 border-t border-neutral-100" />
              <button className="w-full px-4 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

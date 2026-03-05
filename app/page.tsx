import Image from "next/image";
import Header from "@/components/Header";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import CenterPanel from "@/components/CenterPanel";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-full bg-[#f0f0f0] overflow-hidden p-2 gap-2 select-none">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 gap-2 overflow-hidden">
        {/* Left Panel */}
        <div className="flex flex-col w-[320px] gap-2 h-full flex-shrink-0">
          <LeftPanel />
        </div>

        {/* Center Panel (3D Area) */}
        <div className="flex-1 flex flex-col h-full tech-border bg-[#ececec] relative">
          <CenterPanel />
        </div>

        {/* Right Panel */}
        <div className="flex flex-col w-[320px] gap-2 h-full flex-shrink-0">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

import { CheckCircle, User, XCircle } from "lucide-react";
import React from "react";
import { Badge } from "../../../common/ui/badge";

interface OverlayCardProps {
  imageUrl?: string;
  altText: string;
  title: string;
  subtitle: string;
  badgeText: string;
  isActive: boolean;
  height?: string;
  className?: string;
}

const OverlayCard: React.FC<OverlayCardProps> = ({
  imageUrl,
  altText,
  title,
  subtitle,
  badgeText,
  isActive,
  height = "h-[280px]",
  className = "",
}) => (
  <div className={`relative group mx-auto ${className}`}>
    {/* Main Card Container */}
    <div className={`w-full ${height} overflow-hidden transition-all duration-300 rounded-xl shadow-lg`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={altText}
          className="h-full w-full scale-105 group-hover:scale-100 object-cover transition-all duration-300"
        />
      ) : (
        <div className="h-full w-full scale-105 group-hover:scale-100 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center transition-all duration-300">
          <User className="w-20 h-20 text-gray-400" />
        </div>
      )}
    </div>

    {/* Status Badge */}
    <div className="absolute -bottom-2 -right-2 z-10">
      <div
        className={`w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg transition-all duration-300 ${
          isActive ? "bg-cyan-500" : "bg-gray-400"
        }`}
      >
        {isActive ? (
          <CheckCircle className="w-4 h-4 text-white" />
        ) : (
          <XCircle className="w-4 h-4 text-white" />
        )}
      </div>
    </div>

    {/* Info Overlay */}
    <div className="absolute bottom-0 left-0 right-0 h-20 group-hover:h-28 transition-all duration-500 ease-out bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 rounded-b-xl">
      <div className="info translate-y-0 transition-all duration-500 ease-out">
        <p className="text-white font-semibold text-lg truncate transform transition-all duration-300 group-hover:scale-105">
          {title}
        </p>
        <p className="text-white/80 text-sm transition-all duration-300 group-hover:text-white/90">
          {subtitle}
        </p>
      </div>

      {/* Hidden Details on Hover */}
      <div className="absolute -bottom-10 left-0 right-0 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bottom-3 transition-all duration-500 ease-out delay-100">
        <div className="text-white text-center">
          <Badge
            variant="secondary"
            className="text-xs bg-white/25 text-white border-white/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/35 transform hover:scale-105"
          >
            {badgeText}
          </Badge>
        </div>
      </div>
    </div>
  </div>
);

export default OverlayCard;
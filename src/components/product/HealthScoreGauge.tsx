"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface HealthScoreGaugeProps {
  score: number;
  remarks: string[];
}

export default function HealthScoreGauge({ score, remarks }: HealthScoreGaugeProps) {
  const circumference = 2 * Math.PI * 45; // 2 * pi * r
  const offset = circumference - (score / 10) * circumference;

  const getColor = () => {
    if (score >= 8) return "text-emerald-500";
    if (score >= 5) return "text-yellow-500";
    return "text-red-500";
  };

  const getBgColor = () => {
    if (score >= 8) return "stroke-emerald-500";
    if (score >= 5) return "stroke-yellow-500";
    return "stroke-red-500";
  };

  return (
    <div>
        <div className="relative w-32 h-32 mx-auto sm:mx-0">
        <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
            className="text-muted"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            />
            {/* Progress circle */}
            <circle
            className={cn("transition-all duration-1000 ease-out", getBgColor())}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            transform="rotate(-90 50 50)"
            />
            {/* Text */}
            <text
            x="50"
            y="50"
            fontFamily="sans-serif"
            fontSize="24"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="central"
            className={cn("fill-current", getColor())}
            >
            {score}
            <tspan fontSize="12">/10</tspan>
            </text>
        </svg>
        </div>
         <div className="mt-2 text-center sm:text-left">
            <h3 className="text-lg font-semibold">Health Score</h3>
            <div className="flex flex-wrap gap-1 mt-1 justify-center sm:justify-start">
                {remarks.slice(0, 3).map((remark, index) => (
                    <Badge key={index} variant="secondary">{remark}</Badge>
                ))}
            </div>
        </div>
    </div>
  );
}

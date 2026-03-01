"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

type Season = "spring" | "summer" | "autumn" | "winter";

const SeasonalEffect: React.FC = () => {
  const currentSeason: Season = useMemo(() => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 1 && month <= 3) return "spring";
    if (month >= 4 && month <= 6) return "summer";
    if (month >= 7 && month <= 9) return "autumn";
    return "winter";
  }, []);

  const particleCount = currentSeason === "summer" ? 20 : 50;

  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 5,
        size:
          currentSeason === "summer"
            ? 20 + Math.random() * 40
            : 8 + Math.random() * 12,
      })),
    [currentSeason, particleCount]
  );

  if (currentSeason === "spring") {
    // Hoa đào rơi (màu hồng)
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              left: `${particle.left}%`,
              top: "-10%",
              opacity: 0.8,
              rotate: 0,
            }}
            animate={{
              top: "110%",
              opacity: [0.8, 1, 0],
              rotate: 360,
              x: [0, 30, -30, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div
              className="bg-pink-400 rounded-full shadow-lg"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background:
                  "radial-gradient(circle, rgba(255,182,193,0.9) 0%, rgba(255,105,180,0.7) 100%)",
                boxShadow: "0 0 10px rgba(255,105,180,0.5)",
              }}
            >
              {/* Hình dạng cánh hoa */}
              <div className="relative w-full h-full">
                {[0, 72, 144, 216, 288].map((angle) => (
                  <div
                    key={angle}
                    className="absolute w-1/2 h-1/2 bg-pink-300 rounded-full opacity-70"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-30%)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (currentSeason === "summer") {
    // Ánh nắng lấp lánh
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              left: `${particle.left}%`,
              top: `${Math.random() * 80}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className="relative"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
            >
              {/* Tia sáng */}
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-yellow-300 rounded-full blur-sm"
                  style={{
                    boxShadow: "0 0 20px rgba(255,223,0,0.8)",
                  }}
                />
                {/* 4 tia sáng nhọn */}
                {[0, 90].map((angle) => (
                  <div
                    key={angle}
                    className="absolute left-1/2 top-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-200 to-transparent"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    }}
                  />
                ))}
                {[45, 135].map((angle) => (
                  <div
                    key={angle}
                    className="absolute left-1/2 top-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-200 to-transparent opacity-70"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (currentSeason === "autumn") {
    // Lá phong rơi (màu cam/đỏ)
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              left: `${particle.left}%`,
              top: "-10%",
              opacity: 0.9,
              rotate: 0,
            }}
            animate={{
              top: "110%",
              opacity: [0.9, 1, 0.5, 0],
              rotate: [0, 180, 360, 540],
              x: [0, 50, -30, 20, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg
              width={particle.size}
              height={particle.size}
              viewBox="0 0 24 24"
              fill="none"
            >
              {/* Lá phong */}
              <path
                d="M12 2L10 8L4 6L9 12L2 14L9 16L6 22L12 18L18 22L15 16L22 14L15 12L20 6L14 8L12 2Z"
                fill={
                  particle.id % 3 === 0
                    ? "#FF4500"
                    : particle.id % 3 === 1
                    ? "#FF6347"
                    : "#FFA500"
                }
                opacity="0.9"
              />
              {/* Gân lá */}
              <path
                d="M12 2L12 18M12 12L9 16M12 12L15 16M12 8L6 6M12 8L18 6"
                stroke="#8B4513"
                strokeWidth="0.5"
                opacity="0.6"
              />
            </svg>
          </motion.div>
        ))}
      </div>
    );
  }

  // Winter - Tuyết rơi
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            left: `${particle.left}%`,
            top: "-10%",
            opacity: 0.8,
            rotate: 0,
          }}
          animate={{
            top: "110%",
            opacity: [0.8, 1, 0.6, 0],
            rotate: 360,
            x: [0, 20, -20, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg
            width={particle.size}
            height={particle.size}
            viewBox="0 0 24 24"
            fill="none"
          >
            {/* Bông tuyết 6 cánh */}
            <g stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round">
              {/* 6 tia chính */}
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <g
                  key={angle}
                  transform={`rotate(${angle} 12 12)`}
                  opacity="0.9"
                >
                  <line x1="12" y1="12" x2="12" y2="4" />
                  <line x1="12" y1="6" x2="10" y2="8" />
                  <line x1="12" y1="6" x2="14" y2="8" />
                </g>
              ))}
              {/* Vòng tròn giữa */}
              <circle cx="12" cy="12" r="2" fill="#FFFFFF" opacity="0.8" />
            </g>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default SeasonalEffect;

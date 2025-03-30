
import React, { useEffect, useState } from "react";
import { Cloud, CloudSun, CloudMoon, CloudRain, Sun, Moon } from "lucide-react";

type TimeOfDay = "morning" | "day" | "evening" | "night";
type Weather = "clear" | "cloudy" | "rainy";

const GhibliBackground: React.FC = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [weather, setWeather] = useState<Weather>("clear");
  
  // Update time of day based on current hour
  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 10) {
        setTimeOfDay("morning");
      } else if (hour >= 10 && hour < 17) {
        setTimeOfDay("day");
      } else if (hour >= 17 && hour < 20) {
        setTimeOfDay("evening");
      } else {
        setTimeOfDay("night");
      }
    };

    // Set initial time
    updateTimeOfDay();
    
    // Update every minute
    const interval = setInterval(updateTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, []);

  // Change weather randomly every 5 minutes
  useEffect(() => {
    const updateWeather = () => {
      const randomNumber = Math.random();
      if (randomNumber < 0.6) {
        setWeather("clear");
      } else if (randomNumber < 0.9) {
        setWeather("cloudy");
      } else {
        setWeather("rainy");
      }
    };
    
    updateWeather();
    const interval = setInterval(updateWeather, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Determine background colors based on time of day - updated to Lovable-style colors
  const getBgColors = () => {
    switch (timeOfDay) {
      case "morning":
        return {
          sky: "from-blue-900/80 via-purple-800/50 to-purple-600/40",
          ground: "from-purple-900/30 to-blue-800/20",
        };
      case "day":
        return {
          sky: "from-blue-800/70 via-purple-700/50 to-pink-600/30",
          ground: "from-purple-800/20 to-blue-800/10",
        };
      case "evening":
        return {
          sky: "from-purple-900/80 via-pink-800/60 to-orange-700/40",
          ground: "from-purple-900/30 to-blue-900/20",
        };
      case "night":
        return {
          sky: "from-blue-950/90 via-purple-900/70 to-indigo-900/50",
          ground: "from-blue-950/40 to-purple-950/30",
        };
      default:
        return {
          sky: "from-blue-800/70 via-purple-700/50 to-pink-600/30",
          ground: "from-purple-800/20 to-blue-800/10",
        };
    }
  };

  const bgColors = getBgColors();

  // Get weather icon based on time and weather
  const getWeatherIcon = () => {
    const iconSize = 48;
    const iconColor = timeOfDay === "night" ? "#E2E8F0" : "#2D3748";
    
    if (weather === "rainy") {
      return <CloudRain size={iconSize} className="text-white/60 animate-pulse" />;
    }
    
    if (weather === "cloudy") {
      if (timeOfDay === "night") {
        return <CloudMoon size={iconSize} className="text-white/70" />;
      }
      return <CloudSun size={iconSize} className="text-white/70" />;
    }
    
    // Clear weather
    if (timeOfDay === "night") {
      return <Moon size={iconSize} className="text-white/70" />;
    }
    return <Sun size={iconSize} className="text-white/70" />;
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Lovable-style animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgColors.sky} transition-colors duration-5000`} />
      
      {/* Floating particles/stars effect */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white animate-float"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Cloud animations - made more subtle */}
      {(weather === "cloudy" || weather === "rainy") && (
        <>
          <div className="absolute top-10 left-10 animate-float opacity-30">
            <Cloud size={72} className="text-white" />
          </div>
          <div className="absolute top-24 left-1/3 animate-float opacity-20" style={{ animationDelay: "1s" }}>
            <Cloud size={48} className="text-white" />
          </div>
          <div className="absolute top-16 right-1/4 animate-float opacity-25" style={{ animationDelay: "2s" }}>
            <Cloud size={64} className="text-white" />
          </div>
        </>
      )}
      
      {/* Weather icon */}
      <div className="absolute top-8 right-8">
        {getWeatherIcon()}
      </div>
      
      {/* Rain effect - made more subtle */}
      {weather === "rainy" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 bg-white/20 rounded-full animate-rainfall"
              style={{ 
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                height: `${Math.random() * 15 + 10}px`,
                animationDuration: `${Math.random() * 1.5 + 1}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Ground gradient - more subtle */}
      <div className={`absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t ${bgColors.ground} transition-colors duration-5000`}>
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-purple-950/30 to-transparent" />
      </div>
      
      {/* Simple decorative glow elements */}
      <div className="absolute bottom-20 left-1/4 w-32 h-32 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute top-40 right-1/3 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl" />
    </div>
  );
};

export default GhibliBackground;

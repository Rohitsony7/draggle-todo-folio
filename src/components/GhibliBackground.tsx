
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

  // Determine background colors based on time of day
  const getBgColors = () => {
    switch (timeOfDay) {
      case "morning":
        return {
          sky: "from-ghibli-sky/70 to-ghibli-field/60",
          ground: "from-ghibli-field/50 to-ghibli-forest/40",
        };
      case "day":
        return {
          sky: "from-ghibli-sky to-ghibli-sky/60",
          ground: "from-ghibli-forest/70 to-ghibli-earth/50",
        };
      case "evening":
        return {
          sky: "from-ghibli-blossom/70 to-ghibli-field/60",
          ground: "from-ghibli-earth/60 to-ghibli-forest/50",
        };
      case "night":
        return {
          sky: "from-blue-900/80 to-indigo-900/70",
          ground: "from-gray-800/60 to-gray-900/50",
        };
      default:
        return {
          sky: "from-ghibli-sky to-ghibli-sky/60",
          ground: "from-ghibli-forest/70 to-ghibli-earth/50",
        };
    }
  };

  const bgColors = getBgColors();

  // Get weather icon based on time and weather
  const getWeatherIcon = () => {
    const iconSize = 48;
    const iconColor = timeOfDay === "night" ? "#E2E8F0" : "#2D3748";
    
    if (weather === "rainy") {
      return <CloudRain size={iconSize} className="text-gray-600 animate-pulse" />;
    }
    
    if (weather === "cloudy") {
      if (timeOfDay === "night") {
        return <CloudMoon size={iconSize} className="text-gray-300" />;
      }
      return <CloudSun size={iconSize} className="text-yellow-400" />;
    }
    
    // Clear weather
    if (timeOfDay === "night") {
      return <Moon size={iconSize} className="text-gray-200" />;
    }
    return <Sun size={iconSize} className="text-yellow-500" />;
  };

  // Determine display based on time of day and weather
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Sky gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgColors.sky} transition-colors duration-5000`} />
      
      {/* Cloud animations */}
      {(weather === "cloudy" || weather === "rainy") && (
        <>
          <div className="absolute top-10 left-10 animate-float opacity-70">
            <Cloud size={72} className="text-white/70" />
          </div>
          <div className="absolute top-24 left-1/3 animate-float opacity-80" style={{ animationDelay: "1s" }}>
            <Cloud size={48} className="text-white/80" />
          </div>
          <div className="absolute top-16 right-1/4 animate-float opacity-60" style={{ animationDelay: "2s" }}>
            <Cloud size={64} className="text-white/60" />
          </div>
        </>
      )}
      
      {/* Weather icon */}
      <div className="absolute top-8 right-8">
        {getWeatherIcon()}
      </div>
      
      {/* Rain effect */}
      {weather === "rainy" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-0.5 bg-blue-200/40 rounded-full animate-rainfall"
              style={{ 
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                height: `${Math.random() * 20 + 15}px`,
                animationDuration: `${Math.random() * 1.5 + 1}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Ground/hills gradient */}
      <div className={`absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t ${bgColors.ground} transition-colors duration-5000`}>
        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-ghibli-earth/40 to-transparent" />
      </div>
      
      {/* Simple house silhouette */}
      <div className="absolute bottom-10 left-10 md:left-20 w-40 h-32 transition-all duration-5000">
        <div className="relative w-full h-full">
          {/* House body */}
          <div className="absolute bottom-0 left-0 w-28 h-20 bg-amber-950/80 rounded-sm shadow-lg" />
          
          {/* House roof */}
          <div className="absolute bottom-20 left-0 w-0 h-0 border-l-[14px] border-l-transparent border-b-[10px] border-b-red-900/90 border-r-[14px] border-r-transparent" style={{ transform: 'scale(3.5)' }} />
          
          {/* Window with light */}
          <div className={`absolute bottom-10 left-10 w-6 h-6 ${timeOfDay === "night" || timeOfDay === "evening" ? "bg-yellow-300/80" : "bg-blue-200/50"} rounded-sm shadow-inner`} />
          
          {/* Chimney */}
          <div className="absolute bottom-24 right-6 w-4 h-10 bg-gray-700/80 rounded-t-sm" />
          
          {/* Smoke from chimney */}
          {(timeOfDay === "morning" || timeOfDay === "evening") && (
            <>
              <div className="absolute bottom-32 right-6 w-3 h-3 bg-gray-300/40 rounded-full animate-float" />
              <div className="absolute bottom-36 right-4 w-4 h-4 bg-gray-300/30 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
              <div className="absolute bottom-40 right-2 w-5 h-5 bg-gray-300/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />
            </>
          )}
        </div>
      </div>
      
      {/* Trees */}
      <div className="absolute bottom-10 right-10 md:right-20 w-20 h-32">
        <div className="absolute bottom-0 left-0 w-8 h-20">
          <div className="absolute bottom-0 left-3 w-2 h-10 bg-amber-900/80 rounded-sm" />
          <div className="absolute bottom-8 left-0 w-8 h-8 bg-ghibli-forest/80 rounded-full" />
          <div className="absolute bottom-12 left-1 w-6 h-6 bg-ghibli-forest/80 rounded-full" />
          <div className="absolute bottom-16 left-2 w-4 h-4 bg-ghibli-forest/80 rounded-full" />
        </div>
        
        <div className="absolute bottom-0 right-0 w-8 h-16">
          <div className="absolute bottom-0 left-3 w-2 h-6 bg-amber-900/80 rounded-sm" />
          <div className="absolute bottom-5 left-0 w-8 h-8 bg-ghibli-forest/80 rounded-full" />
          <div className="absolute bottom-9 left-1 w-6 h-6 bg-ghibli-forest/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default GhibliBackground;

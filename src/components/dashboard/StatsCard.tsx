import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: 'users' | 'map' | 'camera' | 'document' | 'clipboard' | 'banknotes';
  color: 'blue' | 'green' | 'purple' | 'orange' | 'indigo' | 'emerald' | 'red' | 'yellow';
}

const StatsCard = ({ title, value, change, changeType, icon, color }: StatsCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-teal-50',
        icon: 'bg-teal-100',
        text: 'text-[#3f7670]',
        accent: 'text-[#3f7670]'
      },
      green: {
        bg: 'bg-teal-50',
        icon: 'bg-teal-100',
        text: 'text-[#3f7670]',
        accent: 'text-[#3f7670]'
      },
      purple: {
        bg: 'bg-teal-50',
        icon: 'bg-teal-100',
        text: 'text-[#3f7670]',
        accent: 'text-[#3f7670]'
      },
      orange: {
        bg: 'bg-teal-50',
        icon: 'bg-teal-100',
        text: 'text-[#3f7670]',
        accent: 'text-[#3f7670]'
      },
      indigo: {
        bg: 'bg-teal-50',
        icon: 'bg-teal-100',
        text: 'text-[#3f7670]',
        accent: 'text-[#3f7670]'
      },
      emerald: {
        bg: 'bg-teal-50',
        icon: 'bg-teal-100',
        text: 'text-[#3f7670]',
        accent: 'text-[#3f7670]'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'bg-red-100',
        text: 'text-red-600',
        accent: 'text-red-500'
      },
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'bg-yellow-100',
        text: 'text-yellow-600',
        accent: 'text-yellow-500'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getChangeIconPath = () => {
    switch (changeType) {
      case 'positive':
        return 'M5 10l7 7 7-7';
      case 'negative':
        return 'M19 14l-7-7-7 7';
      default:
        return 'M5 12h14';
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const colors = getColorClasses(color);

  return (
    <div
      ref={cardRef}
      className={`${colors.bg} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center text-2xl`}>
          <svg className="w-7 h-7 ${colors.text}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {icon === 'users' && (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4h-3m-4 6H2v-2a4 4 0 014-4h3m6-4a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z" />)}
            {icon === 'map' && (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.382V5a2 2 0 012-2h0a2 2 0 012 2v8l6 3 6-3V5a2 2 0 00-2-2h0" />)}
            {icon === 'camera' && (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h3l2-3h8l2 3h3v12H3V7zm9 3a4 4 0 100 8 4 4 0 000-8z" />)}
            {icon === 'document' && (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2H9a2 2 0 01-2-2V7z" />)}
            {icon === 'clipboard' && (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6a2 2 0 012 2v12a2 2 0 01-2 2H9a2 2 0 01-2-2V7a2 2 0 012-2zm0 0V3a2 2 0 012-2h2a2 2 0 012 2v2" />)}
            {icon === 'banknotes' && (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18v6H3v-6zm2-4h14v4H5V6zm2 8h2m4 0h2" />)}
          </svg>
        </div>
        <div className={`text-sm font-medium ${getChangeColor()} flex items-center space-x-1`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={getChangeIconPath()} />
          </svg>
          <span>{change}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className={`text-2xl font-bold ${colors.text}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>vs last month</span>
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <span className="font-medium">{change}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

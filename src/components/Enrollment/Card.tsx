interface CardProps {
  color: string;  // ví dụ: "red-500", "green-600", "blue-400"
  value: number;
  label: string;
}

export const Card: React.FC<CardProps> = ({ color, value, label }) => {
  return (
    <div className={`${color} text-white p-4 rounded-lg`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
};

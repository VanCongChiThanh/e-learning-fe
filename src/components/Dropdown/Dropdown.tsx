interface DropdownProps {
  label: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean; // nhận trạng thái từ cha
  onToggle: () => void; // callback toggle từ cha
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  children,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="dropdown relative inline-block">
      <button
        className="dropdown-toggle flex items-center gap-1"
        onClick={onToggle}
      >
        {label}
        <i
          className={`fa-solid fa-chevron-down transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div className="dropdown-menu absolute right-0 top-full bg-white shadow-lg rounded-md border flex flex-col z-50">
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

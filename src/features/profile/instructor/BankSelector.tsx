import React, { useState, useRef, useEffect } from "react";

export interface BankOption {
  code: string;
  name: string;
  shortName: string;
  logo: string;
}

// Danh sách ngân hàng Việt Nam với logo
export const VIETNAM_BANKS: BankOption[] = [
  {
    code: "VCB",
    name: "Ngân hàng TMCP Ngoại thương Việt Nam",
    shortName: "Vietcombank",
    logo: "https://api.vietqr.io/img/VCB.png",
  },
  {
    code: "TCB",
    name: "Ngân hàng TMCP Kỹ thương Việt Nam",
    shortName: "Techcombank",
    logo: "https://api.vietqr.io/img/TCB.png",
  },
  {
    code: "BIDV",
    name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
    shortName: "BIDV",
    logo: "https://api.vietqr.io/img/BIDV.png",
  },
  {
    code: "VTB",
    name: "Ngân hàng Thương mại cổ phần Việt Tín",
    shortName: "VietinBank",
    logo: "https://api.vietqr.io/img/ICB.png",
  },
  {
    code: "ACB",
    name: "Ngân hàng TMCP Á Châu",
    shortName: "ACB",
    logo: "https://api.vietqr.io/img/ACB.png",
  },
  {
    code: "MB",
    name: "Ngân hàng TMCP Quân đội",
    shortName: "MBBank",
    logo: "https://api.vietqr.io/img/MB.png",
  },
  {
    code: "VPB",
    name: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
    shortName: "VPBank",
    logo: "https://api.vietqr.io/img/VPB.png",
  },
  {
    code: "TPB",
    name: "Ngân hàng TMCP Tiên Phong",
    shortName: "TPBank",
    logo: "https://api.vietqr.io/img/TPB.png",
  },
  {
    code: "STB",
    name: "Ngân hàng TMCP Sài Gòn Thương Tín",
    shortName: "Sacombank",
    logo: "https://api.vietqr.io/img/STB.png",
  },
  {
    code: "SHB",
    name: "Ngân hàng TMCP Sài Gòn - Hà Nội",
    shortName: "SHB",
    logo: "https://api.vietqr.io/img/SHB.png",
  },
  {
    code: "HDB",
    name: "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh",
    shortName: "HDBank",
    logo: "https://api.vietqr.io/img/HDB.png",
  },
  {
    code: "MSB",
    name: "Ngân hàng TMCP Hàng Hải",
    shortName: "MSB",
    logo: "https://api.vietqr.io/img/MSB.png",
  },
  {
    code: "OCB",
    name: "Ngân hàng TMCP Phương Đông",
    shortName: "OCB",
    logo: "https://api.vietqr.io/img/OCB.png",
  },
  {
    code: "SCB",
    name: "Ngân hàng TMCP Sài Gòn",
    shortName: "SCB",
    logo: "https://api.vietqr.io/img/SCB.png",
  },
  {
    code: "VIB",
    name: "Ngân hàng TMCP Quốc tế",
    shortName: "VIB",
    logo: "https://api.vietqr.io/img/VIB.png",
  },
  {
    code: "SEA",
    name: "Ngân hàng TMCP Đông Nam Á",
    shortName: "SeABank",
    logo: "https://api.vietqr.io/img/SEAB.png",
  },
  {
    code: "CAKE",
    name: "Ngân hàng số CAKE by VPBank",
    shortName: "CAKE",
    logo: "https://api.vietqr.io/img/CAKE.png",
  },
  {
    code: "UBANK",
    name: "Ngân hàng số Ubank by VPBank",
    shortName: "Ubank",
    logo: "https://api.vietqr.io/img/UBANK.png",
  },
  {
    code: "TIMO",
    name: "Ngân hàng số Timo by Ban Viet Bank",
    shortName: "Timo",
    logo: "https://api.vietqr.io/img/TIMO.png",
  },
  {
    code: "VIET",
    name: "Ngân hàng TMCP Việt Nam Thương Tín",
    shortName: "VietBank",
    logo: "https://api.vietqr.io/img/VIETBANK.png",
  },
  {
    code: "NAB",
    name: "Ngân hàng TMCP Nam Á",
    shortName: "NAB",
    logo: "https://api.vietqr.io/img/NAB.png",
  },
  {
    code: "VAB",
    name: "Ngân hàng TMCP Việt Á",
    shortName: "VietABank",
    logo: "https://api.vietqr.io/img/VAB.png",
  },
  {
    code: "BAB",
    name: "Ngân hàng TMCP Bắc Á",
    shortName: "BacABank",
    logo: "https://api.vietqr.io/img/BAB.png",
  },
  {
    code: "PGB",
    name: "Ngân hàng TMCP Xăng dầu Petrolimex",
    shortName: "PGBank",
    logo: "https://api.vietqr.io/img/PGB.png",
  },
  {
    code: "EIB",
    name: "Ngân hàng TMCP Xuất nhập khẩu Việt Nam",
    shortName: "Eximbank",
    logo: "https://api.vietqr.io/img/EIB.png",
  },
  {
    code: "ABB",
    name: "Ngân hàng TMCP An Bình",
    shortName: "ABBANK",
    logo: "https://api.vietqr.io/img/ABB.png",
  },
  {
    code: "LPB",
    name: "Ngân hàng TMCP Bưu Điện Liên Việt",
    shortName: "LienVietPostBank",
    logo: "https://api.vietqr.io/img/LPB.png",
  },
  {
    code: "KLB",
    name: "Ngân hàng TMCP Kiên Long",
    shortName: "KienLongBank",
    logo: "https://api.vietqr.io/img/KLB.png",
  },
  {
    code: "NCB",
    name: "Ngân hàng TMCP Quốc Dân",
    shortName: "NCB",
    logo: "https://api.vietqr.io/img/NCB.png",
  },
];

interface BankSelectorProps {
  value: string;
  onChange: (bankName: string, bankCode: string) => void;
  error?: string;
}

const BankSelector: React.FC<BankSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedBank = VIETNAM_BANKS.find(
    (bank) => bank.shortName === value || bank.name === value
  );

  const filteredBanks = VIETNAM_BANKS.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (bank: BankOption) => {
    onChange(bank.shortName, bank.code);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between ${
          error ? "border-red-500" : "border-gray-300"
        } ${isOpen ? "ring-2 ring-emerald-200" : ""}`}
      >
        {selectedBank ? (
          <div className="flex items-center gap-3">
            <img
              src={selectedBank.logo}
              alt={selectedBank.shortName}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {selectedBank.shortName}
              </span>
              <span className="text-xs text-gray-500 truncate max-w-xs">
                {selectedBank.name}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-gray-400">Chọn ngân hàng</span>
        )}
        <i
          className={`fas fa-chevron-down text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        ></i>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b sticky top-0 bg-white">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm ngân hàng..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bank List */}
          <div className="overflow-y-auto max-h-80">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank) => (
                <div
                  key={bank.code}
                  onClick={() => handleSelect(bank)}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-3 ${
                    selectedBank?.code === bank.code ? "bg-emerald-50" : ""
                  }`}
                >
                  <img
                    src={bank.logo}
                    alt={bank.shortName}
                    className="w-10 h-10 object-contain flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23e5e7eb'/%3E%3Ctext x='20' y='20' text-anchor='middle' dy='.3em' fill='%239ca3af' font-family='sans-serif' font-size='14'%3E" +
                        bank.code +
                        "%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium text-sm">
                      {bank.shortName}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {bank.name}
                    </span>
                  </div>
                  {selectedBank?.code === bank.code && (
                    <i className="fas fa-check text-emerald-600"></i>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-8 text-center text-gray-500 text-sm">
                Không tìm thấy ngân hàng
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default BankSelector;

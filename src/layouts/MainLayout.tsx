import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useChatbot } from "../hooks/useChatbot";
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useChatbot();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;

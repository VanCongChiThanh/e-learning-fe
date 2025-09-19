import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-8 py-6">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;

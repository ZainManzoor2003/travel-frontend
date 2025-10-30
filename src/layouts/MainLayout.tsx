import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../pages/homepage/components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffe020' }}>
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: '#ffe020' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

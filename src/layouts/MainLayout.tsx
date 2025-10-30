import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';
import Footer from '../pages/homepage/components/Footer.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffe020' }}>
      <SEO />
      {/* <Navbar /> */}
      <Navbar />
      <main className="flex-1" style={{ backgroundColor: '#ffe020' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

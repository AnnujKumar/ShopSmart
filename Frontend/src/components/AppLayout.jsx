import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout component that conditionally renders header and footer
 * based on the current route
 */
function AppLayout({ children }) {
  const location = useLocation();
  const path = location.pathname;
  
  // Don't show header and footer on login and signup pages
  const isAuthPage = path === '/login' || path === '/signup';
  
  return (
    <>
      {!isAuthPage && <Header />}
      <main className={isAuthPage ? 'auth-only-content' : 'main-content'}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default AppLayout;

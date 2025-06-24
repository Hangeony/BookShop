import Footer from "../common/Footer";
import Header from "../common/Header";

interface LayoutProps {
  children: React.ReactNode; // React Node > React Element > JSX Element
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;

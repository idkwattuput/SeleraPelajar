import Footer from "./_components/footer";
import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

export default function AuthenticateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

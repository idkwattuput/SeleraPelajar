import Footer from "./_components/footer";
import Navbar from "./_components/navbar";

export default function AuthenticateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      <Navbar />
      <div className="h-screen">
        {children}
      </div>
      <Footer />
    </div>
  );
}

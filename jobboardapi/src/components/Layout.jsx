import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            <Navbar />
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    );
}

export default Layout;
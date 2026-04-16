import ROICalculator from "./components/ROICalculator";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <ROICalculator />
      </main>
      <Footer />
    </div>
  );
}

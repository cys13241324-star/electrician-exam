import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dashboard from "@/components/cbt/Dashboard";
import SubTabs from "@/components/cbt/SubTabs";
import TextbookFloatingPopup from "@/components/TextbookFloatingPopup";
import { boardPosts, notices } from "@/lib/cbt/mockBoard";

export default function CbtPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <SubTabs active="main" />
      <Dashboard notices={notices} boardPosts={boardPosts} />
      <Footer />
      <TextbookFloatingPopup />
    </div>
  );
}

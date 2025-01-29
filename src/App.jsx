import { Card, CardHeader, CardBody, Button, NextUIProvider } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "./components/ProgressBar";
import StartPage from "./pages/StartPage";
import Houses from "./pages/Houses";
import Students from "./pages/Students";
import Sort from "./pages/Sort";
import { Moon, Sun } from "lucide-react"; // Modified this line
import { useEffect } from "react";
import { useAppStore } from './stores/appStore';
import NavButtons from './components/NavButtons';
import Shuffle from "./components/Shuffle";
import Export from "./components/Export";
import Search from "./components/Search";
import PageTransition from "./components/PageTransition"; // Add this import

const cardVariants = {
  default: {
    width: 'min(700px, 95vw)',
    height: 'min(700px, 90vh)',
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  expanded: {
    width: '95vw',
    height: '90vh',
    transition: { duration: 0.5, ease: "easeInOut" }
  }
};

const ModeToggle = () => {
  const { isDark, toggleTheme } = useAppStore();
  return (
    <Button
      isIconOnly
      variant="light"
      onClick={toggleTheme}
      className="absolute top-4 right-4"
    >
      {isDark ? <Sun size={25} /> : <Moon size={25} />}
    </Button>
  );
};

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

function App() {
  const { showMainContent, contentIndex, setShowMainContent, nextContent, prevContent, isDark } = useAppStore();
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDark);
  }, [isDark]);

  const renderContent = () => {
    switch(contentIndex) {
      case 0:
        return <Houses />;
      case 1:
        return <Students />;
      case 2:
        return <Sort />;
      default:
        return <Houses />;
    }
  };

  return (
    <NextUIProvider>
      <main className="flex min-h-screen items-center justify-center p- overflow-hidden">
        <AnimatePresence mode="wait">
          {!showMainContent ? (
            <motion.div
              key="startpage"
              {...pageTransition}
            >
              <StartPage onStart={() => setShowMainContent(true)} />
            </motion.div>
          ) : (
            <motion.div
              key="maincontent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center"
            >
              <motion.div
                variants={cardVariants}
                initial="default"
                animate={contentIndex === 2 ? "expanded" : "default"}
                style={{ width: '100%', height: '100%' }}
              >
                <Card className="w-full h-full bg-content1">
                  <CardHeader className="pb-0">
                    <ProgressBar value={(contentIndex + 1) * 33.33} />
                  </CardHeader>
                  <CardHeader className="py-2 flex justify-between items-center">
                    <NavButtons 
                      onNext={nextContent}
                      onBack={prevContent}
                      contentIndex={contentIndex}
                    />
                    
                    <div className="flex items-center justify-center gap-4">
                      {contentIndex === 2 ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Search />
                          </div>
                          <div className="flex items-center gap-2">
                            <Shuffle />
                            <Export />
                          </div>
                        </>
                      ) : <div className="flex-1" />}
                      <div className="flex items-center">
                        <ModeToggle />
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className={`${
                    contentIndex === 2 
                      ? 'h-[calc(90vh-120px)] overflow-hidden' 
                      : 'h-[600px] overflow-auto'
                  } flex items-center justify-center`}>
                    <PageTransition>
                      {renderContent()}
                    </PageTransition>
                  </CardBody>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </NextUIProvider>
  );
}

export default App;

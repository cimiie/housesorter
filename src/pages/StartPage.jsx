import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { Moon, Sun } from "lucide-react";
import { useAppStore } from '../stores/appStore';

const ModeToggle = () => {
  const { isDark, toggleTheme } = useAppStore();
  return (
    <Button
      isIconOnly
      variant="light"
      onClick={toggleTheme}
      className="absolute top-4 right-4 z-50"
    >
      {isDark ? <Sun size={25} /> : <Moon size={25} />}
    </Button>
  );
};

const StartPage = ({ onStart }) => {
  return (
    <Card className="p-4 w-[700px] h-[700px] bg-content1 relative">
      <ModeToggle />
      <CardHeader className="flex justify-center">
        <h1 className="text-4xl font-bold">Group Sorter</h1>
      </CardHeader>
      <CardBody className="flex items-center justify-center">
        <Button 
          color="primary" 
          size="lg" 
          onClick={onStart}
          className="text-xl"
        >
          Get Started
        </Button>
      </CardBody>
    </Card>
  );
};

export default StartPage;

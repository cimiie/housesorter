import { Button } from "@nextui-org/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NavButtons = ({ onNext, onBack, contentIndex }) => (
  <div className="flex justify-between items-center">
    <Button
      isIconOnly
      variant="light"
      onClick={onBack}
      isDisabled={contentIndex === 0}
    >
      <ChevronLeft size={24} />
    </Button>
    <Button
      isIconOnly
      variant="light"
      onClick={onNext}
      isDisabled={contentIndex === 2}
    >
      <ChevronRight size={24} />
    </Button>
  </div>
);

export default NavButtons;

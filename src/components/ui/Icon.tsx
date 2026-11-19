import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faLayerGroup,
  faListCheck,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const icons = {
  calendar: faCalendarDays,
  check: faCheck,
  previous: faChevronLeft,
  next: faChevronRight,
  categories: faLayerGroup,
  tasks: faListCheck,
  plus: faPlus,
};

export default function Icon({ name }: { name: keyof typeof icons }) {
  return <FontAwesomeIcon icon={icons[name]} aria-hidden="true" />;
}

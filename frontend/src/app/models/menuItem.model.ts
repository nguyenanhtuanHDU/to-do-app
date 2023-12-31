import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface menuItem {
  label: string;
  icon: string;
  routerLink?: string;
  click?: () => void;
}

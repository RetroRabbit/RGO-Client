export interface NavItem {
  id: number;
  name: string;
  prop?: string;
  children?: NavItem[];
}

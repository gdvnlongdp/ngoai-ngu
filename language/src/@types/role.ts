import { Permission } from "./permission";

// ----------------------------------------------------------------------

export type Role = {
  id: string;
  name: string;
  permissions: Permission[] | null;
  description: string | null;
};
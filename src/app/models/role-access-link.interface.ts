export interface RoleAccessLink {
    id: number;
    role: {
      id: number;
      description: string;
    };
    roleAccess: {
      id: number;
      permission: string;
    };
  }
  
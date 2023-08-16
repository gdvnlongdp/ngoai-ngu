import { Role } from '../@types/role';

export default function rolesToRoleNameArray(roles: Role[]) {
  return [
    'all',
    ...roles.map(role => role.name)]
    ;
}
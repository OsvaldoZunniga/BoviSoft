import type { Owner } from '~/types/Owner';

export const OWNERS: Owner[] = [
  { id: '6a9f823f5ca675bfff034f3e', name: 'Finca' },
  { id: '6aa5e72392379fa6dfca514d', name: 'Propietario Principal' },
  { id: '6aa5e8cf92379fa6dfca514f', name: 'Socio Ganadero' },
];

export function getOwnerName(ownerId?: string | null): string {
  if (!ownerId || !ownerId.trim()) {
    return 'Sin asignar';
  }
  const clean = ownerId.trim().toLowerCase();
  const found = OWNERS.find(
    (o) => o.id.toLowerCase() === clean || o.name.toLowerCase() === clean
  );
  return found ? found.name : ownerId;
}

export interface Cattle {
  id?: string;
  earTag: string | null;
  name: string;
  breed: string;
  birthday: string;
  weight: number;
  gender: string;
  image?: string | null;
  imagePath?: string | null;
  motherId: string;
  fatherId: string;
  statusId: number;
  ownerId?: string | null;
}

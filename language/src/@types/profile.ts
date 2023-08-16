export enum Gender {
  Male = "male",
  Female = "female"
}

export type Profile = {
  id: string;
  name: string;
  gender: Gender;
  phone: string;
  avatar?: string;
}
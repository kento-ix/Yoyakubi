export interface CustomerForm {
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  phone: string;
  email: string;
  birthday: Date | null;
  birthdayYear?: string;
  birthdayMonth?: string;
  birthdayDay?: string;
}

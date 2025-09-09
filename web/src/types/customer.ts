export interface CustomerForm {
  line_id: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  phone: string;
  email: string;
  birthday: Date | null;
  birthdayYear: string;
  birthdayMonth: string;
  birthdayDay: string;
}

export interface CustomerCreateRequest {
  line_id: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  phone: string;
  email: string;
  birthday: string;
}

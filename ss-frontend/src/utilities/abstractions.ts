export enum UserTypes {
  Customer = 0,
  Seller = 1,
  // Admin = 2,
}

export enum FormModes {
  SignIn = 0,
  SignUp = 1,
  ForgotPassword = 2,
}

export type UserDetails = {
  userType: UserTypes,
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string | null,
  address: string | null,
};

export type Item = {
  id: number,
  name: string,
  price: string,
  imageUrl: string,
  quantity: number,
  seller: string
}

export const UserTypes = {
  Customer: 0,
  Seller: 1,
  // Admin: 2,
} as const;

export type UserTypes = typeof UserTypes[keyof typeof UserTypes];

export const UserTypeNames = Object.entries(UserTypes).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<UserTypes, string>);

export const FormModes = {
  SignIn: 0,
  SignUp: 1,
  ForgotPassword: 2,
} as const;

export type FormModes = typeof FormModes[keyof typeof FormModes];

export const FormModeNames = Object.entries(FormModes).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {} as Record<FormModes, string>);

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

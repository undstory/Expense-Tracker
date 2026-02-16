export type DataType = {
  id: number;
  title: string;
  amount: number;
  category: string;
  expense_date: string;
};

export type CategoryType = string[];

export type ErrorType = {
  detail: ErrorDetailType[];
};

export type ErrorDetailType = {
  loc: (string | number)[];
  msg: string;
  type: string;
  input: string;
};

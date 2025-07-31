export interface User {
  userName: string;
  password: string;
}

// ProductDetails schema matching database
export interface ProductDetails {
  DesignNo: string;
  TypeOfGarment: string;
  ColorOfGarment: string;
  BlouseColor: string;
  DupptaColor: string;
  Rate: number;
  FixCode: number;
}

// OrderDetails schema matching database
export interface IOrderDetails {
  DesignNo: string;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
}

export interface IOrder {
  OrderNo: string;
  Date: Date;
  CustomerName: string;
  Address: string;
  PhoneNo: string;
  Agent: string;
  Transport: string;
  PaymentTerms: string;
  Remark: string;
  OrderDetails: IOrderDetails[];
  totalAmount: number;
}

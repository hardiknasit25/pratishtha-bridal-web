// Mock data based on database schemas

// ProductDetails schema
export interface ProductDetails {
  DesignNo: string;
  TypeOfGarment: string;
  ColorOfGarment: string;
  BlouseColor: string;
  DupptaColor: string;
  Rate: number;
  FixCode: number;
}

// OrderDetails schema
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

// Mock Products Data
export const mockProducts: ProductDetails[] = [
  {
    DesignNo: "DES001",
    TypeOfGarment: "Bridal Lehenga",
    ColorOfGarment: "Red",
    BlouseColor: "Gold",
    DupptaColor: "Red",
    Rate: 25000,
    FixCode: 1001,
  },
  {
    DesignNo: "DES002",
    TypeOfGarment: "Party Wear",
    ColorOfGarment: "Blue",
    BlouseColor: "Silver",
    DupptaColor: "Blue",
    Rate: 15000,
    FixCode: 1002,
  },
  {
    DesignNo: "DES003",
    TypeOfGarment: "Anarkali Suit",
    ColorOfGarment: "Green",
    BlouseColor: "White",
    DupptaColor: "Green",
    Rate: 12000,
    FixCode: 1003,
  },
  {
    DesignNo: "DES004",
    TypeOfGarment: "Saree",
    ColorOfGarment: "Pink",
    BlouseColor: "Cream",
    DupptaColor: "Pink",
    Rate: 18000,
    FixCode: 1004,
  },
  {
    DesignNo: "DES005",
    TypeOfGarment: "Gown",
    ColorOfGarment: "Purple",
    BlouseColor: "Gold",
    DupptaColor: "Purple",
    Rate: 22000,
    FixCode: 1005,
  },
];

// Mock Orders Data
export const mockOrders: IOrder[] = [
  {
    OrderNo: "ORD001",
    Date: new Date("2024-01-15"),
    CustomerName: "Priya Sharma",
    Address: "123 Main Street, Mumbai, Maharashtra",
    PhoneNo: "+91 9876543210",
    Agent: "Rajesh Kumar",
    Transport: "Express Delivery",
    PaymentTerms: "50% Advance",
    Remark: "Urgent delivery required for wedding",
    OrderDetails: [
      {
        DesignNo: "DES001",
        Quantity: 1,
        UnitPrice: 25000,
        TotalPrice: 25000,
      },
      {
        DesignNo: "DES004",
        Quantity: 1,
        UnitPrice: 18000,
        TotalPrice: 18000,
      },
    ],
    totalAmount: 43000,
  },
  {
    OrderNo: "ORD002",
    Date: new Date("2024-01-20"),
    CustomerName: "Anjali Patel",
    Address: "456 Park Avenue, Delhi, NCR",
    PhoneNo: "+91 8765432109",
    Agent: "Suresh Singh",
    Transport: "Standard Delivery",
    PaymentTerms: "Full Payment",
    Remark: "Wedding in March, need alterations",
    OrderDetails: [
      {
        DesignNo: "DES002",
        Quantity: 1,
        UnitPrice: 15000,
        TotalPrice: 15000,
      },
    ],
    totalAmount: 15000,
  },
  {
    OrderNo: "ORD003",
    Date: new Date("2024-01-25"),
    CustomerName: "Meera Reddy",
    Address: "789 Lake View, Bangalore, Karnataka",
    PhoneNo: "+91 7654321098",
    Agent: "Priya Verma",
    Transport: "Premium Delivery",
    PaymentTerms: "30% Advance",
    Remark: "Reception party outfit",
    OrderDetails: [
      {
        DesignNo: "DES003",
        Quantity: 1,
        UnitPrice: 12000,
        TotalPrice: 12000,
      },
      {
        DesignNo: "DES005",
        Quantity: 1,
        UnitPrice: 22000,
        TotalPrice: 22000,
      },
    ],
    totalAmount: 34000,
  },
  {
    OrderNo: "ORD004",
    Date: new Date("2024-01-30"),
    CustomerName: "Kavya Iyer",
    Address: "321 Garden Road, Chennai, Tamil Nadu",
    PhoneNo: "+91 6543210987",
    Agent: "Amit Shah",
    Transport: "Express Delivery",
    PaymentTerms: "Full Payment",
    Remark: "Engagement ceremony",
    OrderDetails: [
      {
        DesignNo: "DES001",
        Quantity: 1,
        UnitPrice: 25000,
        TotalPrice: 25000,
      },
    ],
    totalAmount: 25000,
  },
];

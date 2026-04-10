export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type ShipmentStatus = 'pending' | 'pickedUp' | 'inTransit' | 'outForDelivery' | 'delivered' | 'failed';
export type ReturnStatus = 'pending' | 'approved' | 'pickedUp' | 'inspected' | 'refunded' | 'replaced' | 'rejected';
export type ReturnType = 'refund' | 'replacement';
export type RefundMethod = 'wallet' | 'bank';
export type InspectionStatus = 'pending' | 'passed' | 'failed';
export type CustomerSegment = 'vip' | 'new' | 'inactive' | 'regular';
export type TeamRole = 'admin' | 'manager' | 'support' | 'viewer';
export type MemberStatus = 'active' | 'inactive';

export interface OrderItem {
  productId: string;
  name: string;
  nameEn: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  customerId: string;
  status: OrderStatus;
  price: number;
  date: string;
  city: string;
  address: string;
  paymentMethod: string;
  shipmentId?: string;
  returnId?: string;
  items: OrderItem[];
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  category: string;
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpending: number;
  returnsCount: number;
  segment: CustomerSegment;
  lastOrder: string;
  email: string;
  blocked: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

export interface Message {
  id: string;
  text: string;
  sent: boolean;
  time: string;
}

export interface Shipment {
  id: string;
  tracking: string;
  customer: string;
  customerId: string;
  orderId: string;
  carrier: string;
  status: ShipmentStatus;
  city: string;
  date: string;
  estimatedDelivery: string;
  cost: number;
}

export interface Return {
  id: string;
  orderId: string;
  customerId: string;
  customer: string;
  reason: string;
  reasonEn: string;
  status: ReturnStatus;
  type: ReturnType;
  amount: number;
  refundMethod: RefundMethod;
  inspectionStatus: InspectionStatus;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  email: string;
  status: MemberStatus;
  lastActive: string;
  avatar: string;
}

export const orders: Order[] = [
  {
    id: '#ORD-1001', customer: 'محمد الأحمدي', customerId: 'C001', status: 'delivered', price: 1250, date: '2026-04-09', city: 'الرياض', address: 'حي النرجس، شارع الأمير محمد، الرياض', paymentMethod: 'Mada', shipmentId: 'SH001',
    items: [{ productId: 'P001', name: 'قميص قطني أبيض', nameEn: 'White Cotton Shirt', qty: 2, price: 149 }, { productId: 'P006', name: 'نظارة شمسية', nameEn: 'Sunglasses', qty: 1, price: 249 }],
  },
  {
    id: '#ORD-1002', customer: 'سارة العتيبي', customerId: 'C002', status: 'shipped', price: 680, date: '2026-04-09', city: 'جدة', address: 'حي الروضة، شارع التحلية، جدة', paymentMethod: 'Visa', shipmentId: 'SH002',
    items: [{ productId: 'P008', name: 'كريم ترطيب', nameEn: 'Moisturizing Cream', qty: 3, price: 89 }, { productId: 'P010', name: 'حزام جلدي', nameEn: 'Leather Belt', qty: 1, price: 129 }],
  },
  {
    id: '#ORD-1003', customer: 'عبدالله الغامدي', customerId: 'C003', status: 'confirmed', price: 3200, date: '2026-04-08', city: 'الدمام', address: 'حي الشاطئ، الدمام', paymentMethod: 'Apple Pay', shipmentId: 'SH003',
    items: [{ productId: 'P003', name: 'ساعة ذكية سوداء', nameEn: 'Black Smartwatch', qty: 1, price: 1299 }, { productId: 'P009', name: 'سماعات لاسلكية', nameEn: 'Wireless Headphones', qty: 1, price: 749 }],
  },
  {
    id: '#ORD-1004', customer: 'نورة القحطاني', customerId: 'C004', status: 'new', price: 450, date: '2026-04-08', city: 'مكة المكرمة', address: 'حي العزيزية، مكة المكرمة', paymentMethod: 'COD',
    items: [{ productId: 'P012', name: 'شال كشمير', nameEn: 'Cashmere Shawl', qty: 1, price: 329 }],
  },
  {
    id: '#ORD-1005', customer: 'فيصل الشمري', customerId: 'C005', status: 'cancelled', price: 890, date: '2026-04-08', city: 'المدينة المنورة', address: 'حي الورود، المدينة المنورة', paymentMethod: 'STC Pay',
    items: [{ productId: 'P005', name: 'عطر رجالي فاخر', nameEn: 'Luxury Men Perfume', qty: 1, price: 899 }],
  },
  {
    id: '#ORD-1006', customer: 'رنا السبيعي', customerId: 'C006', status: 'new', price: 2100, date: '2026-04-07', city: 'الرياض', address: 'حي الملقا، الرياض', paymentMethod: 'Visa', shipmentId: 'SH005',
    items: [{ productId: 'P005', name: 'عطر رجالي فاخر', nameEn: 'Luxury Men Perfume', qty: 1, price: 899 }, { productId: 'P002', name: 'حذاء جلدي بني', nameEn: 'Brown Leather Shoes', qty: 2, price: 399 }],
  },
  {
    id: '#ORD-1007', customer: 'خالد الدوسري', customerId: 'C007', status: 'shipped', price: 560, date: '2026-04-07', city: 'الطائف', address: 'حي الفيصلية، الطائف', paymentMethod: 'Mada', shipmentId: 'SH006',
    items: [{ productId: 'P007', name: 'بنطلون جينز أزرق', nameEn: 'Blue Jeans', qty: 2, price: 199 }],
  },
  {
    id: '#ORD-1008', customer: 'هدى المالكي', customerId: 'C008', status: 'delivered', price: 1750, date: '2026-04-06', city: 'جدة', address: 'حي الحمراء، جدة', paymentMethod: 'Apple Pay', shipmentId: 'SH007',
    items: [{ productId: 'P003', name: 'ساعة ذكية سوداء', nameEn: 'Black Smartwatch', qty: 1, price: 1299 }],
  },
  {
    id: '#ORD-1009', customer: 'عمر الزهراني', customerId: 'C009', status: 'confirmed', price: 3900, date: '2026-04-06', city: 'الدمام', address: 'حي العليا، الدمام', paymentMethod: 'Visa',
    items: [{ productId: 'P005', name: 'عطر رجالي فاخر', nameEn: 'Luxury Men Perfume', qty: 2, price: 899 }, { productId: 'P002', name: 'حذاء جلدي بني', nameEn: 'Brown Leather Shoes', qty: 1, price: 399 }],
  },
  {
    id: '#ORD-1010', customer: 'لمى الحربي', customerId: 'C010', status: 'new', price: 720, date: '2026-04-05', city: 'الرياض', address: 'حي السليمانية، الرياض', paymentMethod: 'STC Pay',
    items: [{ productId: 'P006', name: 'نظارة شمسية', nameEn: 'Sunglasses', qty: 2, price: 249 }],
  },
  {
    id: '#ORD-1011', customer: 'تركي العنزي', customerId: 'C011', status: 'shipped', price: 1100, date: '2026-04-05', city: 'بريدة', address: 'حي المروج، بريدة', paymentMethod: 'Mada', shipmentId: 'SH008',
    items: [{ productId: 'P009', name: 'سماعات لاسلكية', nameEn: 'Wireless Headphones', qty: 1, price: 749 }],
  },
  {
    id: '#ORD-1012', customer: 'منيرة الرشيدي', customerId: 'C012', status: 'delivered', price: 280, date: '2026-04-04', city: 'مكة المكرمة', address: 'حي العزيزية، مكة المكرمة', paymentMethod: 'COD',
    items: [{ productId: 'P008', name: 'كريم ترطيب', nameEn: 'Moisturizing Cream', qty: 1, price: 89 }],
  },
  {
    id: '#ORD-1013', customer: 'سلطان الشهري', customerId: 'C012', status: 'confirmed', price: 4500, date: '2026-04-04', city: 'جدة', address: 'حي السلامة، جدة', paymentMethod: 'Visa', shipmentId: 'SH010',
    items: [{ productId: 'P005', name: 'عطر رجالي فاخر', nameEn: 'Luxury Men Perfume', qty: 3, price: 899 }],
  },
  {
    id: '#ORD-1014', customer: 'غدير الجهني', customerId: 'C010', status: 'cancelled', price: 660, date: '2026-04-03', city: 'الرياض', address: 'حي الياسمين، الرياض', paymentMethod: 'Mada',
    items: [{ productId: 'P007', name: 'بنطلون جينز أزرق', nameEn: 'Blue Jeans', qty: 2, price: 199 }],
  },
  {
    id: '#ORD-1015', customer: 'بدر المطيري', customerId: 'C009', status: 'new', price: 1900, date: '2026-04-03', city: 'الدمام', address: 'حي العدامة، الدمام', paymentMethod: 'Apple Pay',
    items: [{ productId: 'P009', name: 'سماعات لاسلكية', nameEn: 'Wireless Headphones', qty: 1, price: 749 }, { productId: 'P001', name: 'قميص قطني أبيض', nameEn: 'White Cotton Shirt', qty: 3, price: 149 }],
  },
];

export const products: Product[] = [
  { id: 'P001', name: 'قميص قطني أبيض', nameEn: 'White Cotton Shirt', price: 149, stock: 85, status: 'active', category: 'ملابس', color: 'from-blue-400 to-blue-600' },
  { id: 'P002', name: 'حذاء جلدي بني', nameEn: 'Brown Leather Shoes', price: 399, stock: 32, status: 'active', category: 'أحذية', color: 'from-amber-700 to-amber-900' },
  { id: 'P003', name: 'ساعة ذكية سوداء', nameEn: 'Black Smartwatch', price: 1299, stock: 18, status: 'active', category: 'إلكترونيات', color: 'from-gray-700 to-gray-900' },
  { id: 'P004', name: 'حقيبة يد نسائية', nameEn: "Women's Handbag", price: 549, stock: 0, status: 'inactive', category: 'حقائب', color: 'from-pink-400 to-rose-600' },
  { id: 'P005', name: 'عطر رجالي فاخر', nameEn: 'Luxury Men Perfume', price: 899, stock: 45, status: 'active', category: 'عطور', color: 'from-purple-500 to-indigo-700' },
  { id: 'P006', name: 'نظارة شمسية', nameEn: 'Sunglasses', price: 249, stock: 67, status: 'active', category: 'إكسسوارات', color: 'from-emerald-500 to-teal-700' },
  { id: 'P007', name: 'بنطلون جينز أزرق', nameEn: 'Blue Jeans', price: 199, stock: 120, status: 'active', category: 'ملابس', color: 'from-blue-600 to-blue-900' },
  { id: 'P008', name: 'كريم ترطيب', nameEn: 'Moisturizing Cream', price: 89, stock: 200, status: 'active', category: 'عناية', color: 'from-orange-300 to-orange-500' },
  { id: 'P009', name: 'سماعات لاسلكية', nameEn: 'Wireless Headphones', price: 749, stock: 28, status: 'active', category: 'إلكترونيات', color: 'from-slate-500 to-slate-700' },
  { id: 'P010', name: 'حزام جلدي', nameEn: 'Leather Belt', price: 129, stock: 55, status: 'active', category: 'إكسسوارات', color: 'from-amber-800 to-amber-950' },
  { id: 'P011', name: 'قفازات رياضية', nameEn: 'Sports Gloves', price: 79, stock: 0, status: 'inactive', category: 'رياضة', color: 'from-red-500 to-red-700' },
  { id: 'P012', name: 'شال كشمير', nameEn: 'Cashmere Shawl', price: 329, stock: 40, status: 'active', category: 'ملابس', color: 'from-stone-400 to-stone-600' },
];

export const customers: Customer[] = [
  { id: 'C001', name: 'محمد الأحمدي', phone: '+966501234567', city: 'الرياض', totalOrders: 12, totalSpending: 14800, returnsCount: 1, segment: 'vip', lastOrder: '2026-04-09', email: 'm.ahmadi@email.sa', blocked: false },
  { id: 'C002', name: 'سارة العتيبي', phone: '+966502345678', city: 'جدة', totalOrders: 7, totalSpending: 6200, returnsCount: 2, segment: 'regular', lastOrder: '2026-04-09', email: 's.otaibi@email.sa', blocked: false },
  { id: 'C003', name: 'عبدالله الغامدي', phone: '+966503456789', city: 'الدمام', totalOrders: 5, totalSpending: 9100, returnsCount: 0, segment: 'regular', lastOrder: '2026-04-08', email: 'a.ghamdi@email.sa', blocked: false },
  { id: 'C004', name: 'نورة القحطاني', phone: '+966504567890', city: 'مكة المكرمة', totalOrders: 3, totalSpending: 1800, returnsCount: 1, segment: 'new', lastOrder: '2026-04-08', email: 'n.qahtani@email.sa', blocked: false },
  { id: 'C005', name: 'فيصل الشمري', phone: '+966505678901', city: 'المدينة المنورة', totalOrders: 9, totalSpending: 7200, returnsCount: 3, segment: 'inactive', lastOrder: '2026-03-07', email: 'f.shammari@email.sa', blocked: false },
  { id: 'C006', name: 'رنا السبيعي', phone: '+966506789012', city: 'الرياض', totalOrders: 2, totalSpending: 2100, returnsCount: 0, segment: 'new', lastOrder: '2026-04-07', email: 'r.subaie@email.sa', blocked: false },
  { id: 'C007', name: 'خالد الدوسري', phone: '+966507890123', city: 'الطائف', totalOrders: 15, totalSpending: 22400, returnsCount: 2, segment: 'vip', lastOrder: '2026-04-06', email: 'k.dosari@email.sa', blocked: false },
  { id: 'C008', name: 'هدى المالكي', phone: '+966508901234', city: 'جدة', totalOrders: 6, totalSpending: 5800, returnsCount: 1, segment: 'regular', lastOrder: '2026-04-06', email: 'h.maliki@email.sa', blocked: false },
  { id: 'C009', name: 'عمر الزهراني', phone: '+966509012345', city: 'الدمام', totalOrders: 4, totalSpending: 4100, returnsCount: 1, segment: 'regular', lastOrder: '2026-04-05', email: 'o.zahrani@email.sa', blocked: false },
  { id: 'C010', name: 'لمى الحربي', phone: '+966510123456', city: 'الرياض', totalOrders: 8, totalSpending: 9300, returnsCount: 2, segment: 'vip', lastOrder: '2026-04-05', email: 'l.harbi@email.sa', blocked: false },
  { id: 'C011', name: 'تركي العنزي', phone: '+966511234567', city: 'بريدة', totalOrders: 1, totalSpending: 1100, returnsCount: 0, segment: 'new', lastOrder: '2026-04-04', email: 't.anazi@email.sa', blocked: false },
  { id: 'C012', name: 'منيرة الرشيدي', phone: '+966512345678', city: 'مكة المكرمة', totalOrders: 11, totalSpending: 13500, returnsCount: 1, segment: 'vip', lastOrder: '2026-04-04', email: 'm.rashidi@email.sa', blocked: false },
];

export const conversations: Conversation[] = [
  { id: 'conv1', name: 'أحمد سعد', lastMessage: 'عايز اطلب منتج', time: '10:32 ص', unread: 2, avatar: 'أ' },
  { id: 'conv2', name: 'مريم الهاشمي', lastMessage: 'كيف حال الشحنة؟', time: '9:15 ص', unread: 0, avatar: 'م' },
  { id: 'conv3', name: 'سلمان الفارسي', lastMessage: 'شكراً جزيلاً', time: 'أمس', unread: 0, avatar: 'س' },
  { id: 'conv4', name: 'ليلى عبدالرحمن', lastMessage: 'متى يوصل الطلب؟', time: 'أمس', unread: 1, avatar: 'ل' },
  { id: 'conv5', name: 'وليد الصالح', lastMessage: 'هل يوجد خصومات؟', time: 'الأحد', unread: 0, avatar: 'و' },
];

export const messagesByConv: Record<string, Message[]> = {
  conv1: [
    { id: 'm1', text: 'السلام عليكم', sent: false, time: '10:28 ص' },
    { id: 'm2', text: 'وعليكم السلام، أهلاً وسهلاً! كيف أقدر أساعدك؟', sent: true, time: '10:29 ص' },
    { id: 'm3', text: 'عايز اطلب منتج', sent: false, time: '10:32 ص' },
    { id: 'm4', text: 'بكل سرور، أي منتج تريد؟', sent: true, time: '10:33 ص' },
  ],
  conv2: [
    { id: 'm1', text: 'مرحبا، أين طلبي رقم ORD-1002؟', sent: false, time: '9:10 ص' },
    { id: 'm2', text: 'مرحباً! طلبك تم شحنه وسيصل خلال يومين إن شاء الله', sent: true, time: '9:12 ص' },
    { id: 'm3', text: 'كيف حال الشحنة؟', sent: false, time: '9:15 ص' },
  ],
  conv3: [
    { id: 'm1', text: 'استلمت طلبي وكان ممتاز!', sent: false, time: 'أمس' },
    { id: 'm2', text: 'يسعدنا ذلك! نرجو زيارتك مرة أخرى', sent: true, time: 'أمس' },
    { id: 'm3', text: 'شكراً جزيلاً', sent: false, time: 'أمس' },
  ],
  conv4: [
    { id: 'm1', text: 'طلبت منذ 3 أيام', sent: false, time: 'أمس' },
    { id: 'm2', text: 'نعتذر عن التأخير، طلبك قيد التوصيل الآن', sent: true, time: 'أمس' },
    { id: 'm3', text: 'متى يوصل الطلب؟', sent: false, time: 'أمس' },
  ],
  conv5: [
    { id: 'm1', text: 'أنا عميل قديم', sent: false, time: 'الأحد' },
    { id: 'm2', text: 'أهلاً بك! يوجد خصم 10% للعملاء المميزين', sent: true, time: 'الأحد' },
    { id: 'm3', text: 'هل يوجد خصومات؟', sent: false, time: 'الأحد' },
  ],
};

export const shipments: Shipment[] = [
  { id: 'SH001', tracking: 'SMSA123456789', customer: 'محمد الأحمدي', customerId: 'C001', orderId: '#ORD-1001', carrier: 'SMSA', status: 'delivered', city: 'الرياض', date: '2026-04-05', estimatedDelivery: '2026-04-09', cost: 25 },
  { id: 'SH002', tracking: 'ARX987654321', customer: 'سارة العتيبي', customerId: 'C002', orderId: '#ORD-1002', carrier: 'Aramex', status: 'inTransit', city: 'جدة', date: '2026-04-09', estimatedDelivery: '2026-04-12', cost: 30 },
  { id: 'SH003', tracking: 'DHL456789123', customer: 'عبدالله الغامدي', customerId: 'C003', orderId: '#ORD-1003', carrier: 'DHL', status: 'pickedUp', city: 'الدمام', date: '2026-04-08', estimatedDelivery: '2026-04-11', cost: 45 },
  { id: 'SH004', tracking: 'SMSA789123456', customer: 'فيصل الشمري', customerId: 'C005', orderId: '#ORD-1005', carrier: 'SMSA', status: 'failed', city: 'المدينة المنورة', date: '2026-04-03', estimatedDelivery: '2026-04-07', cost: 25 },
  { id: 'SH005', tracking: 'ARX321654987', customer: 'رنا السبيعي', customerId: 'C006', orderId: '#ORD-1006', carrier: 'Aramex', status: 'outForDelivery', city: 'الرياض', date: '2026-04-07', estimatedDelivery: '2026-04-10', cost: 30 },
  { id: 'SH006', tracking: 'DHL654321789', customer: 'خالد الدوسري', customerId: 'C007', orderId: '#ORD-1007', carrier: 'DHL', status: 'delivered', city: 'الطائف', date: '2026-04-04', estimatedDelivery: '2026-04-07', cost: 45 },
  { id: 'SH007', tracking: 'SMSA111222333', customer: 'هدى المالكي', customerId: 'C008', orderId: '#ORD-1008', carrier: 'SMSA', status: 'inTransit', city: 'جدة', date: '2026-04-06', estimatedDelivery: '2026-04-10', cost: 25 },
  { id: 'SH008', tracking: 'ARX444555666', customer: 'تركي العنزي', customerId: 'C011', orderId: '#ORD-1011', carrier: 'Aramex', status: 'pending', city: 'بريدة', date: '2026-04-05', estimatedDelivery: '2026-04-09', cost: 30 },
  { id: 'SH009', tracking: 'DHL777888999', customer: 'لمى الحربي', customerId: 'C010', orderId: '#ORD-1010', carrier: 'DHL', status: 'delivered', city: 'الرياض', date: '2026-04-02', estimatedDelivery: '2026-04-05', cost: 45 },
  { id: 'SH010', tracking: 'SMSA000111222', customer: 'سلطان الشهري', customerId: 'C012', orderId: '#ORD-1013', carrier: 'SMSA', status: 'outForDelivery', city: 'جدة', date: '2026-04-04', estimatedDelivery: '2026-04-08', cost: 25 },
];

export const returns: Return[] = [
  { id: '#RET-001', orderId: '#ORD-0985', customerId: 'C004', customer: 'نورة القحطاني', reason: 'المنتج لا يطابق الوصف', reasonEn: 'Product does not match description', status: 'pending', type: 'refund', amount: 450, refundMethod: 'wallet', inspectionStatus: 'pending', date: '2026-04-09' },
  { id: '#RET-002', orderId: '#ORD-0972', customerId: 'C009', customer: 'عمر الزهراني', reason: 'حجم خاطئ', reasonEn: 'Wrong size', status: 'inspected', type: 'replacement', amount: 680, refundMethod: 'bank', inspectionStatus: 'passed', date: '2026-04-08' },
  { id: '#RET-003', orderId: '#ORD-0961', customerId: 'C012', customer: 'منيرة الرشيدي', reason: 'وصل تالفاً', reasonEn: 'Arrived damaged', status: 'refunded', type: 'refund', amount: 1299, refundMethod: 'bank', inspectionStatus: 'passed', date: '2026-04-07' },
  { id: '#RET-004', orderId: '#ORD-0954', customerId: 'C009', customer: 'بدر المطيري', reason: 'تغيير رأي', reasonEn: 'Change of mind', status: 'rejected', type: 'refund', amount: 399, refundMethod: 'wallet', inspectionStatus: 'failed', date: '2026-04-06' },
  { id: '#RET-005', orderId: '#ORD-0943', customerId: 'C010', customer: 'غدير الجهني', reason: 'منتج معيب', reasonEn: 'Defective product', status: 'pickedUp', type: 'replacement', amount: 749, refundMethod: 'wallet', inspectionStatus: 'pending', date: '2026-04-06' },
  { id: '#RET-006', orderId: '#ORD-0930', customerId: 'C001', customer: 'محمد الأحمدي', reason: 'طلب مكرر', reasonEn: 'Duplicate order', status: 'refunded', type: 'refund', amount: 249, refundMethod: 'bank', inspectionStatus: 'passed', date: '2026-04-05' },
  { id: '#RET-007', orderId: '#ORD-0921', customerId: 'C002', customer: 'سارة العتيبي', reason: 'اللون مختلف', reasonEn: 'Color is different', status: 'pending', type: 'replacement', amount: 329, refundMethod: 'wallet', inspectionStatus: 'pending', date: '2026-04-04' },
  { id: '#RET-008', orderId: '#ORD-0912', customerId: 'C007', customer: 'خالد الدوسري', reason: 'منتج معيب', reasonEn: 'Defective product', status: 'rejected', type: 'refund', amount: 89, refundMethod: 'wallet', inspectionStatus: 'failed', date: '2026-04-03' },
  { id: '#RET-009', orderId: '#ORD-0901', customerId: 'C008', customer: 'هدى المالكي', reason: 'تأخر الشحن', reasonEn: 'Late delivery', status: 'approved', type: 'refund', amount: 1750, refundMethod: 'bank', inspectionStatus: 'pending', date: '2026-04-02' },
  { id: '#RET-010', orderId: '#ORD-0893', customerId: 'C010', customer: 'لمى الحربي', reason: 'المنتج لا يطابق الوصف', reasonEn: 'Product does not match description', status: 'replaced', type: 'replacement', amount: 549, refundMethod: 'wallet', inspectionStatus: 'passed', date: '2026-04-01' },
];

export const teamMembers: TeamMember[] = [
  { id: 'T001', name: 'أحمد بن عبدالله', role: 'admin', email: 'ahmed@mos.sa', status: 'active', lastActive: 'الآن', avatar: 'أ' },
  { id: 'T002', name: 'سلمى الراشد', role: 'manager', email: 'salma@mos.sa', status: 'active', lastActive: 'منذ 5 دقائق', avatar: 'س' },
  { id: 'T003', name: 'يوسف الحميدي', role: 'support', email: 'yousef@mos.sa', status: 'active', lastActive: 'منذ ساعة', avatar: 'ي' },
  { id: 'T004', name: 'ريم العلي', role: 'support', email: 'reem@mos.sa', status: 'active', lastActive: 'منذ 2 ساعة', avatar: 'ر' },
  { id: 'T005', name: 'ماجد السلمان', role: 'manager', email: 'majed@mos.sa', status: 'inactive', lastActive: 'البارحة', avatar: 'م' },
  { id: 'T006', name: 'دانة المحمدي', role: 'viewer', email: 'dana@mos.sa', status: 'active', lastActive: 'منذ 3 ساعات', avatar: 'د' },
  { id: 'T007', name: 'فهد الخالدي', role: 'support', email: 'fahad@mos.sa', status: 'active', lastActive: 'منذ 30 دقيقة', avatar: 'ف' },
  { id: 'T008', name: 'هند الصبيحي', role: 'viewer', email: 'hind@mos.sa', status: 'inactive', lastActive: 'منذ أسبوع', avatar: 'ه' },
];

export const weeklySalesData = [
  { day: 'السبت', dayEn: 'Sat', amount: 12500 },
  { day: 'الأحد', dayEn: 'Sun', amount: 18200 },
  { day: 'الاثنين', dayEn: 'Mon', amount: 15800 },
  { day: 'الثلاثاء', dayEn: 'Tue', amount: 22100 },
  { day: 'الأربعاء', dayEn: 'Wed', amount: 19700 },
  { day: 'الخميس', dayEn: 'Thu', amount: 28400 },
  { day: 'الجمعة', dayEn: 'Fri', amount: 24500 },
];

export const monthlySalesData = [
  { month: 'نوف', monthEn: 'Nov', amount: 85000 },
  { month: 'ديس', monthEn: 'Dec', amount: 112000 },
  { month: 'يناير', monthEn: 'Jan', amount: 95000 },
  { month: 'فبراير', monthEn: 'Feb', amount: 128000 },
  { month: 'مارس', monthEn: 'Mar', amount: 142000 },
  { month: 'أبريل', monthEn: 'Apr', amount: 98000 },
];

export const orderStatusData = [
  { name: 'مكتمل', nameEn: 'Delivered', value: 45, color: '#22c55e' },
  { name: 'مشحون', nameEn: 'Shipped', value: 25, color: '#3b82f6' },
  { name: 'مؤكد', nameEn: 'Confirmed', value: 15, color: '#a855f7' },
  { name: 'جديد', nameEn: 'New', value: 10, color: '#f59e0b' },
  { name: 'ملغى', nameEn: 'Cancelled', value: 5, color: '#ef4444' },
];

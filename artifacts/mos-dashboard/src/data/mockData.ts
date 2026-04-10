export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type ShipmentStatus = 'inTransit' | 'delivered' | 'pending' | 'failed';
export type ReturnStatus = 'pending' | 'approved' | 'rejected';
export type TeamRole = 'admin' | 'manager' | 'support' | 'viewer';
export type MemberStatus = 'active' | 'inactive';

export interface Order {
  id: string;
  customer: string;
  status: OrderStatus;
  price: number;
  date: string;
  city: string;
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
  lastOrder: string;
  email: string;
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
  carrier: string;
  status: ShipmentStatus;
  city: string;
  date: string;
}

export interface Return {
  id: string;
  orderId: string;
  customer: string;
  reason: string;
  reasonEn: string;
  status: ReturnStatus;
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
  { id: '#ORD-1001', customer: 'محمد الأحمدي', status: 'delivered', price: 1250, date: '2026-04-09', city: 'الرياض' },
  { id: '#ORD-1002', customer: 'سارة العتيبي', status: 'shipped', price: 680, date: '2026-04-09', city: 'جدة' },
  { id: '#ORD-1003', customer: 'عبدالله الغامدي', status: 'confirmed', price: 3200, date: '2026-04-08', city: 'الدمام' },
  { id: '#ORD-1004', customer: 'نورة القحطاني', status: 'new', price: 450, date: '2026-04-08', city: 'مكة المكرمة' },
  { id: '#ORD-1005', customer: 'فيصل الشمري', status: 'cancelled', price: 890, date: '2026-04-08', city: 'المدينة المنورة' },
  { id: '#ORD-1006', customer: 'رنا السبيعي', status: 'new', price: 2100, date: '2026-04-07', city: 'الرياض' },
  { id: '#ORD-1007', customer: 'خالد الدوسري', status: 'shipped', price: 560, date: '2026-04-07', city: 'الطائف' },
  { id: '#ORD-1008', customer: 'هدى المالكي', status: 'delivered', price: 1750, date: '2026-04-06', city: 'جدة' },
  { id: '#ORD-1009', customer: 'عمر الزهراني', status: 'confirmed', price: 3900, date: '2026-04-06', city: 'الدمام' },
  { id: '#ORD-1010', customer: 'لمى الحربي', status: 'new', price: 720, date: '2026-04-05', city: 'الرياض' },
  { id: '#ORD-1011', customer: 'تركي العنزي', status: 'shipped', price: 1100, date: '2026-04-05', city: 'بريدة' },
  { id: '#ORD-1012', customer: 'منيرة الرشيدي', status: 'delivered', price: 280, date: '2026-04-04', city: 'مكة المكرمة' },
  { id: '#ORD-1013', customer: 'سلطان الشهري', status: 'confirmed', price: 4500, date: '2026-04-04', city: 'جدة' },
  { id: '#ORD-1014', customer: 'غدير الجهني', status: 'cancelled', price: 660, date: '2026-04-03', city: 'الرياض' },
  { id: '#ORD-1015', customer: 'بدر المطيري', status: 'new', price: 1900, date: '2026-04-03', city: 'الدمام' },
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
  { id: 'C001', name: 'محمد الأحمدي', phone: '+966501234567', city: 'الرياض', totalOrders: 12, lastOrder: '2026-04-09', email: 'm.ahmadi@email.sa' },
  { id: 'C002', name: 'سارة العتيبي', phone: '+966502345678', city: 'جدة', totalOrders: 7, lastOrder: '2026-04-09', email: 's.otaibi@email.sa' },
  { id: 'C003', name: 'عبدالله الغامدي', phone: '+966503456789', city: 'الدمام', totalOrders: 5, lastOrder: '2026-04-08', email: 'a.ghamdi@email.sa' },
  { id: 'C004', name: 'نورة القحطاني', phone: '+966504567890', city: 'مكة المكرمة', totalOrders: 3, lastOrder: '2026-04-08', email: 'n.qahtani@email.sa' },
  { id: 'C005', name: 'فيصل الشمري', phone: '+966505678901', city: 'المدينة المنورة', totalOrders: 9, lastOrder: '2026-04-07', email: 'f.shammari@email.sa' },
  { id: 'C006', name: 'رنا السبيعي', phone: '+966506789012', city: 'الرياض', totalOrders: 2, lastOrder: '2026-04-07', email: 'r.subaie@email.sa' },
  { id: 'C007', name: 'خالد الدوسري', phone: '+966507890123', city: 'الطائف', totalOrders: 15, lastOrder: '2026-04-06', email: 'k.dosari@email.sa' },
  { id: 'C008', name: 'هدى المالكي', phone: '+966508901234', city: 'جدة', totalOrders: 6, lastOrder: '2026-04-06', email: 'h.maliki@email.sa' },
  { id: 'C009', name: 'عمر الزهراني', phone: '+966509012345', city: 'الدمام', totalOrders: 4, lastOrder: '2026-04-05', email: 'o.zahrani@email.sa' },
  { id: 'C010', name: 'لمى الحربي', phone: '+966510123456', city: 'الرياض', totalOrders: 8, lastOrder: '2026-04-05', email: 'l.harbi@email.sa' },
  { id: 'C011', name: 'تركي العنزي', phone: '+966511234567', city: 'بريدة', totalOrders: 1, lastOrder: '2026-04-04', email: 't.anazi@email.sa' },
  { id: 'C012', name: 'منيرة الرشيدي', phone: '+966512345678', city: 'مكة المكرمة', totalOrders: 11, lastOrder: '2026-04-04', email: 'm.rashidi@email.sa' },
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
  { id: 'SH001', tracking: 'SMSA123456789', customer: 'محمد الأحمدي', carrier: 'SMSA', status: 'delivered', city: 'الرياض', date: '2026-04-09' },
  { id: 'SH002', tracking: 'ARX987654321', customer: 'سارة العتيبي', carrier: 'Aramex', status: 'inTransit', city: 'جدة', date: '2026-04-09' },
  { id: 'SH003', tracking: 'DHL456789123', customer: 'عبدالله الغامدي', carrier: 'DHL', status: 'pending', city: 'الدمام', date: '2026-04-08' },
  { id: 'SH004', tracking: 'SMSA789123456', customer: 'فيصل الشمري', carrier: 'SMSA', status: 'failed', city: 'المدينة المنورة', date: '2026-04-07' },
  { id: 'SH005', tracking: 'ARX321654987', customer: 'رنا السبيعي', carrier: 'Aramex', status: 'inTransit', city: 'الرياض', date: '2026-04-07' },
  { id: 'SH006', tracking: 'DHL654321789', customer: 'خالد الدوسري', carrier: 'DHL', status: 'delivered', city: 'الطائف', date: '2026-04-06' },
  { id: 'SH007', tracking: 'SMSA111222333', customer: 'هدى المالكي', carrier: 'SMSA', status: 'inTransit', city: 'جدة', date: '2026-04-06' },
  { id: 'SH008', tracking: 'ARX444555666', customer: 'تركي العنزي', carrier: 'Aramex', status: 'pending', city: 'بريدة', date: '2026-04-05' },
  { id: 'SH009', tracking: 'DHL777888999', customer: 'لمى الحربي', carrier: 'DHL', status: 'delivered', city: 'الرياض', date: '2026-04-05' },
  { id: 'SH010', tracking: 'SMSA000111222', customer: 'سلطان الشهري', carrier: 'SMSA', status: 'inTransit', city: 'جدة', date: '2026-04-04' },
];

export const returns: Return[] = [
  { id: '#RET-001', orderId: '#ORD-0985', customer: 'نورة القحطاني', reason: 'المنتج لا يطابق الوصف', reasonEn: 'Product does not match description', status: 'pending', date: '2026-04-09' },
  { id: '#RET-002', orderId: '#ORD-0972', customer: 'عمر الزهراني', reason: 'حجم خاطئ', reasonEn: 'Wrong size', status: 'approved', date: '2026-04-08' },
  { id: '#RET-003', orderId: '#ORD-0961', customer: 'منيرة الرشيدي', reason: 'وصل تالفاً', reasonEn: 'Arrived damaged', status: 'approved', date: '2026-04-07' },
  { id: '#RET-004', orderId: '#ORD-0954', customer: 'بدر المطيري', reason: 'تغيير رأي', reasonEn: 'Change of mind', status: 'rejected', date: '2026-04-06' },
  { id: '#RET-005', orderId: '#ORD-0943', customer: 'غدير الجهني', reason: 'منتج معيب', reasonEn: 'Defective product', status: 'pending', date: '2026-04-06' },
  { id: '#RET-006', orderId: '#ORD-0930', customer: 'محمد الأحمدي', reason: 'طلب مكرر', reasonEn: 'Duplicate order', status: 'approved', date: '2026-04-05' },
  { id: '#RET-007', orderId: '#ORD-0921', customer: 'سارة العتيبي', reason: 'اللون مختلف', reasonEn: 'Color is different', status: 'pending', date: '2026-04-04' },
  { id: '#RET-008', orderId: '#ORD-0912', customer: 'خالد الدوسري', reason: 'منتج معيب', reasonEn: 'Defective product', status: 'rejected', date: '2026-04-03' },
  { id: '#RET-009', orderId: '#ORD-0901', customer: 'هدى المالكي', reason: 'تأخر الشحن', reasonEn: 'Late delivery', status: 'pending', date: '2026-04-02' },
  { id: '#RET-010', orderId: '#ORD-0893', customer: 'لمى الحربي', reason: 'المنتج لا يطابق الوصف', reasonEn: 'Product does not match description', status: 'approved', date: '2026-04-01' },
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

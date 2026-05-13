-- Seed data: example bookings for today and surrounding days
-- Adjust the dates relative to CURRENT_DATE

insert into public.bookings (customer_name, court_number, booking_date, start_time, end_time, note, color) values

-- Today
('สมชาย ใจดี',      1, CURRENT_DATE, '10:00', '11:30', 'ฝึกซ้อมทีม',  '#DBEAFE'),
('วิภา รัตนมณี',    2, CURRENT_DATE, '10:30', '12:00', null,           '#D1FAE5'),
('ณัฐพล สุขสันต์',  3, CURRENT_DATE, '11:00', '12:30', 'ซ้อมก่อนแข่ง', '#FEF3C7'),
('ปิยะ มงคลชัย',    4, CURRENT_DATE, '13:00', '15:00', null,           '#EDE9FE'),
('กมลา เพ็ชรสว่าง', 5, CURRENT_DATE, '14:00', '16:00', 'จองประจำ',     '#FCE7F3'),
('ธนพล วิริยะ',     6, CURRENT_DATE, '15:30', '17:00', null,           '#CFFAFE'),
('อรทัย สมบูรณ์',   1, CURRENT_DATE, '17:00', '18:30', null,           '#FEE2E2'),
('ชาญวิทย์ แก้วดี', 2, CURRENT_DATE, '18:00', '20:00', 'แมตช์เพื่อน',  '#FFF7ED'),
('ลลิตา นพรัตน์',   3, CURRENT_DATE, '19:00', '21:00', null,           '#ECFDF5'),
('มนัส เจริญสุข',   4, CURRENT_DATE, '19:30', '21:00', 'ฝึกซ้อม',      '#F0F9FF'),
('สุภา ทองดี',      5, CURRENT_DATE, '20:00', '22:00', null,           '#FDF4FF'),
('ประยูร เมืองงาม', 6, CURRENT_DATE, '20:30', '22:00', null,           '#FFF1F2'),

-- Yesterday
('วีระ ชัยภูมิ',    1, CURRENT_DATE - 1, '10:00', '12:00', null,           '#DBEAFE'),
('นลินี สุวรรณ',    2, CURRENT_DATE - 1, '11:00', '12:30', 'จองประจำ',     '#D1FAE5'),
('อนุชา บุญมา',     3, CURRENT_DATE - 1, '14:00', '16:00', null,           '#FEF3C7'),
('ทิพวรรณ พงษ์เพ็ง',4, CURRENT_DATE - 1, '16:00', '18:00', null,           '#EDE9FE'),
('ภัทรพล สกุลวงศ์', 5, CURRENT_DATE - 1, '18:00', '20:00', 'แมตช์',        '#FCE7F3'),
('สาวิตรี ศรีสุข',  6, CURRENT_DATE - 1, '19:00', '21:00', null,           '#CFFAFE'),

-- Day before yesterday
('จตุรงค์ เกษม',    1, CURRENT_DATE - 2, '10:00', '11:00', null,           '#DBEAFE'),
('มาลี ดอกไม้',     2, CURRENT_DATE - 2, '13:00', '15:00', null,           '#D1FAE5'),
('ศิริพร ทรัพย์มาก',3, CURRENT_DATE - 2, '15:00', '17:00', 'ฝึกซ้อม',      '#FEF3C7'),
('กิตติ โสมาลี',    4, CURRENT_DATE - 2, '17:00', '19:00', null,           '#EDE9FE'),
('ปรีชา วิชัย',     5, CURRENT_DATE - 2, '19:00', '21:00', null,           '#FCE7F3'),

-- Tomorrow
('ณัฐธิดา แสงทอง',  1, CURRENT_DATE + 1, '10:00', '12:00', 'จองล่วงหน้า',  '#DBEAFE'),
('อิทธิพล มณีรัตน์',2, CURRENT_DATE + 1, '11:00', '13:00', null,           '#D1FAE5'),
('ชลิดา เพชรงาม',   3, CURRENT_DATE + 1, '14:00', '16:00', null,           '#FEF3C7'),
('วรรณิษา เกิดมณี', 4, CURRENT_DATE + 1, '16:00', '18:00', 'แข่งรอบคัดเลือก','#EDE9FE'),
('สมบัติ ใจเย็น',   5, CURRENT_DATE + 1, '18:00', '20:00', null,           '#FCE7F3'),
('ดวงใจ รุ่งเรือง',  6, CURRENT_DATE + 1, '20:00', '22:00', null,           '#CFFAFE'),

-- 3 days ago
('เกรียงไกร วงษ์ศา', 1, CURRENT_DATE - 3, '11:00', '13:00', null,          '#DBEAFE'),
('นันทิยา สายทอง',   2, CURRENT_DATE - 3, '14:00', '16:00', 'จองประจำ',    '#D1FAE5'),
('พิชัย อินทรา',     3, CURRENT_DATE - 3, '16:00', '17:30', null,          '#FEF3C7'),
('รัตนา สุขสม',      4, CURRENT_DATE - 3, '18:00', '20:00', null,          '#EDE9FE'),
('ธีรพัฒน์ มานะ',    5, CURRENT_DATE - 3, '20:00', '22:00', null,          '#FCE7F3');

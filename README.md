# CHAMPA LAIYVAN — Loan Management System

ລະບົບຄຸ້ມຄອງເງິນກູ້ (Loan Management System) ສ້າງດ້ວຍ React + Vite + Tailwind CSS.

ຄອບຄຸມ 5 ໂມດູນ:
1. ຜູ້ໃຊ້ ແລະ ສິດການເຂົ້າເຖິງ (Login/Register + RBAC: Admin / Loan Officer / Customer)
2. ຂໍ້ມູນລູກຄ້າ (KYC) ແລະ ຄຳຮ້ອງກູ້ເງິນ + ຂັ້ນຕອນອະນຸມັດ (Pending → Approved/Rejected → Disbursed)
3. ການຄິດໄລ່ດອກເບ້ຍ (Flat Rate / Effective Rate) ແລະ ຕາຕະລາງຊຳລະ (Amortization) ພ້ອມຄ່າປັບໄໝອັດຕະໂນມັດ
4. ບັນທຶກການຊຳລະ (ເງິນສົດ/ໂອນທະນາຄານ) + OCR ສລິບ (ຈຳລອງ) + ການແຈ້ງເຕືອນ
5. Dashboard, ລາຍງານໜີ້ເກີນກຳນົດ (NPL) ແລະ Export CSV / Excel / PDF

## ການຕິດຕັ້ງ (Setup)

```bash
npm install
npm run dev
```

ຈາກນັ້ນເປີດ `http://localhost:5173`

Build ສຳລັບ production:
```bash
npm run build
npm run preview
```

## ບັນຊີທົດລອງ (Demo accounts)

| ບົດບາດ | ອີເມວ/ເບີໂທ | ລະຫັດຜ່ານ |
|---|---|---|
| Administrator | admin@laoloan.la | admin123 |
| Loan Officer | officer@laoloan.la | officer123 |
| Customer | 020 5555 1234 | customer123 |

## ການເກັບຂໍ້ມູນ (Data storage)

ແອັບນີ້ໃຊ້ `localStorage` ຂອງ browser ເປັນບ່ອນເກັບຂໍ້ມູນຈຳລອງ (users, ຄຳຮ້ອງກູ້, ການຊຳລະ) — **ບໍ່ແມ່ນ database ແທ້**. ນີ້ເໝາະສຳລັບ demo/prototype ເທົ່ານັ້ນ.

ສຳລັບໃຊ້ງານຈິງ (production) ຄວນ:
- ປ່ຽນຈາກ `localStorage` ໄປໃຊ້ Backend API ຈິງ (Node.js/Express, PostgreSQL ຫຼືອື່ນໆ) — ໂຄ້ດຢູ່ໃນ `src/App.jsx` ໃນສ່ວນ `/* Storage adapter */` ອອກແບບໃຫ້ແທນທີ່ໄດ້ງ່າຍ
- ເພີ່ມການເຂົ້າລະຫັດ (hash) ລະຫັດຜ່ານ ແທນ plain text
- ເຊື່ອມ Google OAuth ຈິງ ແທນປຸ່ມຈຳລອງ
- ເຊື່ອມ OCR API ຈິງ (ເຊັ່ນ Google Vision, AWS Textract) ແທນການຈຳລອງ
- ເຊື່ອມ SMS/LINE/WhatsApp gateway ຈິງສຳລັບການແຈ້ງເຕືອນ

## ໂຄງສ້າງໂປຣເຈັກ

```
├── src/
│   ├── App.jsx        # Component ຫຼັກ (ໂຄ້ດທັງໝົດຂອງລະບົບ)
│   ├── main.jsx        # Entry point
│   └── index.css       # Tailwind directives
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- lucide-react (icons)
- xlsx / SheetJS (Excel export)

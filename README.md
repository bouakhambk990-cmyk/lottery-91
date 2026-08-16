# 🔢 Number Splitter Pro

ເວັບແອັບພລິເຄຊັນສຳລັບຈັດການ, ແຍກຕົວເລກ 2 ໂຕ ແລະ 3 ໂຕ ອັດຕະໂນມັດ ພ້ອມຮອງຮັບ OCR ອ່ານຮູບປີ້, ການແປງລາຄາພາສາລາວ, ລະບົບເພດານເງິນ ແລະ ການ Export ເປັນ Excel/PDF.

## 🌟 ຄຸນສົມບັດຫຼັກ (Features)

* 📸 **Fast OCR Reader**: ອ່ານຕົວເລກຈາກຮູບປີ້ດ້ວຍຄວາມໄວສູງຜ່ານ Tesseract.js (Eng Mode).
* 💰 **Lao Price Parser**: ຮອງຮັບການອ່ານລາຄາພາສາລາວອັດຕະໂນມັດ:
  * `1ລ້ານ` ➔ `1,000`
  * `1ລ້ານ5ແສນ` ➔ `1,500`
  * `10ລ້ານ3ແສນ` ➔ `10,300`
* 🔄 **Multi-Format Calculation**: ຮອງຮັບຮູບແບບ `10*20` (ບົນ-ລ່າງ), `10x10`, ແລະ ຄຳວ່າ `ບົນລ່າງ / ບລ / บนล่าง`.
* ⚠️ **Limit Warning System**: ຕັ້ງເພດານເງິນສູງສຸດຕໍ່ເລກ ພ້ອມສະແດງເບື້ອງຕົ້ນດ້ວຍສີເຕືອນ (ສີເຫຼືອງ/ສີແດງ).
* 📊 **Multi-Currency & Modes**: ແຍກສະກຸນເງິນ (ກີບ ₭ / ບາດ ฿) ແລະ ແຍກແທັບເລກ 2 ໂຕ (00–99) / 3 ໂຕ (000–999).
* 📤 **Export Capabilities**: ສາມາດດາວໂຫລດລາຍງານເປັນ **Excel (`.xlsx`)** ແລະ **PDF (`.pdf`)** ໄດ້ທັນທີ.

## 🚀 ການຕິດຕັ້ງ ແລະ ໃຊ້ງານ (Deployment)

### GitHub Pages (ແນະນຳ)
1. ສ້າງ Repository ໃໝ່ໃນ GitHub.
2. Upload ໄຟລ໌ `index.html`, `README.md`, ແລະ `LICENSE` ຂຶ້ນ Repository.
3. ໄປທີ່ **Settings > Pages** ຂອງ Repository.
4. ເລືອກ Branch ເປັນ `main` (ຫຼື `master`) ແລ້ວກົດ **Save**.
5. ເວັບໄຊຈະພ້ອມໃຊ້ງານຜ່ານ GitHub Pages Domain ທັນທີ.

### Google Apps Script (GAS)
1. ເປີດ [script.google.com](https://script.google.com).
2. ສ້າງໂຄງການໃໝ່.
3. ວາງໂຄດຈາກ `Code.gs` ລົງໃນໄຟລ໌ `Code.gs`.
4. ສ້າງໄຟລ໌ HTML ໃໝ່ຊື່ `index.html` ແລ້ວນຳໂຄດ UI ໄປວາງ.
5. ກົດ **Deploy > New deployment** ເລືອກປະເພດ **Web app**.

## 📄 License

ໂຄງການນີ້ຢູ່ພາຍໃຕ້ [MIT License](LICENSE).

# UI Test Report — MyHealth App

**Date:** 2026-06-30
**Tested viewports:** 375px (iPhone SE), 768px (iPad), 1280px (Desktop)
**Tested modes:** Light + Dark

---

## Bugs Found & Fixed

### BUG-001: Exercise Form — ชื่อท่าล้นออกจากหน้าจอ (Critical)
- **File:** `src/components/exercise/ExerciseForm.jsx`
- **Cause:** ใช้ `grid-cols-[1fr_auto_auto_auto_auto]` ยัด 5 คอลัมน์ในแถวเดียว — ช่องชื่อท่า (1fr) ถูกบีบเหลือ ~100px บน 375px เพราะ 3 ช่อง `w-16` (64px each) + ปุ่มลบ `w-8` กิน ~230px
- **Fix:** แยก layout เป็น 2 แถว — ชื่อท่าแถวบน (full width) + เซ็ต/เรป/kg แถวล่าง (grid-cols-3) ครอบด้วย card bg สำหรับ visual grouping
- **Status:** Fixed

### BUG-002: Food Form — Calorie input + 4 meal buttons ล้นบน mobile (Medium)
- **File:** `src/components/food/FoodForm.jsx`
- **Cause:** ใส่ calorie input + segmented control (4 ปุ่ม) ใน flex row เดียว — รวม ~400px+ ล้น 375px viewport
- **Fix:** แยก calorie input เป็นแถวเดี่ยว, meal type เป็น segmented control เต็มแถว ใช้ `flex-1` ให้ปุ่มแบ่ง width เท่ากัน
- **Status:** Fixed

---

## Test Results by Page

### 1. Dashboard (`/`)
| Test Case | 375px | 768px | 1280px | Status |
|---|---|---|---|---|
| Summary cards 3 คอลัมน์ไม่ล้น | OK | OK | OK | Pass |
| ข้อความยาวใน food/exercise list ถูก truncate | OK | OK | OK | Pass |
| Loading spinner แสดงขณะโหลดข้อมูล | OK | OK | OK | Pass |
| Empty state แสดงเมื่อไม่มีข้อมูล | OK | OK | OK | Pass |
| Dark mode contrast อ่านได้ชัด | OK | OK | OK | Pass |

### 2. Weight Page (`/weight`)
| Test Case | 375px | 768px | 1280px | Status |
|---|---|---|---|---|
| Form input น้ำหนัก + หมายเหตุ ไม่ล้น | OK | OK | OK | Pass |
| Chart responsive ปรับตาม container | OK | OK | OK | Pass |
| Chart range toggle (7/30/90 วัน) | OK | OK | OK | Pass |
| History list ข้อมูลยาวถูก truncate | OK | OK | OK | Pass |
| ปุ่มลบ hover show/hide | OK | OK | OK | Pass |

### 3. Food Page (`/food`)
| Test Case | 375px | 768px | 1280px | Status |
|---|---|---|---|---|
| Date picker ไม่ล้น | OK | OK | OK | Pass |
| Meal type segmented control แบ่งเท่ากัน | OK | OK | OK | Pass |
| Food list grouped by meal type | OK | OK | OK | Pass |
| Total calories แสดงถูกต้อง | OK | OK | OK | Pass |
| ชื่ออาหารยาวถูก truncate | OK | OK | OK | Pass |

### 4. Exercise Page (`/exercise`)
| Test Case | 375px | 768px | 1280px | Status |
|---|---|---|---|---|
| Category toggle (Weight/Cardio) | OK | OK | OK | Pass |
| Sub-type pills ไม่ล้น (flex-wrap) | OK | OK | OK | Pass |
| ชื่อท่า input full width ไม่ล้น | OK | OK | OK | Pass |
| เซ็ต/เรป/kg grid 3 คอลัมน์เท่ากัน | OK | OK | OK | Pass |
| เพิ่ม/ลบท่า ทำงานปกติ | OK | OK | OK | Pass |
| Cardio — ช่องความชันแสดงเมื่อเลือกเดินชัน | OK | OK | OK | Pass |
| Exercise list Weight/Cardio แยก section | OK | OK | OK | Pass |
| ปุ่มลบ hover show/hide | OK | OK | OK | Pass |

### 5. Layout & Navigation
| Test Case | 375px | 768px | 1280px | Status |
|---|---|---|---|---|
| Bottom nav แสดงบน mobile, ซ่อนบน desktop | OK | N/A | N/A | Pass |
| Sidebar แสดงบน desktop, ซ่อนบน mobile | N/A | OK | OK | Pass |
| Content ไม่ถูกบัง bottom nav (pb-24) | OK | N/A | N/A | Pass |
| Active state highlight ถูก tab | OK | OK | OK | Pass |
| Page ไม่มี horizontal scroll | OK | OK | OK | Pass |

### 6. Global
| Test Case | Status |
|---|---|
| Dark mode detect จาก prefers-color-scheme | Pass |
| Number input spinner ถูกซ่อน | Pass |
| overflow-x-hidden ที่ html/body/#root | Pass |
| Build production สำเร็จ (no errors) | Pass |

---

## Overflow Prevention Checklist

- [x] `overflow-x: hidden` on `html`, `body`, `#root`
- [x] `min-w-0` on all flex children that contain text
- [x] `truncate` on text that might overflow
- [x] `whitespace-nowrap` on numeric labels
- [x] `shrink-0` on fixed-size elements (buttons, badges)
- [x] `flex-wrap` on pill/tag groups
- [x] No fixed-width inputs on mobile (use grid-cols or flex-1)
- [x] `max-w-xl` constrains main content area

# 🎨 KrishiDirect - Visual Flow Guide

## 🏠 Application Structure

```
┌─────────────────────────────────────────────────────┐
│          KRISHIDIRECT NAVIGATION BAR                │
│  [Logo] Home Products Dashboard  [👋 User | Logout] │
└─────────────────────────────────────────────────────┘
```

## 🔐 User Journey Maps

### 1. New User Registration Flow

```
┌──────────────┐
│  Landing     │
│  Page (/)    │
│              │
│  "Get        │
│  Started" ───────┐
└──────────────┘   │
                   ▼
            ┌──────────────┐
            │  Sign Up     │
            │  /signup     │
            │              │
            │  Choose Role:│
            │  ○ Farmer    │
            │  ○ Buyer     │
            │              │
            │  [Register]  │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  Login &     │
            │  Redirect    │
            │  to Home     │
            └──────────────┘
```

### 2. Farmer's Complete Workflow

```
┌─────────────────────────────────────────────────┐
│  FARMER DASHBOARD (/dashboard)                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Quick Stats                                 │
│  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │   5    │  │   2    │  │  12    │           │
│  │Active  │  │  New   │  │ Total  │           │
│  │Listings│  │ Orders │  │Orders  │           │
│  └────────┘  └────────┘  └────────┘           │
│                                                 │
│  [+ Add New Crop Listing]                      │
│                                                 │
│  🔔 New Orders Awaiting Response               │
│  ┌───────────────────────────────────────────┐ │
│  │ Order #ORD-12345          ₹450.00         │ │
│  │ Organic Tomatoes - 10 kg @ ₹45/kg        │ │
│  │ [✓ Accept Order]  [✗ Reject]             │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  🌾 Your Active Listings                       │
│  ┌──────┐  ┌──────┐  ┌──────┐                 │
│  │[IMG] │  │[IMG] │  │[IMG] │                 │
│  │Tomato│  │Wheat │  │Rice  │                 │
│  │₹45/kg│  │₹30/kg│  │₹40/kg│                 │
│  └──────┘  └──────┘  └──────┘                 │
└─────────────────────────────────────────────────┘
```

**Add New Product Flow:**
```
Dashboard
    │
    │ Click [+ Add New Crop Listing]
    ▼
┌─────────────────────────────────────┐
│  ADD LISTING (/products/new)        │
├─────────────────────────────────────┤
│  Crop Name: [____________]          │
│  Category:  [Vegetables  ▼]         │
│  Description: [____________]        │
│  Price:     [₹ __] Unit: [kg ▼]    │
│  Quantity:  [__] kg                 │
│  Location:  [____________]          │
│  Image URL: [____________]          │
│                                     │
│  [Image Preview]                    │
│                                     │
│  [✓ Create Listing]  [Cancel]      │
└─────────────────────────────────────┘
    │
    │ Submit
    ▼
Returns to Dashboard with new listing visible
```

### 3. Buyer's Complete Workflow

```
┌─────────────────────────────────────────────────┐
│  BUYER DASHBOARD (/dashboard)                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Quick Stats                                 │
│  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │   8    │  │   3    │  │   5    │           │
│  │ Total  │  │Pending │  │Accepted│           │
│  │Orders  │  │ Orders │  │ Orders │           │
│  └────────┘  └────────┘  └────────┘           │
│                                                 │
│  [🌾 Browse Marketplace]                        │
│                                                 │
│  📦 Your Orders                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Order #ORD-12345    ₹450.00  [PENDING]   │ │
│  │ Tomatoes - 10 kg @ ₹45/kg                │ │
│  │ Dec 13, 2025                             │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Order #ORD-12344    ₹200.00  [ACCEPTED]  │ │
│  │ Wheat - 5 kg @ ₹40/kg                    │ │
│  │ Dec 12, 2025                             │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Browse & Order Flow:**
```
Dashboard
    │
    │ Click [Browse Marketplace]
    ▼
┌─────────────────────────────────────────────────┐
│  PRODUCTS MARKETPLACE (/products)               │
├─────────────────────────────────────────────────┤
│  🔍 Search: [_________________]                 │
│                                                 │
│  Category: [All] [Vegetables] [Fruits] ...      │
│  Price: [All] [<₹50] [₹50-200] [>₹200]         │
│                                                 │
│  Showing 8 of 15 products                       │
│                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ [IMAGE] │  │ [IMAGE] │  │ [IMAGE] │         │
│  │ Tomatoes│  │ Wheat   │  │ Rice    │         │
│  │ ₹45/kg  │  │ ₹30/kg  │  │ ₹40/kg  │         │
│  │ 100 kg  │  │ 50 kg   │  │ 80 kg   │         │
│  │ 👨‍🌾 Rajesh │  │ 👨‍🌾 Kumar  │  │ 👨‍🌾 Singh  │         │
│  │ 📍Nashik │  │ 📍Punjab│  │ 📍 UP   │         │
│  │         │  │         │  │         │         │
│  │[🛒 Order]│  │[🛒 Order]│  │[🛒 Order]│         │
│  └─────────┘  └─────────┘  └─────────┘         │
└─────────────────────────────────────────────────┘
```

**In-Card Order Flow:**
```
Click [🛒 Place Order]
         ▼
┌───────────────────────┐
│  Order Quantity       │
│  [−] [5] [+]          │
│  Total: ₹225.00       │
│  [Confirm] [Cancel]   │
└───────────────────────┘
         │
         │ Click [Confirm]
         ▼
┌───────────────────────┐
│ ✓ Order placed!       │
│ Check dashboard       │
└───────────────────────┘
```

### 4. Complete Order Lifecycle

```
┌─────────────┐
│   BUYER     │
│  Creates    │──────┐
│   Order     │      │
└─────────────┘      │
                     │
                     ▼
              ┌─────────────┐
              │  DATABASE   │
              │   Order:    │
              │  PENDING    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │ NOTIFICATION│
              │   Sent to   │
              │   Farmer    │
              └──────┬──────┘
                     │
         ┌───────────┴────────────┐
         │                        │
         ▼                        ▼
  ┌─────────────┐         ┌─────────────┐
  │   FARMER    │         │   FARMER    │
  │  Accepts    │         │  Rejects    │
  │   Order     │         │   Order     │
  └──────┬──────┘         └──────┬──────┘
         │                       │
         ▼                       ▼
  ┌─────────────┐         ┌─────────────┐
  │  Order:     │         │  Order:     │
  │  ACCEPTED   │         │  REJECTED   │
  └──────┬──────┘         └──────┬──────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
              ┌─────────────┐
              │    BUYER    │
              │  Dashboard  │
              │   Updates   │
              └─────────────┘
```

## 🎨 UI Component Breakdown

### Product Card Anatomy
```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │      [PRODUCT IMAGE]        │ │
│ │      200px height           │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│  Organic Tomatoes    [Veg]      │
│  Fresh from farm...             │
│                                 │
│  ₹45/kg                         │
│  100 kg available               │
│                                 │
│  ───────────────────────────    │
│  👨‍🌾 Rajesh Kumar • 📍 Nashik    │
│                                 │
│  ┌─────────────────────────┐   │
│  │    🛒 Place Order       │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Filter Panel Design
```
┌─────────────────────────────────────────┐
│  🔍 [Search crops, location...      ]   │
│                                         │
│  Category                               │
│  [All] [Vegetables] [Fruits] [Grains]  │
│  [Pulses] [Spices] [Dairy] [Other]     │
│                                         │
│  Price Range                            │
│  [All] [Under ₹50] [₹50-200] [>₹200]   │
└─────────────────────────────────────────┘
```

### Order Card States

**Pending Order (Farmer View):**
```
┌─────────────────────────────────────┐
│ 🟡 Order #ORD-12345      ₹450.00   │
│                                     │
│ Organic Tomatoes                    │
│ 10 kg @ ₹45/kg                      │
│ Dec 13, 2025                        │
│                                     │
│ [✓ Accept Order]    [✗ Reject]     │
└─────────────────────────────────────┘
```

**Order History (Buyer View):**
```
┌─────────────────────────────────────┐
│ Order #ORD-12345        ₹450.00     │
│                         [PENDING]   │
│                                     │
│ Tomatoes - 10 kg @ ₹45/kg          │
│ Dec 13, 2025                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Order #ORD-12344        ₹200.00     │
│                         [ACCEPTED]  │
│                                     │
│ Wheat - 5 kg @ ₹40/kg              │
│ Dec 12, 2025                        │
└─────────────────────────────────────┘
```

## 🎯 Interactive Elements

### Button Hierarchy
1. **Primary Actions** (Green gradient):
   - "Get Started", "Create Listing", "Confirm Order", "Accept Order"
   
2. **Secondary Actions** (Transparent with border):
   - "Cancel", "Logout"
   
3. **Destructive Actions** (Red):
   - "Reject Order"

4. **Filter Pills** (Rounded, toggleable):
   - Category badges, Price ranges

### Color System
```
Primary:    #2F9E44 → #4CAF50 (Green gradient)
Success:    #059669 (Emerald)
Warning:    #F59E0B (Amber) - Pending orders
Error:      #EF4444 (Red) - Reject
Neutral:    #6B7280 (Gray) - Text
Background: #F9FAFB (Light gray)
```

## 📱 Responsive Behavior

```
Desktop (>1200px)
┌────────────────────────────────────┐
│  Products in 3-4 columns           │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │      │ │      │ │      │       │
│  └──────┘ └──────┘ └──────┘       │
└────────────────────────────────────┘

Tablet (768px-1200px)
┌────────────────────────────┐
│  Products in 2-3 columns   │
│  ┌──────┐ ┌──────┐         │
│  │      │ │      │         │
│  └──────┘ └──────┘         │
└────────────────────────────┘

Mobile (<768px)
┌──────────────────┐
│  Products stack  │
│  ┌────────────┐  │
│  │            │  │
│  └────────────┘  │
│  ┌────────────┐  │
│  │            │  │
│  └────────────┘  │
└──────────────────┘
```

## 🚀 Animation & Interactions

### Hover Effects
- **Cards**: `translateY(-4px)` lift
- **Buttons**: Slight opacity change
- **Links**: Color transition

### Transitions
- All: `transition: 0.2s ease`
- Smooth state changes
- Loading spinners for async operations

### Form Validation
- Real-time error messages
- Disabled states during submission
- Success feedback before redirect

---

This visual guide represents the complete user experience across all roles and features! 🎨✨

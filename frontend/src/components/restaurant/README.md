# Restaurant Components Documentation

## Overview

These components provide a comprehensive UI for displaying detailed restaurant information in the VietDine application. They follow a modular architecture for easy reusability and maintenance.

## Components

### 1. **HeroSection** (`HeroSection.tsx`)

The main hero section displaying the restaurant's featured image, name, and key information.

**Props:**

- `name`: string - Restaurant name
- `imageUrl`: string - Featured image URL
- `rating`: number | string - Average rating
- `reviewCount`: number - Total number of reviews
- `restaurantId`: number - Restaurant ID for save functionality
- `initialSaved`: boolean - Whether restaurant is initially saved

**Features:**

- Large background image with zoom effect on hover
- Gradient overlay
- Rating badge
- Save button
- Action buttons (Contact, Reserve)

### 2. **RestaurantDescription** (`RestaurantDescription.tsx`)

Displays detailed description and feature icons for the restaurant.

**Props:**

- `description`: string - Restaurant description
- `features`: object (optional)
  - `wifi`: boolean
  - `temple`: boolean
  - `wine`: boolean

### 3. **MenuSection** (`MenuSection.tsx`)

Displays restaurant menu items in a grid format.

**Props:**

- `title`: string (default: '季節の献立') - Section title
- `subtitle`: string (default: '旬の味覚') - Section subtitle
- `items`: MenuItem[] - Array of menu items

**MenuItem Structure:**

```typescript
{
  id?: number;
  dishNameJp: string;
  dishNameVn?: string;
  imageUrl?: string;
  price?: number;
  description?: string;
  tags?: string[];
}
```

### 4. **ReviewsSection** (`ReviewsSection.tsx`)

Displays customer reviews and ratings.

**Props:**

- `reviews`: Review[] - Array of reviews
- `totalReviews`: number (optional) - Total review count

**Review Structure:**

```typescript
{
  id?: number;
  user?: {
    fullName: string;
    avatarUrl?: string;
  };
  rating: number;
  comment?: string;
  createdAt?: string;
}
```

### 5. **LocationInfoCard** (`LocationInfoCard.tsx`)

Displays restaurant location, hours, and budget information.

**Props:**

- `address`: string - Restaurant address
- `mapImageUrl`: string (optional) - Map image URL
- `openingHours`: string (optional) - Opening hours
- `isOpen`: boolean (default: false) - Current open status
- `budgetRange`: string (optional) - Budget range

### 6. **SafetyInfoCard** (`SafetyInfoCard.tsx`)

Displays allergen information and dietary options.

**Props:**

- `items`: SafetyInfoItem[] (optional) - Custom info items

### 7. **ReservationCard** (`ReservationCard.tsx`)

Displays reservation button.

**Props:**

- `onReserve`: function (optional) - Callback when reserve button is clicked
- `isDisabled`: boolean (default: false) - Disable button state

## Usage Example

```typescript
import {
  HeroSection,
  RestaurantDescription,
  MenuSection,
  ReviewsSection,
  LocationInfoCard,
  SafetyInfoCard,
  ReservationCard,
} from '@/components/restaurant';

export default function RestaurantPage() {
  return (
    <div>
      <HeroSection
        name="Kyoto Garden Hanoi"
        imageUrl="https://example.com/image.jpg"
        rating={4.9}
        reviewCount={42}
        restaurantId={1}
        initialSaved={false}
      />

      <RestaurantDescription
        description="本格的な懐石料理..."
      />

      <MenuSection items={menuItems} />

      <ReviewsSection reviews={reviews} totalReviews={42} />

      <LocationInfoCard address="12 Ly Dao Thanh, Hanoi" />

      <SafetyInfoCard />

      <ReservationCard onReserve={() => console.log('Reserve')} />
    </div>
  );
}
```

## Styling

All components use Tailwind CSS classes and follow the Material Design 3 color scheme defined in the project's theme configuration:

- Primary: `#361f1a`
- Secondary: `#775a19`
- Tertiary: `#0c2b12`
- Surface: `#fcf9f4`
- Error: `#ba1a1a`

## Material Symbols

Components use Material Symbols Outlined font for icons. Ensure the font is properly loaded in your application.

## Integration with Page Component

The main restaurant detail page (`app/restaurant/[id]/page.tsx`) uses these components in a structured layout:

```
┌─────────────────────────────────────┐
│       HeroSection                   │
└─────────────────────────────────────┘
┌────────────────────┬────────────────┐
│  Left Column       │  Right Column  │
├────────────────────┤                │
│ Description        │ LocationInfo   │
│ MenuSection        │ SafetyInfo     │
│ ReviewsSection     │ Reservation    │
└────────────────────┴────────────────┘
```

## Accessibility

- All components include proper semantic HTML
- Material Symbols with FILL variations for better visibility
- Responsive design for mobile and desktop
- Proper color contrast ratios

## Future Enhancements

- Image gallery for restaurants
- Booking integration
- Real-time availability
- Comment translation
- Social sharing

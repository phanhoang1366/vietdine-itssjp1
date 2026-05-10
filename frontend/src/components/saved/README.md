# Saved Restaurants Components Documentation

## Overview

These components provide a comprehensive UI for displaying the user's saved/bookmarked restaurants in the VietDine application. They follow a modular architecture for easy reusability and maintenance.

## Components

### 1. **SavedPageHeader** (`SavedPageHeader.tsx`)

The page header displaying the title and subtitle.

**Props:**

- `title`: string (default: '保存したレストラン') - Page title
- `subtitle`: string (default: '保存したカフェ・飲食店') - Page subtitle

**Features:**

- Large, bold typography
- Responsive text sizing

### 2. **FilterChipsSection** (`FilterChipsSection.tsx`)

Interactive filter chips for sorting and filtering saved restaurants.

**Props:**

- `onFilterChange`: (filterId: string) => void (optional) - Callback when filter is changed
- `activeFilter`: string (default: 'rating') - Currently active filter

**Filters:**

- 評価 (Rating) - Filter by rating
- 距離 (Distance) - Sort by distance
- 空席状況 (Availability) - Filter by availability
- フィルター (Advanced Filter) - Open advanced filter options

### 3. **SavedRestaurantCard** (`SavedRestaurantCard.tsx`)

Individual restaurant card component displayed in the grid.

**Props:**

- `id`: number - Restaurant ID
- `name`: string - Restaurant name
- `description`: string (optional) - Restaurant description/address
- `imageUrl`: string (optional) - Featured image URL
- `rating`: number | string - Average rating
- `distance`: number (optional) - Distance in km
- `priceRange`: string (default: '$$') - Price range ($, $$, $$$, $$$$)
- `isOpen`: boolean (default: true) - Whether restaurant is currently open
- `availability`: 'available' | 'full' | 'unknown' (default: 'available') - Seat availability
- `onSaveToggle`: (id: number, isSaved: boolean) => void (optional) - Callback when save button is toggled
- `initialSaved`: boolean (default: true) - Initial saved state

**Features:**

- Hover zoom effect on image
- Interactive save/unsave button
- Availability badge
- Rating display
- Distance and price info
- Smooth transitions and animations

### 4. **EmptySavedState** (`EmptySavedState.tsx`)

Empty state component displayed when no restaurants are saved.

**Props:**

- `message`: string (default: '保存されたレストランがありません') - Main message
- `description`: string (default: '...') - Additional description
- `buttonText`: string (default: 'レストランを探す') - CTA button text
- `buttonHref`: string (default: '/') - CTA button link

**Features:**

- Bookmark icon
- Descriptive message
- Call-to-action button

## Usage Example

```typescript
import {
  SavedPageHeader,
  FilterChipsSection,
  SavedRestaurantCard,
  EmptySavedState,
} from '@/components/saved';

export default async function SavedPage() {
  const savedRestaurants = await getSavedRestaurants();

  return (
    <div className="min-h-screen bg-background">
      <SavedPageHeader />

      {savedRestaurants.length > 0 ? (
        <>
          <FilterChipsSection activeFilter="rating" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {savedRestaurants.map((restaurant) => (
              <SavedRestaurantCard
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                description={restaurant.address}
                imageUrl={restaurant.imageUrl}
                rating={4.8}
                distance={1.2}
                priceRange="$$"
                availability="available"
              />
            ))}
          </div>
        </>
      ) : (
        <EmptySavedState />
      )}
    </div>
  );
}
```

## Component Structure

The saved page follows this layout:

```
┌─────────────────────────────────────┐
│    SavedPageHeader                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    FilterChipsSection               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  SavedRestaurantCard Grid (1-3 cols)│
│  ┌──────────┐ ┌──────────┐ ┌──────┐│
│  │ Card 1   │ │ Card 2   │ │ Card3││
│  └──────────┘ └──────────┘ └──────┘│
└─────────────────────────────────────┘
```

Or if empty:

```
┌─────────────────────────────────────┐
│    SavedPageHeader                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    EmptySavedState                  │
│    (Bookmark icon + message + btn)  │
└─────────────────────────────────────┘
```

## Styling

All components use:

- Tailwind CSS classes
- Material Design 3 color scheme
- Custom theme colors defined in project config
- Material Symbols Outlined font for icons

### Key Colors Used

- Primary: `#361f1a`
- Secondary: `#775a19`
- Tertiary: `#0c2b12`
- Error: `#ba1a1a`
- Surface variants for cards and backgrounds

## Responsive Design

Components are fully responsive:

- **Mobile:** Single column layout
- **Tablet:** 2-column grid (md:grid-cols-2)
- **Desktop:** 3-column grid (lg:grid-cols-3)

## Interactions

### SavedRestaurantCard

- **Click card:** Navigate to restaurant detail page
- **Click save button:** Toggle save state (client-side)
- **Hover:** Image zoom effect, shadow elevation

### FilterChipsSection

- **Click filter chip:** Trigger filter change
- **Visual feedback:** Active state styling

## Availability States

Cards support three availability states:

- `available` - Green badge "空席あり"
- `full` - Red badge "満席"
- `unknown` - No badge displayed

## Future Enhancements

- Sort by multiple criteria simultaneously
- Advanced filter modal with date/time selection
- Save/unsave animations
- Undo toast for removed items
- Share to social media
- Rating distribution chart
- Price range slider in filter
- Cuisine type multi-select

# Virtual Try-On Feature

## Overview
The Virtual Try-On feature allows users to visualize how products from their cart would look on them using AI-powered image processing.

## Features
- 📸 Upload user photo for virtual try-on
- 👕 Select products from cart to try on
- 🎨 AI-powered image processing (placeholder for API integration)
- ✨ Beautiful, modern UI with smooth transitions
- 📱 Fully responsive design

## File Structure
```
src/features/virtual-tryon/
├── types/
│   └── index.ts              # TypeScript type definitions
├── components/
│   ├── ImageUpload.tsx       # User photo upload component
│   ├── ProductSelector.tsx   # Product selection grid
│   ├── TryOnResult.tsx       # Result display component
│   └── VirtualTryOnPresenter.tsx  # Main presenter component
├── containers/
│   └── VirtualTryOnContainer.tsx  # Business logic container
└── index.ts                  # Barrel export file
```

## Usage

### Navigation
Users can access the Virtual Try-On feature from the cart page by clicking the "Try On Before You Buy" button.

### User Flow
1. User adds products to their cart
2. From the cart page, clicks "Virtual Try-On" button
3. Selects a product from their cart items
4. Uploads a photo of themselves
5. Clicks "Try On Now" to process the virtual try-on
6. Views the result and can try different products

## Components

### VirtualTryOnContainer
**Location:** `containers/VirtualTryOnContainer.tsx`

Container component that manages state and business logic:
- Product selection state
- User image upload handling
- Virtual try-on processing
- Error handling

**Props:**
```typescript
interface VirtualTryOnContainerProps {
  products: VirtualTryOnProduct[];
}
```

### VirtualTryOnPresenter
**Location:** `components/VirtualTryOnPresenter.tsx`

Presentational component that renders the UI layout:
- Breadcrumb navigation
- Product selector
- Image upload area
- Try-on button
- Result display
- Tips section

### ImageUpload
**Location:** `components/ImageUpload.tsx`

Handles user photo upload:
- File input with drag-and-drop support
- Image preview
- File validation (size, type)
- Change photo option

### ProductSelector
**Location:** `components/ProductSelector.tsx`

Displays cart products in a carousel:
- Embla Carousel integration for smooth scrolling
- Card-based product display with hover effects
- Product image with zoom effect on hover
- Selection indicator with animated badge
- Color and size badges
- Price display
- Navigation arrows (prev/next)
- Responsive grid (1 column mobile, 2 tablet, 3 desktop)
- Product count display

### TryOnResult
**Location:** `components/TryOnResult.tsx`

Shows the virtual try-on result:
- Loading animation during processing
- Result image display
- Save result option
- Try another product option

## API Integration

### Current Implementation
✅ **Fully integrated with Fitroom Virtual Try-On API**

The feature uses [Fitroom's AI-powered virtual try-on service](https://platform.fitroom.app) with real-time processing.

### Implementation Details

1. **API Service** (`src/services/api/virtualTryOnApi.ts`)
   - `VirtualTryOnApiService` class handles Fitroom API communication
   - Task-based processing with polling mechanism
   - Type-safe with comprehensive error handling

2. **Next.js API Routes** (`src/app/api/virtual-tryon/route.ts`)
   - Server-side endpoints for secure API key management
   - POST `/api/virtual-tryon` - Creates virtual try-on task
   - GET `/api/virtual-tryon?taskId=xxx` - Checks task status

3. **Container Logic** (`containers/VirtualTryOnContainer.tsx`)
   - Converts user and product images to proper format
   - Creates task via internal API
   - Polls for completion (2-second intervals, 2-minute timeout)
   - Displays result or error message

### Configuration

Add to `.env.local`:
```bash
FITROOM_API_KEY=your_fitroom_api_key
FITROOM_STATUS_API_KEY=your_fitroom_status_api_key
```

See `FITROOM_INTEGRATION.md` in the project root for complete setup instructions.

## Styling
The feature uses Tailwind CSS with:
- Gradient accents (purple-indigo)
- Smooth transitions and hover effects
- Responsive design (mobile-first)
- Shadow and border utilities
- Animation utilities for loading states

## Error Handling
- File size validation (max 10MB)
- File type validation (images only)
- API error handling with user-friendly messages
- Graceful fallbacks for missing data

## Accessibility
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly error messages

## Future Enhancements
- [ ] Multiple product try-on (layering)
- [ ] Save try-on results to profile
- [ ] Share results on social media
- [ ] AR try-on using device camera
- [ ] Video-based try-on
- [ ] Body measurements integration
- [ ] Size recommendation based on try-on

## Testing
To test the feature:
1. Add products to cart
2. Navigate to `/cart`
3. Click "Try On Before You Buy" button
4. Select a product
5. Upload an image
6. Click "Try On Now"
7. View the simulated result

## Dependencies
- Next.js (routing, navigation)
- React (UI components)
- Redux (cart state management)
- Tailwind CSS (styling)
- Embla Carousel (product carousel)

## Notes
- Images are processed client-side for now
- API integration required for production use
- Consider implementing caching for processed results
- Monitor API usage and costs when integrated

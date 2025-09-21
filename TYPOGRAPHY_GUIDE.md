# Typography System Guide

This guide explains the typography classes available in your wedding webapp. These classes provide consistent styling across all text elements and allow you to easily change fonts globally by modifying the CSS.

**Current Font:** All typography classes now use Moon Dance font for a consistent, elegant look.

## Typography Classes

### Page Structure
- **`.text-title`** - Main page titles (e.g., "RSVP", "Our Story")
  - Font: Moon Dance, 48px, bold
  - Use for: Page headers

- **`.text-subtitle`** - Page subtitles/descriptions
  - Font: Moon Dance, 20px, regular
  - Use for: Page descriptions under titles

- **`.text-section-header`** - Section headers within pages
  - Font: Moon Dance, 36px, bold
  - Use for: "Wedding Details", "Travel & Accommodation", etc.

- **`.text-card-header`** - Headers for cards/components
  - Font: Moon Dance, 24px, semi-bold
  - Use for: Card titles, component headers

### Body Text
- **`.text-body`** - Main body text
  - Font: Moon Dance, 18px, regular
  - Use for: Paragraphs, main content

- **`.text-body-sm`** - Small body text
  - Font: Moon Dance, 16px, regular
  - Use for: Secondary content, smaller paragraphs

- **`.text-body-lg`** - Large body text
  - Font: Moon Dance, 20px, regular
  - Use for: Important content, highlighted text

### Captions & Secondary Text
- **`.text-caption`** - Caption text
  - Font: Moon Dance, 14px, regular
  - Use for: Image captions, secondary info

- **`.text-caption-sm`** - Small caption text
  - Font: Moon Dance, 12px, regular
  - Use for: Timestamps, fine print

### Form Elements
- **`.text-label`** - Form labels
  - Font: Moon Dance, 14px, medium weight
  - Use for: Input field labels

- **`.text-input`** - Input field text
  - Font: Moon Dance, 16px, regular
  - Use for: Input fields, textareas

- **`.text-placeholder`** - Placeholder text
  - Font: Moon Dance, inherits size, regular
  - Use for: Input placeholders

### Interactive Elements
- **`.text-button`** - Button text (default)
  - Font: Moon Dance, 16px, medium weight
  - Use for: Standard buttons

- **`.text-button-lg`** - Large button text
  - Font: Moon Dance, 18px, medium weight
  - Use for: Primary action buttons

- **`.text-button-sm`** - Small button text
  - Font: Moon Dance, 12px, medium weight
  - Use for: Secondary buttons, small actions

### Status & Feedback
- **`.text-error`** - Error messages
  - Font: Moon Dance, 14px, regular, red color
  - Use for: Validation errors, error states

- **`.text-success`** - Success messages
  - Font: Moon Dance, 14px, regular, green color
  - Use for: Success confirmations, positive feedback

- **`.text-link`** - Links
  - Font: Moon Dance, inherits size, regular, blue color
  - Use for: Clickable links

### Special Cases
- **`.text-chat-message`** - Chat message text
  - Font: Moon Dance, 14px, regular
  - Use for: Chatbot messages, chat bubbles

## Usage Examples

### Before (current approach):
```jsx
<h1 className="font-great-vibes mb-2 text-5xl font-bold text-gray-800">
  RSVP
</h1>
<p className="font-satisfy text-xl text-gray-600">
  Thank you for your response!
</p>
```

### After (using typography classes):
```jsx
<h1 className="text-title mb-2">
  RSVP
</h1>
<p className="text-subtitle">
  Thank you for your response!
</p>
```

### Form Example:
```jsx
<label className="text-label mb-2 block">
  Your Name *
</label>
<input 
  className="text-input w-full rounded-lg border border-gray-300 px-4 py-2"
  placeholder="Enter your full name"
/>
<button className="text-button border-2 border-gray-800 px-6 py-2">
  Submit
</button>
```

## How to Change Fonts Globally

To change fonts across your entire webapp, simply modify the CSS variables in `/styles/globals.css`:

```css
/* Change all titles to use a different font */
.text-title {
  font-family: var(--font-your-new-font), cursive;
  /* Keep other properties the same */
}

/* Change all body text to use a different font */
.text-body,
.text-body-sm,
.text-body-lg,
.text-caption,
.text-caption-sm,
.text-label,
.text-input,
.text-button,
.text-button-lg,
.text-button-sm,
.text-error,
.text-success,
.text-link,
.text-chat-message,
.text-placeholder {
  font-family: var(--font-your-new-font), cursive;
  /* Keep other properties the same */
}
```

**Note:** You'll also need to import the new font in `/app/layout.tsx` and add it to the body className.

## Migration Strategy

You can gradually migrate your existing components to use these typography classes:

1. **Start with new components** - Use the typography classes from the beginning
2. **Update page by page** - Replace existing font classes with typography classes
3. **Focus on consistency** - Use the same typography class for similar elements across pages

## Benefits

- **Consistency**: All similar elements use the same typography
- **Maintainability**: Change fonts globally by updating CSS
- **Readability**: Clear naming convention makes code self-documenting
- **Flexibility**: Easy to adjust sizing, spacing, and colors
- **Performance**: Reduces CSS bundle size by reusing classes

# Smart Insurance Application Portal

A dynamic insurance application portal built with Next.js, React, and Material UI. This application allows users to apply for different types of insurance through dynamic forms and manage their applications.

## Features

- **Dynamic Form Generation**: Forms are fetched from an API and rendered dynamically
- **Conditional Logic**: Form fields appear/disappear based on user input
- **Nested Sections**: Support for complex form structures with nested sections
- **Dynamic Field Options**: Some fields fetch options from an API based on other field values
- **Form Validation**: Comprehensive validation using React Hook Form and Zod
- **Customizable List View**: Users can select which columns to display in the applications list
- **Sorting and Filtering**: Applications can be sorted and filtered
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on all device sizes

## Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript for better developer experience
- **Material UI**: React component library for consistent UI
- **Redux Toolkit**: State management
- **React Query**: Data fetching and caching
- **React Hook Form**: Form validation and handling
- **Zod**: Schema validation
- **Axios**: HTTP client

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-insurance.git
   cd smart-insurance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Usage

The application interacts with the following API endpoints:

- `GET /api/insurance/forms`: Fetches the dynamic form structure
- `POST /api/insurance/forms/submit`: Submits the completed form
- `GET /api/insurance/forms/submissions`: Retrieves the list of submitted applications
- `GET /api/insurance/fields/{fieldId}/options`: Fetches options for dynamic fields

Base URL: `https://assignment.devotel.io`

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page
│   └── providers.tsx     # Provider components
├── components/           # React components
│   ├── forms/            # Form components
│   └── submissions/      # Submissions list components
├── contexts/             # React contexts
│   └── SettingsContext.tsx # Theme settings context
├── hooks/                # Custom hooks
│   ├── useFormData.ts    # Form data hook
│   ├── useFormValidation.ts # Form validation hook
│   └── useSubmissionsData.ts # Submissions data hook
├── services/             # API services
│   └── api.ts            # API client
├── store/                # Redux store
│   ├── index.ts          # Store configuration
│   └── slices/           # Redux slices
│       ├── formSlice.ts  # Form state slice
│       └── submissionsSlice.ts # Submissions state slice
├── types/                # TypeScript types
└── utils/                # Utility functions
```

## Assumptions

- The API returns form structures with sections and fields
- Each field has a type, label, and validation rules
- Conditional fields depend on the values of other fields
- The API supports pagination, sorting, and filtering for submissions
- The API returns both data and metadata (columns, total items) for submissions
- The app uses Next.js backend as Proxy to prevent CORS errors

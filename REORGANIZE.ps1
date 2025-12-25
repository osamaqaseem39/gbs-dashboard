# PowerShell script to reorganize folder structure
# Run this script from the ecommerce-dashboard directory

$srcPath = "src"

# Create new directory structure
New-Item -ItemType Directory -Force -Path "$srcPath\features\products\components\modals"
New-Item -ItemType Directory -Force -Path "$srcPath\features\products\pages"
New-Item -ItemType Directory -Force -Path "$srcPath\features\products\services"
New-Item -ItemType Directory -Force -Path "$srcPath\features\categories\components"
New-Item -ItemType Directory -Force -Path "$srcPath\features\categories\pages"
New-Item -ItemType Directory -Force -Path "$srcPath\features\categories\services"
New-Item -ItemType Directory -Force -Path "$srcPath\features\brands\components"
New-Item -ItemType Directory -Force -Path "$srcPath\features\brands\pages"
New-Item -ItemType Directory -Force -Path "$srcPath\features\brands\services"
New-Item -ItemType Directory -Force -Path "$srcPath\features\orders\pages"
New-Item -ItemType Directory -Force -Path "$srcPath\features\orders\services"
New-Item -ItemType Directory -Force -Path "$srcPath\features\customers\pages"
New-Item -ItemType Directory -Force -Path "$srcPath\features\customers\services"
New-Item -ItemType Directory -Force -Path "$srcPath\features\inventory\pages"
New-Item -ItemType Directory -Force -Path "$srcPath\features\inventory\services"
New-Item -ItemType Directory -Force -Path "$srcPath\features\master-data\components"
New-Item -ItemType Directory -Force -Path "$srcPath\features\master-data\pages"
New-Item -ItemType Directory -Force -Path "$srcPath\features\master-data\services"
New-Item -ItemType Directory -Force -Path "$srcPath\features\analytics\pages"
New-Item -ItemType Directory -Force -Path "$srcPath\features\analytics\services"
New-Item -ItemType Directory -Force -Path "$srcPath\shared\components\ui"
New-Item -ItemType Directory -Force -Path "$srcPath\shared\components\layout"
New-Item -ItemType Directory -Force -Path "$srcPath\shared\components\forms"
New-Item -ItemType Directory -Force -Path "$srcPath\shared\components\auth"
New-Item -ItemType Directory -Force -Path "$srcPath\shared\services"
New-Item -ItemType Directory -Force -Path "$srcPath\shared\utils"

# Move product files
Move-Item -Path "$srcPath\components\products\*.tsx" -Destination "$srcPath\features\products\components\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\components\products\modals" -Destination "$srcPath\features\products\components\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\Products.tsx" -Destination "$srcPath\features\products\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\ProductFormPage.tsx" -Destination "$srcPath\features\products\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\ProductFormPageWrapper.tsx" -Destination "$srcPath\features\products\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\ProductSetup.tsx" -Destination "$srcPath\features\products\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\services\productService.ts" -Destination "$srcPath\features\products\services\" -Force -ErrorAction SilentlyContinue

# Move category files
Move-Item -Path "$srcPath\components\products\CategoryForm.tsx" -Destination "$srcPath\features\categories\components\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\components\CategoryTree.tsx" -Destination "$srcPath\features\categories\components\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\Categories.tsx" -Destination "$srcPath\features\categories\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\CategoryFormPage.tsx" -Destination "$srcPath\features\categories\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\services\categoryService.ts" -Destination "$srcPath\features\categories\services\" -Force -ErrorAction SilentlyContinue

# Move brand files
Move-Item -Path "$srcPath\components\products\BrandForm.tsx" -Destination "$srcPath\features\brands\components\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\Brands.tsx" -Destination "$srcPath\features\brands\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\BrandFormPage.tsx" -Destination "$srcPath\features\brands\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\services\brandService.ts" -Destination "$srcPath\features\brands\services\" -Force -ErrorAction SilentlyContinue

# Move order files
Move-Item -Path "$srcPath\pages\Orders.tsx" -Destination "$srcPath\features\orders\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\services\orderService.ts" -Destination "$srcPath\features\orders\services\" -Force -ErrorAction SilentlyContinue

# Move customer files
Move-Item -Path "$srcPath\pages\Customers.tsx" -Destination "$srcPath\features\customers\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\services\customerService.ts" -Destination "$srcPath\features\customers\services\" -Force -ErrorAction SilentlyContinue

# Move inventory files
Move-Item -Path "$srcPath\pages\Inventory.tsx" -Destination "$srcPath\features\inventory\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\services\inventoryService.ts" -Destination "$srcPath\features\inventory\services\" -Force -ErrorAction SilentlyContinue

# Move master data files
Move-Item -Path "$srcPath\components\master-data\*.tsx" -Destination "$srcPath\features\master-data\components\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\MasterDataPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\ColorsPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\ColorFormPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\MaterialsPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\MaterialFormPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\OccasionsPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\OccasionFormPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\SeasonsPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\SeasonFormPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\SizesPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\SizeFormPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\PatternsPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\PatternFormPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\SleeveLengthsPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\SleeveLengthFormPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\ColorFamiliesPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\ColorFamilyFormPage.tsx" -Destination "$srcPath\features\master-data\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\services\masterDataService.ts" -Destination "$srcPath\features\master-data\services\" -Force -ErrorAction SilentlyContinue

# Move analytics files
Move-Item -Path "$srcPath\pages\Dashboard.tsx" -Destination "$srcPath\features\analytics\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\pages\Analytics.tsx" -Destination "$srcPath\features\analytics\pages\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\services\dashboardService.ts" -Destination "$srcPath\features\analytics\services\" -Force -ErrorAction SilentlyContinue

# Move shared components
Move-Item -Path "$srcPath\components\ui\*.tsx" -Destination "$srcPath\shared\components\ui\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\components\layout\*.tsx" -Destination "$srcPath\shared\components\layout\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\components\common\ImageUpload.tsx" -Destination "$srcPath\shared\components\forms\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\components\auth\*.tsx" -Destination "$srcPath\shared\components\auth\" -Force -ErrorAction SilentlyContinue

# Move shared services
Move-Item -Path "$srcPath\services\api.ts" -Destination "$srcPath\shared\services\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$srcPath\services\authService.ts" -Destination "$srcPath\shared\services\" -Force -ErrorAction SilentlyContinue

# Move shared utils
Move-Item -Path "$srcPath\utils\classNames.ts" -Destination "$srcPath\shared\utils\" -Force -ErrorAction SilentlyContinue

Write-Host "Reorganization complete! Now update all import statements in your files."

# Strapi Content Types Setup

This folder contains the schema definitions and seed data for Strapi.

## Setup Instructions

### 1. Create Content Types in Strapi

**IMPORTANT:** The seed script will detect if content types exist but have no fields, and provide clear instructions.

You need to create two content types in your Strapi admin panel:

#### Menu Item Collection

1. Go to Content-Type Builder in Strapi admin
2. Create a new Collection Type called "Menu Item"
3. Add the following fields **with exact names** (case-sensitive):
   - `key` (Text, Required, Unique) - API ID must be exactly "key"
   - `label` (Text, Required, Localized) - API ID must be exactly "label"
   - `path` (Text, Required) - API ID must be exactly "path"
   - `icon` (Text, Required) - API ID must be exactly "icon"
   - `order` (Number - Integer, Required, Default: 0) - API ID must be exactly "order"
   - `enabled` (Boolean, Default: true) - API ID must be exactly "enabled"
   - `roles` (JSON) - API ID must be exactly "roles"

   **Important:** When creating fields in Strapi, the "API ID" (not the display name) must match exactly. Check the field settings to ensure the API ID is correct.

4. Enable internationalization (i18n) for this collection
5. Save the content type

#### Translation Collection

1. Create a new Collection Type called "Translation"
2. Add the following fields **with exact names** (case-sensitive):
   - `key` (Text, Required) - API ID must be exactly "key"
   - `value` (Text - Long, Required, Localized) - API ID must be exactly "value"
   - `namespace` (Text, Required, Default: "common") - API ID must be exactly "namespace"

   **Important:** When creating fields in Strapi, the "API ID" (not the display name) must match exactly. Check the field settings to ensure the API ID is correct.

3. Enable internationalization (i18n) for this collection
4. Save the content type

### 2. Configure Locales

1. Go to Settings > Internationalization
2. Add Spanish (es) locale if not already added

### 3. Configure API Token Permissions

**IMPORTANT:** The API token you're using must have **full access** (create, read, update, delete) to both content types.

1. Go to Settings > API Tokens
2. Find or create an API token with **Full access** type
3. Make sure it has permissions for:
   - `menu-item` (create, read, update, delete)
   - `translation` (create, read, update, delete)

**Note:** If you get `405 Method Not Allowed` errors when running the seed script, it means:
- The content types don't exist yet, OR
- The API token doesn't have create permissions

### 4. Configure Public Permissions (Optional)

1. Go to Settings > Roles > Public
2. Enable find and findOne for both menu-items and translations (for public read access)

### 5. Seed Data

After creating the content types and configuring API token permissions:

```bash
cd tippit_new_front
npm run seed
```

**Note:** The script uses `axios` and `ts-node` from the project's `node_modules`. The seed script is defined in `package.json` for easy execution.

**If content types exist but have no fields:** The script will detect this and provide clear step-by-step instructions. Follow them, then run `npm run seed` again.

## Troubleshooting

### Error: "Invalid key {fieldName}"

If you see errors like `Invalid key label` or `Invalid key key`, it means the field names in your Strapi content type don't match what the script expects.

**Solution:**
1. Go to Content-Type Builder in Strapi admin
2. Check the exact field names in your content type
3. **Field names must match exactly** (case-sensitive):
   - For Menu Item: `key`, `label`, `path`, `icon`, `order`, `enabled`, `roles`
   - For Translation: `key`, `value`, `namespace`
4. If your field names are different, either:
   - Rename them in Strapi to match the expected names, OR
   - Update the seed script to use your field names

### Error: "405 Method Not Allowed"

This means the content types don't exist yet or the API token doesn't have create permissions.

**Solution:**
1. Make sure you've created the content types in Strapi (see step 1)
2. Verify your API token has **Full access** or at least **create** permissions for both content types
3. Check Settings > API Tokens in Strapi admin

Or you can manually add the data through the Strapi admin panel.

## Alternative: Import Schema Files

If you have access to the Strapi server files, you can copy the schema files:

1. Copy `menu-item/schema.json` to `src/api/menu-item/content-types/menu-item/schema.json`
2. Copy `translation/schema.json` to `src/api/translation/content-types/translation/schema.json`
3. Create the corresponding route and controller files
4. Restart Strapi

## API Endpoints

After setup, the following endpoints will be available:

- `GET /api/menu-items` - Get all menu items
- `GET /api/menu-items?locale=es` - Get menu items in Spanish
- `GET /api/translations` - Get all translations
- `GET /api/translations?filters[namespace][$eq]=common&locale=es` - Get translations for a namespace


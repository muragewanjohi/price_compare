# Data Catalog

## Data Flow Steps
1. User signs up and creates profile
2. User/Organization connects Stripe account
3. User creates pricing page with tiers
4. User publishes and embeds pricing page
5. User creates A/B tests with variants
6. System tracks conversions and analytics
7. Customers create subscriptions
8. System monitors subscription status and revenue

## Table Definitions

### 1. profiles
**Purpose**: Extends Supabase auth.users with additional user information and trial status.
| Column Name    | Data Type                | Description                                        |
|---------------|--------------------------|---------------------------------------------------|
| id            | uuid                     | Primary key, references auth.users                |
| full_name     | text                     | User's full name                                  |
| company_name  | text                     | User's company name                               |
| website       | text                     | Company website URL                               |
| trial_ends_at | timestamp with time zone | When the trial period ends                       |
| created_at    | timestamp with time zone | When the profile was created                     |
| updated_at    | timestamp with time zone | When the profile was last updated                |

### 2. organizations
**Purpose**: Manages team/company workspaces for collaborative features.
| Column Name | Data Type                | Description                                    |
|------------|--------------------------|------------------------------------------------|
| id         | uuid                     | Primary key                                    |
| name       | text                     | Organization name                              |
| slug       | text                     | URL-friendly unique identifier                 |
| logo_url   | text                     | Organization logo URL                          |
| settings   | jsonb                    | Flexible organization settings                 |
| created_at | timestamp with time zone | When the organization was created             |
| updated_at | timestamp with time zone | When the organization was last updated        |

### 3. org_members
**Purpose**: Manages organization membership and roles.
| Column Name | Data Type                | Description                                    |
|------------|--------------------------|------------------------------------------------|
| org_id     | uuid                     | References organizations.id                    |
| user_id    | uuid                     | References auth.users.id                       |
| role       | text                     | Member role: 'owner', 'admin', or 'member'     |
| created_at | timestamp with time zone | When the membership was created               |
| updated_at | timestamp with time zone | When the membership was last updated          |

### 4. stripe_connections
**Purpose**: Manages multiple Stripe account connections per user/organization.
| Column Name         | Data Type                | Description                                        |
|--------------------|--------------------------|---------------------------------------------------|
| id                 | uuid                     | Primary key                                        |
| user_id            | uuid                     | References auth.users.id                           |
| org_id             | uuid                     | References organizations.id                        |
| stripe_account_id  | text                     | Stripe Connect account ID                          |
| stripe_customer_id | text                     | Stripe customer ID                                 |
| is_primary         | boolean                  | Whether this is the primary Stripe connection      |
| account_type       | text                     | 'standard', 'express', or 'custom'                |
| account_status     | text                     | Current account status                             |
| capabilities       | jsonb                    | Enabled Stripe account capabilities                |
| metadata           | jsonb                    | Additional metadata                                |
| created_at         | timestamp with time zone | When the connection was created                   |
| updated_at         | timestamp with time zone | When the connection was last updated              |

### 5. pricing_pages
**Purpose**: Stores pricing page configurations and content.
| Column Name          | Data Type                | Description                                        |
|---------------------|--------------------------|---------------------------------------------------|
| id                  | uuid                     | Primary key                                        |
| name                | text                     | Page name                                          |
| description         | text                     | Page description                                   |
| status              | text                     | 'draft', 'published', or 'archived'                |
| template            | text                     | Template used                                      |
| settings            | jsonb                    | Page configuration settings                        |
| published_url       | text                     | Public URL when published                          |
| embed_code          | text                     | Embed code for integration                         |
| user_id             | uuid                     | References auth.users.id                           |
| org_id              | uuid                     | References organizations.id                        |
| owner_type          | text                     | 'user' or 'organization'                          |
| stripe_connection_id| uuid                     | References stripe_connections.id                   |
| created_at          | timestamp with time zone | When the page was created                         |
| updated_at          | timestamp with time zone | When the page was last updated                    |

### 6. pricing_tiers
**Purpose**: Defines pricing tiers within pricing pages.
| Column Name      | Data Type                | Description                                        |
|-----------------|--------------------------|---------------------------------------------------|
| id              | uuid                     | Primary key                                        |
| pricing_page_id | uuid                     | References pricing_pages.id                        |
| name            | text                     | Tier name                                          |
| description     | text                     | Tier description                                   |
| price           | decimal(10,2)           | Price amount                                       |
| interval        | text                     | 'month', 'year', or 'one_time' (with check constraint) |
| currency        | text                     | Currency code (default: 'usd')                     |
| features        | jsonb                    | Array of features included                         |
| highlight       | boolean                  | Whether to highlight this tier                     |
| sort_order      | integer                  | Display order                                      |
| stripe_price_id | text                     | Stripe Price ID                                    |
| metadata        | jsonb                    | Additional metadata                                |
| created_at      | timestamp with time zone | When the tier was created                         |
| updated_at      | timestamp with time zone | When the tier was last updated                    |

**Constraints**:
- `interval` must be one of: 'month', 'year', 'one_time'
- `currency` defaults to 'usd'
- `highlight` defaults to false
- `sort_order` defaults to 0
- `features` defaults to empty array
- `metadata` defaults to empty object
- `updated_at` is automatically updated via trigger

**Security**:
- Row Level Security (RLS) enabled
- Users can only access tiers for pricing pages they own

### 7. ab_tests
**Purpose**: Manages A/B testing experiments for pricing pages.
| Column Name  | Data Type                | Description                                        |
|-------------|--------------------------|---------------------------------------------------|
| id          | uuid                     | Primary key                                        |
| name        | text                     | Test name                                          |
| description | text                     | Test description                                   |
| status      | text                     | 'draft', 'active', 'paused', or 'completed'       |
| start_date  | timestamp with time zone | When the test starts                              |
| end_date    | timestamp with time zone | When the test ends                                |
| metrics     | jsonb                    | Array of metrics to track                         |
| user_id     | uuid                     | References auth.users.id                           |
| org_id      | uuid                     | References organizations.id                        |
| owner_type  | text                     | 'user' or 'organization'                          |
| created_at  | timestamp with time zone | When the test was created                         |
| updated_at  | timestamp with time zone | When the test was last updated                    |

### 8. test_variants
**Purpose**: Defines different variants within an A/B test.
| Column Name        | Data Type                | Description                                        |
|-------------------|--------------------------|---------------------------------------------------|
| id                | uuid                     | Primary key                                        |
| ab_test_id        | uuid                     | References ab_tests.id                             |
| pricing_page_id   | uuid                     | References pricing_pages.id                        |
| name              | text                     | Variant name                                       |
| traffic_percentage| integer                  | Percentage of traffic (0-100)                     |
| is_control        | boolean                  | Whether this is the control variant               |
| metadata          | jsonb                    | Additional variant metadata                        |
| created_at        | timestamp with time zone | When the variant was created                      |
| updated_at        | timestamp with time zone | When the variant was last updated                 |

### 9. conversions
**Purpose**: Tracks conversion events for A/B test variants.
| Column Name | Data Type                | Description                                        |
|------------|--------------------------|---------------------------------------------------|
| id         | uuid                     | Primary key                                        |
| variant_id | uuid                     | References test_variants.id                        |
| session_id | text                     | Unique session identifier                          |
| event_type | text                     | Type of conversion event                           |
| metadata   | jsonb                    | Additional event data                              |
| created_at | timestamp with time zone | When the conversion occurred                      |

### 10. subscriptions
**Purpose**: Manages customer subscriptions and their status.
| Column Name            | Data Type                | Description                                        |
|-----------------------|--------------------------|---------------------------------------------------|
| id                    | uuid                     | Primary key                                        |
| user_id               | uuid                     | References auth.users.id                           |
| org_id                | uuid                     | References organizations.id                        |
| stripe_subscription_id| text                     | Stripe Subscription ID                            |
| stripe_customer_id    | text                     | Stripe Customer ID                                |
| stripe_connection_id  | uuid                     | References stripe_connections.id                   |
| pricing_tier_id       | uuid                     | References pricing_tiers.id                       |
| status               | text                     | Subscription status                               |
| current_period_start | timestamp with time zone | Current billing period start                      |
| current_period_end   | timestamp with time zone | Current billing period end                        |
| cancel_at_period_end | boolean                  | Whether subscription will cancel at period end    |
| metadata             | jsonb                    | Additional subscription metadata                   |
| created_at           | timestamp with time zone | When the subscription was created                 |
| updated_at           | timestamp with time zone | When the subscription was last updated            |

## Key Relationships

1. **User/Organization Ownership**
   - Most tables have both `user_id` and `org_id` with a check constraint ensuring at least one is set
   - `owner_type` field determines the ownership context

2. **Stripe Integration**
   - `stripe_connections` can belong to users or organizations
   - `pricing_pages` link to specific Stripe connections
   - `subscriptions` track both Stripe IDs and local references

3. **A/B Testing Flow**
   - `ab_tests` contain multiple `test_variants`
   - `test_variants` link to specific `pricing_pages`
   - `conversions` track events for specific variants

4. **Pricing Structure**
   - `pricing_pages` contain multiple `pricing_tiers`
   - `pricing_tiers` link to Stripe prices
   - `subscriptions` reference specific tiers

## Data Integrity
- UUID primary keys throughout
- Proper foreign key constraints
- Check constraints on status fields
- Timestamp tracking on all tables
- JSONB fields for flexible metadata
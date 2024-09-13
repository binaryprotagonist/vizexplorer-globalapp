# Global App

The primary role of Global App is to provide a place for users to configure various settings pertaining to their account or applications. This includes viewing current application subscriptions, managing users, managing specific or general application settings and more.

Additionally, a wrapper built around this functionality is the Admin mode which allows select internal VizExplorer members to view and manage other Organizations/Customers settings - essentially a means for remote assistance.

## Local setup

There are two modes this application can run in. 
- Normal mode exposes pages for management of various settings for the currently logged in users' Organization (`/` and `/settings/*`)
- Admin mode exposes the ability to manage other Organizations settings (`/admin/*`)
    - `NOTE:` Admin mode requires special configuration that can only be done via Keycloak with the correct permission. Speak to the team if necessary.

Get environment ready
- Talk to the team to get credentials for the VOD Suite
- Configure `.nmprc` to load `@vizexplorer` packages from GitHub Packages
- Run `npm i`

To run in normal mode (access to `/` and `/settings/*`)
- Run `npm start`

To run in admin mode (access to `/admin/*`)
- Run `npm start -- --config vite.admin.config.ts`

## How to add new static resources

- Static files should be put under the `public/app/global/` directory.
- Only files that explicitly need to be served under the root such as `robots.txt` can be put into the `public/app/` directory.
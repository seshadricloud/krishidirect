# Contents of the file: /KrishiDirect/KrishiDirect/backend/prisma/migrations/README.md

# Database Migrations for KrishiDirect

This directory contains the migration files for the Prisma ORM used in the KrishiDirect application. Migrations are used to manage changes to the database schema over time.

## How to Create a New Migration

1. **Make Changes to the Prisma Schema**: Update the `schema.prisma` file located in the `prisma` directory to reflect the desired changes to your database models.

2. **Generate Migration**: Run the following command in your terminal to create a new migration based on the changes made to the schema:
   ```
   npx prisma migrate dev --name <migration-name>
   ```
   Replace `<migration-name>` with a descriptive name for your migration.

3. **Apply Migration**: The above command will automatically apply the migration to your development database. If you are working in a production environment, use:
   ```
   npx prisma migrate deploy
   ```

## Viewing Migration History

You can view the history of migrations applied to your database by running:
```
npx prisma migrate status
```

## Rollback a Migration

If you need to rollback the last applied migration, you can use:
```
npx prisma migrate reset
```
**Warning**: This command will delete all data in your database, so use it with caution.

## Important Notes

- Always ensure that your migrations are properly tested in a development environment before applying them to production.
- Keep your migration files organized and well-named to maintain clarity in your project's database evolution.
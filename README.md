# Setting Environment Variables

This project uses environment variables to handle sensitive and environment-specific settings. Follow these instructions to correctly configure your development environment.

## .env file

The `.env` file is used to store environment variables. This file should **not** be shared or uploaded to the repository for security reasons.

### Steps to configure:

1. Create a file called `.env` in the root of the project.
2. Copy the contents of `.env.example` to your new `.env` file.
3. Replace the example values ​​with your own settings.

Example of `.env`:

```
GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_here
ANOTHER_ENVIRONMENT_VARIABLE=value
```

## Importance of .gitignore

Make sure `.env` is included in your `.gitignore` file to prevent it from being accidentally uploaded to the repository.

## Use in code

Environment variables can be accessed in code as follows:

```javascript
const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
```

## Security

- Never share your `.env` file or expose its values ​​in public.
- Do not upload the `.env` file to version control.
- Consider using a secrets manager for production environments.

## Common problems

If you encounter errors related to undefined environment variables, make sure to:

1. Have created the `.env` file correctly.
2. Have restarted your development server after modifying `.env`.
3. Be using the correct syntax to access variables in your code.

For any additional questions about setting environment variables, please contact the development team.
module.exports = {
  apps: [
    {
      name: 'roods-admin', // The name of your application (used by PM2)
      script: 'npm', // The command to run your app
      args: 'start', // The arguments to start your app (e.g., "start" for production)
      cwd: '/var/www/html/ra-admin',
      instances: 1, // This will run the app in cluster mode (you can set a fixed number like 2 if you prefer)
      exec_mode: 'cluster', // Cluster mode is recommended for Node.js apps in production
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development', // Environment variables for development
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production', // Environment variables for production
        PORT: 3000
      }
    }
  ]
};

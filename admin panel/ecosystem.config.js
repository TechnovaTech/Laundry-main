module.exports = {
  apps: [
    {
      name: 'admin-panel',
      script: 'npm',
      args: 'start',
      instances: 1,            // ✅ single instance (safe for your VPS)
      cwd: '/var/www/laundry-admin/admin panel',
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1024M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      node_args: '--max-old-space-size=512',
      error_file: './logs/admin-panel-error.log',
      out_file: './logs/admin-panel-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
    },
  ],
};

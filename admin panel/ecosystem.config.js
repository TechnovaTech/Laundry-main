module.exports = {
  apps: [{
    name: 'admin-panel',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/admin-panel',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/root/.pm2/logs/admin-panel-error.log',
    out_file: '/root/.pm2/logs/admin-panel-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    time: true
  }]
};

# gunicorn_config.py
bind = "0.0.0.0:10000"
workers = 1
threads = 4
worker_class = "gthread"
timeout = 120
start:
	docker-compose up -d
	watchman-make -p 'server/**/*.py' -s 1 --run 'touch ./server/uwsgi-reload'
stop:
	docker-compose down
start:
	docker-compose up --build -d
	watchman-make -p 'server/**/*.py' -s 1 --run 'touch ./server/uwsgi-reload'
stop:
	docker-compose down
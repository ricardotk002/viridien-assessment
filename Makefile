dev:
	make -j2 dev-app dev-server

dev-app:
	cd app && npx expo start --ios

dev-server:
	cd server && npm run start:dev

build:
	make -j2 build-app build-server

build-app:
	cd app && npx expo build:ios

build-server:
	cd server && npm run build

db-seed:
	cd server && npx ts-node prisma/seed.ts

.PHONY: dev dev-app dev-server build build-app build-server db-seed

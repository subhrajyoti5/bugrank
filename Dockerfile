# syntax=docker/dockerfile:1

FROM node:20-bullseye-slim AS build
WORKDIR /app

# Install workspace dependencies needed for the backend build.
COPY package*.json ./
COPY server/package*.json ./server/
COPY shared/package*.json ./shared/
RUN npm install

COPY shared ./shared
COPY server ./server
RUN npm run build --workspace=shared
RUN npm run build --workspace=server

FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production

# Runtime deps for compilation + runner script.
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		g++ gcc make time util-linux sudo curl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Create runner user and directories.
RUN useradd -r -m -s /bin/bash executor \
	&& mkdir -p /srv/bugpulse/{jobs,runner,logs,temp} \
	&& chown -R executor:executor /srv/bugpulse \
	&& chmod 777 /srv/bugpulse/jobs

COPY scripts/run_cpp.sh /srv/bugpulse/runner/run_cpp.sh
RUN chmod +x /srv/bugpulse/runner/run_cpp.sh \
	&& chown executor:executor /srv/bugpulse/runner/run_cpp.sh

# Keep runtime image simple by reusing build outputs and node_modules.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/shared/dist ./shared/dist
COPY server/package.json ./server/package.json
COPY shared/package.json ./shared/package.json

EXPOSE 5000
CMD ["node", "server/dist/index.js"]

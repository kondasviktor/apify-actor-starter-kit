# Minimal HTTP Actor — Crawlee Cheerio on apify/actor-node
FROM apify/actor-node:26

# Latest npm (Apify base images ship the npm bundled with Node).
USER root
RUN npm install -g npm@12.2.1 \
    && npm cache clean --force \
    && rm -rf node_modules
USER myuser

COPY --chown=myuser:myuser package*.json ./

RUN npm --quiet set progress=false \
    && npm install --include=dev

COPY --chown=myuser:myuser . ./

RUN npm run build \
    && npm prune --omit=dev \
    && echo "Built starter Actor"

CMD npm run start:prod --silent

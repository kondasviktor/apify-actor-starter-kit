# Minimal HTTP Actor — Crawlee Cheerio on apify/actor-node
FROM apify/actor-node:20

COPY package*.json ./

RUN npm --quiet set progress=false \
    && npm install --include=dev

COPY . ./

RUN npm run build \
    && npm prune --omit=dev \
    && echo "Built starter Actor"

CMD npm run start:prod --silent

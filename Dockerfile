FROM ghcr.io/puppeteer/puppeteer:19.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

RUN mkdir -p /usr/src/app/generated-pdf
RUN chown -R node:node /usr/src/app/generated-pdfs
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
CMD [ "pnpm", "prod:start" ]
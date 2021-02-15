FROM node:14
WORKDIR /usr/src/app
COPY . ./
RUN apt-get update || : && apt-get install python -y
RUN yarn install
RUN yarn build
CMD ["yarn", "start"]

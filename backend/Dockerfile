FROM node:13.10

COPY ./ /backend

WORKDIR /backend

RUN ["npm", "install"]

EXPOSE 80

CMD ["/backend/node_modules/.bin/nodemon", "/backend/app.js"]

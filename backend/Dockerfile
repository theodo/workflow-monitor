FROM node:10

ADD package-lock.json /package-lock.json
ADD package.json /package.json

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN npm i

WORKDIR /app
ADD . /app

EXPOSE 4000
EXPOSE 4001
EXPOSE 35729

ENTRYPOINT ["/bin/bash", "/app/run.sh"]
CMD ["start"]

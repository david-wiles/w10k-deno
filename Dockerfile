FROM denoland/deno:alpine
COPY main.ts main.ts
EXPOSE 8080
CMD ["run", "--allow-net", "--allow-env", "main.ts"]
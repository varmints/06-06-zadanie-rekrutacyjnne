import { createServer } from "./server";

async function bootstrap() {
    const app = await createServer();
    const port = process.env.PORT || 3000;

    app.listen(port, () => {
      console.log(`API server is running on http://localhost:${port}`);
    });
}

bootstrap();
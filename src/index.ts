import app from './app';
import { APP_PORT } from './utilities/secret';
import logger from './utilities/logger';

app.listen(APP_PORT, () => {
    logger.info(`serverr running on port : ${APP_PORT}`);
    console.log(`serverr running on port : ${APP_PORT}`);
  })
  .on('error', (e) => console.log(e));

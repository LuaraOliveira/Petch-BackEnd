import { diskStorage } from 'multer';
import { resolve } from 'path';

import { createTokenHEX } from '../utils';

export const config = {
  storage: diskStorage({
    destination: resolve(__dirname, '..', 'uploads'),
    filename(req, file, cb) {
      const hash = createTokenHEX();

      const filename = `${hash}__${file.originalname}`;

      cb(null, filename);
    },
  }),
};

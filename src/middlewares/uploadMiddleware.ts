import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp','.pdf', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no válido. Solo se permiten imágenes, exels o pdfs.') as any, false);
  }
};

export const uploadMiddleware = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 }
});

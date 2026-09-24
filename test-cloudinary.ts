import CloudinaryStorageService from './src/service/storage/cloudinaryStorageService';
const run = async () => {
    try {
        const svc = new CloudinaryStorageService();
        const buffer = Buffer.from('test');
        const res = await svc.upload({ buffer, fileName: 'test.jpg', mimeType: 'image/jpeg', path: 'UserPhotos' });
        console.log(res);
    } catch(e) {
        console.error(e);
    }
};
run();

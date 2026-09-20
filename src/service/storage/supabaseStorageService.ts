import supabase from '../../config/supabase';
import { UploadFileInputDto, UploadFileResultDto } from '../../dtos/FileDto';
import ValidationError from '../../errors/ValidationError';


class SupabaseStorageService {

private readonly bucket = 'sprinthub-files';

async upload(fileData: UploadFileInputDto): Promise<UploadFileResultDto> {

    const extension = fileData.fileName.includes('.')? `.${fileData.fileName.split('.').pop()?.toLowerCase()}`: '';

    const uniqueFileName = `${crypto.randomUUID()}${extension}`;

    const filePath = fileData.path? `${fileData.path}/${uniqueFileName}`: uniqueFileName;

    const { data, error } = await supabase.storage.from(this.bucket).upload(
        filePath, fileData.buffer, {
        contentType: fileData.mimeType,
        upsert: false
    });

    if (error) {

    throw new ValidationError(`Error al subir el archivo: ${error.message}`);

    }

    const { data: publicUrl } = supabase.storage.from(this.bucket).getPublicUrl(data.path);

    return {
        path: data.path,
        fileName: fileData.fileName,
        url: publicUrl.publicUrl
    };

}

async delete(filePath: string): Promise<void> {

    const { error } = await supabase.storage.from(this.bucket).remove([filePath]);

    if (error) {
    
    throw new ValidationError(`Error al eliminar el archivo: ${error.message}`);

    }
}

async deleteMany(filePaths: string[]): Promise<void> {

    if (filePaths.length === 0) {
    return;
    }

    const { error } = await supabase.storage.from(this.bucket).remove(filePaths);

    if (error) {
    throw new ValidationError(`Error al eliminar los archivos: ${error.message}`);
    }
}

}

export default SupabaseStorageService;
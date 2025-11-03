import { message } from "antd";
import { supabase } from "../../utils/api/supabaseClient";
import { RcFile } from "antd/es/upload";

class UpLoadService {
    private bucketName = "image";

    async uploadImages(files: RcFile[]): Promise<string[]> {
        const uploadPromises = files.map(async (file) => {
            try {
                const fileName = `${Date.now()}_${file.name}`;
                const filePath = `uploads/${fileName}`;

                const { error } = await supabase.storage
                    .from(this.bucketName)
                    .upload(filePath, file, { cacheControl: "3600", upsert: false });

                if (error) throw error;

                return this.getUrl(filePath);
            } catch (err) {
                message.error("Có lỗi xảy ra khi upload ảnh");
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        return results.filter((url): url is string => url !== null);
    }

    getUrl(path: string): string {
        const { data } = supabase.storage.from(this.bucketName).getPublicUrl(path);
        return data.publicUrl;
    }
}

export default new UpLoadService();

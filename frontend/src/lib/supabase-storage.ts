import { createClient } from '@/utils/supabase/client';
import { randomUUID } from 'crypto';

const BUCKET = 'product-images';

/**
 * Uploads a single image file to Supabase Storage and returns the public CDN URL.
 * Files are stored under: product-images/products/<productId>/<uuid>.<ext>
 */
export async function uploadProductImage(
    file: File,
    productId: string,
): Promise<string> {
    const supabase = createClient();

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    // Use crypto.randomUUID in browser or a simple fallback
    const uuid =
        typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2);
    const path = `products/${productId}/${uuid}.${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        throw new Error(`Supabase upload failed: ${error.message}`);
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
}

/**
 * Deletes an image from Supabase Storage given its full public URL.
 * No-ops gracefully if the URL doesn't belong to Supabase Storage.
 */
export async function deleteProductImage(publicUrl: string): Promise<void> {
    const supabase = createClient();

    // Extract the storage path from the full public URL
    // URL pattern: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
    const marker = `/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return; // Not a Supabase Storage URL — skip silently

    const storagePath = publicUrl.slice(idx + marker.length);

    const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
    if (error) {
        console.warn(`Failed to delete image from Supabase Storage: ${error.message}`);
        // Don't throw — the DB record will still be cleaned up by the backend
    }
}

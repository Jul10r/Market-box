"use client";

import { useState } from 'react';
import { UploadDropzone, } from '@/lib/uploadthing';


export default function ImageUploader() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);


    return (
        <main>
            <div>
                <UploadDropzone
                    endpoint="imageUploader"
                    config={{ mode: "auto" }}
                    onClientUploadComplete={(res) => {
                        const newUrls = res.map((file) => file.ufsUrl);

                        setImageUrls((prev) => [...prev, ...newUrls])
                    }}
                    onUploadError={(error: Error) => {
                        alert(`Upload failed: ${error.message}`)
                    }}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    {imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt="Uploaded preview"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                    ))}

                    {imageUrls.map((url, index) => (
                        <input key={index} type="hidden" name="images" value={url} />
                    ))}
                </div>
            </div>
        </main>
    )
}
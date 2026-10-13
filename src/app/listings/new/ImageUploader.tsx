'use client'

import { useState } from 'react'
import { UploadDropzone } from '@/lib/uploadthing'

export default function ImageUploader() {
  const [imageUrls, setImageUrls] = useState<string[]>([])

  return (
    <div className="space-y-3">
      <div className="border border-dashed border-slate-200 rounded-lg p-2 bg-slate-50/50 hover:bg-slate-50 transition">
        <UploadDropzone
          endpoint="imageUploader"
          config={{ mode: "auto" }}
          className="ut-button:bg-slate-900 ut-button:ut-readying:bg-slate-800 ut-label:text-slate-700 ut-allowed-content:text-slate-500"
          onClientUploadComplete={(res) => {
            const newUrls = res.map((file) => file.ufsUrl)
            setImageUrls((prev) => [...prev, ...newUrls])
          }}
          onUploadError={(error: Error) => {
            alert(`Upload failed: ${error.message}`)
          }}
        />
      </div>
      {imageUrls.length > 0 && (
        <div className="flex flex-wrap gap-2.5 pt-1">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              <img
                src={url}
                alt="Uploaded preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== index))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-[10px] flex items-center justify-center cursor-pointer transition shadow-xs"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
          {imageUrls.map((url, index) => (
            <input key={index} type="hidden" name="images" value={url} />
          ))}
        </div>
      )}
    </div>
  )
}
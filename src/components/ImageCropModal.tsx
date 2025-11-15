
import React, { useState, useRef } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';

interface ImageCropModalProps {
  src: string;
  onSave: (croppedImageUrl: string) => void;
  onClose: () => void;
}

function getCroppedImg(image: HTMLImageElement, crop: Crop): string {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const cropWidth = crop.width || 0;
    const cropHeight = crop.height || 0;

    if (!cropWidth || !cropHeight) {
        return '';
    }

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        cropWidth * scaleX,
        cropHeight * scaleY,
        0,
        0,
        cropWidth,
        cropHeight
    );
    
    return canvas.toDataURL('image/jpeg');
}


const ImageCropModal: React.FC<ImageCropModalProps> = ({ src, onSave, onClose }) => {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const imgRef = useRef<HTMLImageElement>(null);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        const initialCrop = centerCrop(
            makeAspectCrop(
                {
                    unit: '%',
                    width: 90,
                },
                1, // 1:1 aspect ratio
                width,
                height
            ),
            width,
            height
        );
        setCrop(initialCrop);
    }

    const handleSaveCrop = () => {
        if (imgRef.current && completedCrop?.width && completedCrop?.height) {
            const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop);
            if (croppedImageUrl) {
                onSave(croppedImageUrl);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="crop-dialog-title">
            <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl p-6 w-full max-w-lg animate-fade-in">
                <h2 id="crop-dialog-title" className="text-xl font-bold mb-4 text-black dark:text-white">Crop Your Image</h2>
                <div className="flex justify-center">
                    <ReactCrop
                        crop={crop}
                        onChange={c => setCrop(c)}
                        onComplete={c => setCompletedCrop(c)}
                        aspect={1}
                        circularCrop={true}
                    >
                        <img ref={imgRef} src={src} onLoad={onImageLoad} alt="Crop preview" style={{ maxHeight: '70vh' }} />
                    </ReactCrop>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-600 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={handleSaveCrop} className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-focus transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;

import React, { useState } from 'react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const Root = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const Header = styled('h1')({
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
});

const ImageContainer = styled('div')({
    maxWidth: '800px',
    width: '100%',
    height: '450px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
});

const Image = styled('img')(({ theme }) => ({
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
    cursor: 'pointer',
}));

const ThumbnailContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
});

const Thumbnail = styled('img')(({ theme, isSelected }) => ({
    width: '200px',
    height: '120px',
    marginLeft: '10px',
    marginRight: '10px',
    cursor: 'pointer',
    border: isSelected
        ? `3px solid ${theme.palette.primary.main}`
        : `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
}));

const Arrow = styled(ArrowBack)({
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#555',
});

function ImageCarousel({ imageIds }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [batchNumber, setBatchNumber] = useState(1);

    const batchSize = 4;
    const startIdx = (batchNumber - 1) * batchSize;
    const endIdx = startIdx + batchSize;

    const images = imageIds
        .slice(startIdx, endIdx)
        .map((id) => ({ id, imageUrl: `${import.meta.env.VITE_API_URL}/images/${id}` }));

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleLoadMore = (direction) => {
        const numImages = imageIds.length;
        const lastBatch = Math.ceil(numImages / batchSize);
        let nextBatchNumber = batchNumber;
        if (direction === 'left') {
            nextBatchNumber = batchNumber - 1;
        } else {
            nextBatchNumber = batchNumber + 1;
        }
        if (nextBatchNumber < 1 || nextBatchNumber > lastBatch) {
            return;
        }
        setBatchNumber(nextBatchNumber);
    };

    if (!selectedImage && images.length > 0) {
        setSelectedImage(images[0]);
    }

    const canLoadMoreLeft = batchNumber > 1;
    const canLoadMoreRight = endIdx < imageIds.length;

    return (
        <Root>
            <Header>Images</Header>
            <ImageContainer>{selectedImage && <Image src={selectedImage.imageUrl} alt={`Image ${selectedImage.id}`} />}</ImageContainer>
            <ThumbnailContainer>
                <ArrowBack onClick={() => handleLoadMore('left')} disabled={!canLoadMoreLeft} />
                {images.map((image => (
                    <Thumbnail
                        key={image.id}
                        src={image.imageUrl}
                        alt={`Image ${image.id}`}
                        onClick={() => handleImageClick(image)}
                        isSelected={selectedImage && selectedImage.id === image.id}
                    />
                )))}
                <ArrowForward onClick={() => handleLoadMore('right')} disabled={!canLoadMoreRight} />
            </ThumbnailContainer>
        </Root>
    );
}
export default ImageCarousel;

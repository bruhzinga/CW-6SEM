import React, {useState} from 'react';
import {ArrowBack, ArrowForward} from '@mui/icons-material';
import {styled} from '@mui/material/styles';

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
    position: 'relative', // Added for outlining the selected image
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
    border: isSelected ? `3px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.grey[300]}`, // Added for outlining the selected thumbnail
    borderRadius: theme.shape.borderRadius,
}));

const Arrow = styled(ArrowBack)({
    fontSize: '2rem',
    cursor: 'pointer',
    color: '#555',
});

function ImageCarousel() {
    const [selectedImage, setSelectedImage] = useState(null);
    const images = [
        {
            id: 1,
            imageUrl: 'https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-rush-45170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
            id: 2,
            imageUrl: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
            id: 3,
            imageUrl: 'https://images.pexels.com/photos/45170/kittens-cat-cat-puppy-rush-45170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        },
        {
            id: 4,
            imageUrl: 'https://via.placeholder.com/800x450.png?text=Image+4',
        },
    ];

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleLoadMore = (direction) => {
        // TODO: implement loading more images
    };

    // Set the first image as the selected image by default
    if (!selectedImage && images.length > 0) {
        setSelectedImage(images[0]);
    }

    return (
        <Root>
            <Header>Images</Header>
            <ImageContainer>
                {selectedImage && <Image src={selectedImage.imageUrl} alt={`Image ${selectedImage.id}`} />}
            </ImageContainer>
            <ThumbnailContainer>
                <ArrowBack onClick={() => handleLoadMore('left')} />
                {images.slice(0, 4).map((image) => (
                    <Thumbnail
                        key={image.id}
                        src={image.imageUrl}
                        alt={`Image ${image.id}`}
                        isSelected={selectedImage && selectedImage.id === image.id} // Added for outlining the selected thumbnail
                        onClick={() => handleImageClick(image)}
                    />
                ))}
                <ArrowForward onClick={() => handleLoadMore('right')} />
            </ThumbnailContainer>
        </Root>
    );
}
export default ImageCarousel;

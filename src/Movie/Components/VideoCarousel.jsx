import React, { useState, useEffect } from 'react';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReactPlayer from "react-player";

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

const VideoContainer = styled('div')({
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
    position: 'relative', // Added for outlining the selected video
});

const Video = styled('video')(({ theme }) => ({
    maxWidth: '100%',
    maxHeight: '100%',
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

function VideoCarousel( {VideoIds}) {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videos, setVideos] = useState([]);
    console.log('video ids: ', VideoIds)

    useEffect(() => {
        const fetchVideos = async () => {
            const response = await fetch('https://myapi.com/videos');
            const data = await response.json();
            setVideos(data);
        };

        fetchVideos();
    }, []);

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    const handleLoadMore = (direction) => {
        // TODO: implement loading more videos
    };

    // Set the first video as the selected video by default
    useEffect(() => {
        if (!selectedVideo && videos.length > 0) {
            setSelectedVideo(videos[0]);
        }
    }, [videos, selectedVideo]);

    return (
        <Root>
            <Header>Trailers</Header>
            <VideoContainer>
                {selectedVideo && (
                    <ReactPlayer controls url={selectedVideo.videoUrl} width="100%" height="100%" />
                )}
            </VideoContainer>
            <ThumbnailContainer>
                <ArrowBack onClick={() => handleLoadMore('left')} />
                {videos.map((video) => (
                    <Thumbnail
                        key={video.id}
                        src={video.thumbnailUrl}
                        alt={`Video ${video.id} thumbnail`}
                        isSelected={selectedVideo && selectedVideo.id === video.id} // Added for outlining the selected thumbnail
                        onClick={() => handleVideoClick(video)}
                    />
                ))}
                <ArrowForward onClick={() => handleLoadMore('right')} />
            </ThumbnailContainer>
        </Root>
    );
}

export default VideoCarousel;

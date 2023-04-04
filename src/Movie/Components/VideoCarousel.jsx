import React, {useEffect, useState} from 'react';
import {ArrowBack, ArrowForward} from '@mui/icons-material';
import {styled} from '@mui/material/styles';
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
    const [currentVideoSet, setCurrentVideoSet] = useState([]);
    const [videos, setVideos] = useState([]);


    useEffect(() => {
        const fetchVideos = () => {
            const videoData = VideoIds.map((videoId) => {
                return {
                    videoUrl:`${import.meta.env.VITE_API_URL}/videos/${videoId}`,
                    id: videoId,
                };

            });

            setVideos(videoData);
            setCurrentVideoSet(videoData.slice(0, 2));
        };

        fetchVideos();

    }, [VideoIds]);



    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    const handleLoadMore = (direction) => {
        const step = direction === 'left' ? -2 : 2;
        const lastIndex = currentVideoSet.length - 1;
        const lastVideoIndex = videos.findIndex((video) => video.id === currentVideoSet[lastIndex].id);
        const newIndex = lastVideoIndex + step;

        if (newIndex >= 0 && newIndex < videos.length) {
            setCurrentVideoSet(videos.slice(newIndex, newIndex + 2));
        }
    };

    // Set the first video as the selected video by default
    useEffect(() => {
        if (!selectedVideo && currentVideoSet.length > 0) {
            setSelectedVideo(currentVideoSet[0]);
        }
    }, [currentVideoSet, selectedVideo]);

    return (
        <Root>
            <Header>Trailers</Header>
            <VideoContainer>
                {selectedVideo && (
                    <ReactPlayer controls url={selectedVideo.videoUrl} width="100%" height="100%" />
                )}
            </VideoContainer>
            <ThumbnailContainer>
                <ArrowBack onClick={() => handleLoadMore('left')} disabled={currentVideoSet[0] === videos[0]} />
                {currentVideoSet.map((video) => (
                    <Thumbnail
                        key={video.id}
                        src={video.thumbnailUrl}
                        alt={`Video ${video.id} thumbnail`}
                        isSelected={selectedVideo && selectedVideo.id === video.id} // Added for outlining the selected thumbnail
                        onClick={() => handleVideoClick(video)}
                    />
                ))}
                <ArrowForward onClick={() => handleLoadMore('right')} disabled={currentVideoSet[currentVideoSet.length - 1] === videos[videos.length - 1]} />
            </ThumbnailContainer>
        </Root>
    );
}

export default VideoCarousel;

import React, {useState} from 'react';
import {Button, Card, Divider, Input, Typography} from '@mui/material';
import {CommentOutlined} from '@mui/icons-material';

const FilmComments = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRatingChange = (event) => {
        setNewRating(event.target.value);
    };

    const handleCommentSubmit = () => {
        const date = new Date().toLocaleString();
        const comment = {
            user: 'John Doe', // replace with actual user name or integrate with authentication system
            rating: newRating,
            review: newComment,
            date: date,
        };
        setComments([...comments, comment]);
        setNewComment('');
        setNewRating(0);
    };

    return (
        <div style={{marginTop:"30px",marginRight:"10vh",marginLeft:"10vh"}}>
            <Card sx={{ p: 2, mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Leave a Comment
                </Typography>
                <Input
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write your review here"
                    value={newComment}
                    onChange={handleCommentChange}
                    sx={{ mb: 2 }}
                />
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1">Rating (0-10)</Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={newRating}
                        onChange={handleRatingChange}
                        style={{
                            width: '200px',
                            height: '10px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            marginRight: '10px',
                        }}
                    />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {newRating}
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CommentOutlined />}
                    onClick={handleCommentSubmit}
                    sx={{ mt: 2 }}
                >
                    Submit
                </Button>
            </Card>

            {comments.map((comment, index) => (
                <Card key={index} sx={{ mb: 4, p: 2 }}>
                    <Typography variant="subtitle1">{comment.user}</Typography>
                    <Typography variant="caption" sx={{ mb: 1 }}>
                        {comment.date}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Rating: {comment.rating}/10
                    </Typography>
                    <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                        {comment.review}
                    </Typography>
                </Card>
            ))}
        </div>
    );
};

export default FilmComments;

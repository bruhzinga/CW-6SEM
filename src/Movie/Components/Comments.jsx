import React, { useState, useEffect } from "react";
import { Button, Card, Divider, Input, Typography } from "@mui/material";
import { CommentOutlined } from "@mui/icons-material";
import fetchWrapper from "@/_helpers/fetch-wrapper";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const FilmComments = () => {
    const { user: authUser } = useSelector(x => x.auth);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [deleteWarning, setDeleteWarning] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const data = await fetchWrapper.get(
                `${import.meta.env.VITE_API_URL}/movies/${id}/comments`
            );
            const formattedData = data.Comment.map((entry) => ({
                id: entry.id,
                user: entry.User.username,
                review: entry.content,
                rating: entry.rating,
                date: new Date(entry.createdOn).toLocaleString(),
            }));
            setComments(formattedData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRatingChange = (event) => {
        setNewRating(event.target.value);
    };

    const handleCommentSubmit = async () => {
        try {
            const comment = {
                content: newComment,
                rating: +newRating,
                movieId: +id,
            };
            await fetchWrapper.post(
                `${import.meta.env.VITE_API_URL}/comments`,
                comment
            );
            setNewComment("");
            setNewRating(0);
            setDeleteWarning(null);
            fetchComments();
        } catch (error) {
            setDeleteWarning("You already posted a review. Please delete the previous review.");
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await fetchWrapper.delete(
                `${import.meta.env.VITE_API_URL}/comments/${commentId}`
            );
            fetchComments();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div style={{ marginTop: "30px", marginRight: "10vh", marginLeft: "10vh" }}>
            <Card sx={{ p: 2, mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Leave a Comment
                </Typography>
                {deleteWarning && (
                    <Typography variant="subtitle1" color="error">
                        {deleteWarning}
                    </Typography>
                )}
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
                <div style={{ display: "flex", alignItems: "center" }}>
                       <Input type="number" value={newRating} onChange={handleRatingChange} sx={{ mr: 2 }} />
                    <Button
                        variant="contained"
                        onClick={handleCommentSubmit}
                        disabled={newComment.length === 0 || newRating < 0 || newRating > 10}
                    >
                        Submit
                    </Button>
                </div>
            </Card>
            {comments.map((comment) => (
                <Card sx={{ p: 2, mb: 4 }} key={comment.id}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {comment.user}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        {comment.date}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {comment.review}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Rating: {comment.rating}
                    </Typography>
                    {authUser.username === comment.user && (
                        <Button
                            variant="contained"
    onClick={() => handleCommentDelete(comment.id)}
                        >
                            Delete
                        </Button>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default FilmComments;

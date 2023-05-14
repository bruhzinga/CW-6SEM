import React, { useState, useEffect, useRef } from "react";
import {
    Button,
    Card,
    Divider,
    Input,
    Typography,
} from "@mui/material";
import { CommentOutlined } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const FilmComments = () => {
    const { user: authUser } = useSelector((x) => x.auth);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [deleteWarning, setDeleteWarning] = useState(null);
    const [buttonDisable, setButtonDisable] = useState(false);
    const { id } = useParams();
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_API_URL, { transports: ["websocket"] });

        // Send a request for the current comments when the component mounts
        socketRef.current.emit("comments:get", id);

        // Listen for incoming comments and update the state when they arrive
        socketRef.current.on("comments:received", (data) => {
            const formattedData = data.Comment.map((entry) => ({
                id: entry.id,
                user: entry.User.username,
                review: entry.content,
                rating: entry.rating,
                date: new Date(entry.createdOn).toLocaleString(),
            }));
            setComments(formattedData);
        });



        socketRef.current.on('comment:error',() =>{
            setDeleteWarning("You have already reviewed this movie")
        });

        socketRef.current.on('comment:added',(comment) =>{
            console.log('success',comment)
            setComments((prevComments) => [
                ...prevComments,
                {
                    id: comment.id,
                    user: comment.User.username,
                    review: comment.content,
                    rating: comment.rating,
                    date: new Date(comment.createdOn).toLocaleString(),
                },
            ]);
        });


       socketRef.current.on('comment:deleted',(commentId) =>{
           console.log('deleted',commentId)
           setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
         });

        return () => {
            socketRef.current.disconnect();
        };
    }, [id]);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleRatingChange = (event) => {
        const value = event.target.value;
        if(value < 0 || value > 10){
            setButtonDisable(true);
        }
        else {
            setNewRating(event.target.value);
            setButtonDisable(false);
        }
    };

    const handleCommentSubmit = () => {
        const comment = {
            content: newComment,
            rating: +newRating,
            movieId: +id,
        };
        const data = {comment,username:authUser.username}
        socketRef.current.emit("comments:add", data);
        setNewComment("");
        setNewRating(0);
    };

    const handleCommentDelete = (commentId) => {
        const data = {commentId:commentId,username:authUser.username};
        socketRef.current.emit("comments:delete", data);
        setDeleteWarning("");


    };

    return (
        <div
            style={{
                marginTop: "30px",
                marginRight: "10vh",
                marginLeft: "10vh",
            }}
        >
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
                    <Input
                        type="number"
                        value={newRating}
                        onChange={handleRatingChange}
                        sx={{ mr: 2 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleCommentSubmit}
                        disabled={buttonDisable}
                    >
                        Submit
                    </Button>
                </div>
            </Card>
            {comments.map((comment) => (
                <Card sx={{ p: 2, mb: 4 }} key={comment.id}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {comment.user}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        {comment.date}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 ,wordWrap: 'break-word'}}>
                        {comment.review}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Rating: {comment.rating}
                    </Typography>
                    {authUser && authUser.username === comment.user && (
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
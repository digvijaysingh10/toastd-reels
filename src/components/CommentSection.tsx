import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CommentSectionProps = {
  comments: string[];
  onAddComment: (comment: string) => void;
  isVisible: boolean;
  onClose: () => void;
};

const CommentSection: React.FC<CommentSectionProps> = React.memo(({ comments, onAddComment, isVisible, onClose }) => {
  const [newComment, setNewComment] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex justify-center items-center bg-gray-900 bg-opacity-20">
      <div className="bg-white p-6 shadow-lg max-w-screen-xl rounded-xl w-full relative">
        <Button onClick={onClose} className="absolute top-2 right-2 text-sm shadow-none bg-transparent">X</Button>
        <div className="space-y-3">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="p-2 rounded-2xl rounded-bl-none bg-gray-500 flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-semibold">Anonymous User</p>
                  <p>{comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          )}
          <div className="flex gap-2">
            <Input
              type="text"
              value={newComment}
              onChange={handleChange}
              placeholder="Add a comment..."
              className="text-black"
            />
            <Button
              onClick={() => {
                if (newComment.trim()) {
                  onAddComment(newComment);
                  setNewComment('');
                }
              }}
              className="bg-black text-white hover:text-black"
            >
              Comment
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
});
CommentSection.displayName = 'CommentSection';
export default CommentSection;

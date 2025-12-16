export type UserDTO = {
    id: string;
    auth0Sub: string;
    username?: string;
};

export type QuizDTO = {
    id: string;
    title: string;
    description?: string;
};
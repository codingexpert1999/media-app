USE socialmedia;

ALTER DATABASE socialmedia CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Tables
CREATE TABLE users(
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(150) NOT NULL
);

CREATE TABLE profiles(
	id INT AUTO_INCREMENT PRIMARY KEY,
    profile_image VARCHAR(255) NOT NULL,
    profile_description VARCHAR(250) DEFAULT '',
    friends INT DEFAULT 0,
    posts INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'public',
    is_active BOOL,
    user_id INT,
    KEY userID(user_id),
    CONSTRAINT userID FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE profiles ADD COLUMN is_active BOOL DEFAULT FALSE;

CREATE TABLE posts(
	id INT AUTO_INCREMENT PRIMARY KEY,
    post_text VARCHAR(3000),
    post_image VARCHAR(150),
    post_video VARCHAR(150),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_id INT,
    KEY profileID_post(profile_id),
    CONSTRAINT profileID_post FOREIGN KEY(profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE comments(
	id INT AUTO_INCREMENT PRIMARY KEY,
    comment_text VARCHAR(1500),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_id INT,
    profile_id INT,
    KEY postID(post_id),
    CONSTRAINT postID FOREIGN KEY(post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY profileID_comment(profile_id),
    CONSTRAINT profileID_comment FOREIGN KEY(profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE answers(
	id INT AUTO_INCREMENT PRIMARY KEY,
    answer_text VARCHAR(1500),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment_id INT,
    profile_id INT,
    KEY commentID(comment_id),
    CONSTRAINT commentID FOREIGN KEY(comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY profileID_answer(profile_id),
    CONSTRAINT profileID_answer FOREIGN KEY(profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE friends(
	id INT AUTO_INCREMENT PRIMARY KEY,
    my_profile_id INT,
    friend_profile_id INT,
    KEY profileID1_friends(my_profile_id),
    CONSTRAINT profileID1_friends FOREIGN KEY(my_profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY profileID2_friends(friend_profile_id),
    CONSTRAINT profileID2_friends FOREIGN KEY(friend_profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE friend_requests(
	id INT AUTO_INCREMENT PRIMARY KEY,
    sender_profile_id INT,
    receiver_profile_id INT,
    KEY profileID1_requests(sender_profile_id),
    CONSTRAINT profileID1_requests FOREIGN KEY(sender_profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY profileID2_requests(receiver_profile_id),
    CONSTRAINT profileID2_requests FOREIGN KEY(receiver_profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE notifications(
	id INT AUTO_INCREMENT PRIMARY KEY,
    notification_type ENUM('friend_request', 'accepted_request', 'like', 'comment'),
    notification VARCHAR(255),
    interactions INT DEFAULT 1,
    seen BOOL DEFAULT FALSE,
    post_id INT NULL,
    comment_id INT NULL,
    answer_id INT NULL,
    profile_id INT,
    sender_profile_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY profileID_notification(profile_id),
    CONSTRAINT profileID_notification FOREIGN KEY(profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY profileID2_notification(sender_profile_id),
    CONSTRAINT profileID2_notification FOREIGN KEY(sender_profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY interacted_postID(post_id),
    CONSTRAINT interacted_postID FOREIGN KEY(post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY interacted_commentID(comment_id),
    CONSTRAINT interacted_commentID FOREIGN KEY(comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY interacted_answerID(answer_id),
    CONSTRAINT interacted_answerID FOREIGN KEY(answer_id) REFERENCES answers(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE posts_liked(
	id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    post_id INT,
    KEY profileID_posts_liked(profile_id),
    CONSTRAINT profileID_posts_liked FOREIGN KEY(profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY postID_posts_liked(post_id),
    CONSTRAINT postID_posts_liked FOREIGN KEY(post_id) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE comments_liked(
	id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    comment_id INT,
    KEY profileID_comments_liked(profile_id),
    CONSTRAINT profileID_comments_liked FOREIGN KEY(profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY commentID_posts_liked(comment_id),
    CONSTRAINT commentID_posts_liked FOREIGN KEY(comment_id) REFERENCES comments(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE answers_liked(
	id INT AUTO_INCREMENT PRIMARY KEY,
    profile_id INT,
    answer_id INT,
    KEY profileID_answers_liked(profile_id),
    CONSTRAINT profileID_answers_liked FOREIGN KEY(profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY postID_answers_liked(answer_id),
    CONSTRAINT postID_answers_liked FOREIGN KEY(answer_id) REFERENCES answers(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE conversations(
	id INT AUTO_INCREMENT PRIMARY KEY,
    profile_1_id INT,
    profile_2_id INT,
    KEY convoProfile1ID(profile_1_id),
    CONSTRAINT convoProfile1ID FOREIGN KEY(profile_1_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY convoProfile2ID(profile_2_id),
    CONSTRAINT convoProfile2ID FOREIGN KEY(profile_2_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE messages(
	id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(1000),
    seen BOOL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_icon BOOL DEFAULT FALSE,
    profile_id INT,
    conversation_id INT,
    KEY senderID(profile_id),
    CONSTRAINT senderID FOREIGN KEY(profile_id) REFERENCES profiles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    KEY conversationID(conversation_id),
    CONSTRAINT conversationID FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE profile_images(
	id INT AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(150),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_id INT,
    KEY profileID2(profile_id),
    CONSTRAINT profileID2 FOREIGN KEY(profile_id) REFERENCES profiles(id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE profile_images ADD CONSTRAINT profilePic UNIQUE INDEX(profile_id, image_path);

DESC profile_images;

INSERT INTO profile_images(profile_id, image_path) VALUES(2, 'https://codingexpert-media-app.fra1.digitaloceanspaces.com/profile-2/udemy-logo.jpg');

-- Procedures
DELIMITER $$
CREATE PROCEDURE registerUser(
	IN username VARCHAR(100),
    IN email VARCHAR(100),
    IN password VARCHAR(150),
    IN profile_image VARCHAR(255)
)
BEGIN
	INSERT INTO users(username, email, password) VALUES(username, email, password);
    SET @user_id = 0;
    SELECT @user_id := id FROM users WHERE username=username AND email=email;
    INSERT INTO profiles(profile_image, user_id) VALUE(profile_image, @user_id);
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE acceptFriendRequest(
	IN sender_profile_id INT,
    IN receiver_profile_id INT,
    IN username VARCHAR(100)
)
BEGIN
	DELETE FROM friend_requests as fr WHERE fr.sender_profile_id=sender_profile_id AND fr.receiver_profile_id=receiver_profile_id;
    INSERT INTO friends(my_profile_id, friend_profile_id) VALUES(receiver_profile_id, sender_profile_id);
    
    SET @profile_friends = 0;
    SELECT @profile_friends := friends FROM profiles WHERE id=receiver_profile_id;
    UPDATE profiles SET friends=@profile_friends + 1 WHERE id=receiver_profile_id;
    
    SET @profile_friends = 0;
    SELECT @profile_friends := friends FROM profiles WHERE id=sender_profile_id;
    UPDATE profiles SET friends=@profile_friends + 1 WHERE id=sender_profile_id;
    
    INSERT INTO notifications(notification_type, notification, profile_id, sender_profile_id) 
    VALUES('accepted_request', CONCAT(username, ' ', 'accepted your friend request!'), sender_profile_id, receiver_profile_id);
    
    DELETE FROM notifications WHERE profile_id=receiver_profile_id AND sender_profile_id=sender_profile_id AND notification_type='friend_request';
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE hitLikeButton(
	IN like_this BOOLEAN,
    IN button_clicked_for ENUM('post', 'comment', 'answer'),
    IN number_of_likes INT,
    IN post_id INT,
    IN comment_id INT,
    IN answer_id INT,
    IN profile_id INT
)
BEGIN
	IF button_clicked_for='post' THEN
		IF like_this IS TRUE THEN
            UPDATE posts SET likes=number_of_likes+1 WHERE id=post_id;
			INSERT INTO posts_liked(post_id, profile_id) VALUES(post_id, profile_id);
        ELSE
			UPDATE posts SET likes=number_of_likes-1 WHERE id=post_id;
			DELETE FROM posts_liked AS pl WHERE pl.post_id=post_id AND pl.profile_id=profile_id;
        END IF;
    ELSEIF button_clicked_for='comment' THEN
		IF like_this IS TRUE THEN
            UPDATE comments SET likes=number_of_likes+1 WHERE id=comment_id;
			INSERT INTO comments_liked(comment_id, profile_id) VALUES(comment_id, profile_id);
        ELSE
			UPDATE comments SET likes=number_of_likes-1 WHERE id=comment_id;
			DELETE FROM comments_liked AS cl WHERE cl.comment_id=comment_id AND cl.profile_id=profile_id;
        END IF;
    ELSEIF button_clicked_for='answer' THEN
		IF like_this IS TRUE THEN
            UPDATE answers SET likes=number_of_likes+1 WHERE id=answer_id;
			INSERT INTO answers_liked(answer_id, profile_id) VALUES(answer_id, profile_id);
        ELSE
			UPDATE answers SET likes=number_of_likes-1 WHERE id=answer_id;
			DELETE FROM answers_liked AS al WHERE al.answer_id=answer_id AND al.profile_id=profile_id;
        END IF;
	END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE deleteImage(
	IN _profile_id INT,
    IN _image VARCHAR(255)
)
BEGIN
	DECLARE current_profile_image VARCHAR(255);
    DECLARE new_profile_image VARCHAR(2525) DEFAULT NULL;
    
    SELECT profile_image INTO current_profile_image FROM profiles WHERE id=_profile_id;
    
    DELETE FROM profile_images WHERE profile_id=_profile_id AND image_path=_image;
    
    IF current_profile_image=_image THEN
		SELECT image_path INTO new_profile_image FROM profile_images WHERE profile_id=_profile_id ORDER BY uploaded_at DESC LIMIT 1;
        
        IF new_profile_image IS NULL THEN
			UPDATE profiles SET profile_image="/assets/user.png" WHERE id=_profile_id;
        ELSE
			UPDATE profiles SET profile_image=new_profile_image WHERE id=_profile_id;
        END IF;
        
    END IF;
END $$
DELIMITER ;

DROP PROCEDURE deleteImage;

-- Queries 
SELECT * FROM users;
SELECT * FROM profiles;

SELECT * FROM profile_images;

SELECT id, image_path FROM profile_images WHERE profile_id=2;

SELECT * FROM posts;
SELECT * FROM comments;
SELECT * FROM answers;

DELETE FROM posts WHERE id>0;
DELETE FROM notifications WHERE id>0;

SELECT * FROM friend_requests;
SELECT * FROM friends;
SELECT * FROM notifications;

SELECT * FROM posts_liked;
SELECT * FROM comments_liked;
SELECT * FROM answers_liked;

SELECT * FROM conversations;
SELECT * FROM messages;

DELETE FROM messages WHERE id>0;

-- SELECT posts updated query
SELECT DISTINCT(p.id), p.post_text, p.post_image, p.post_video, p.likes, p.created_at, p.profile_id, prof.profile_image, u.username FROM posts as p 
LEFT JOIN friends as f ON f.my_profile_id=2 OR f.friend_profile_id=2
INNER JOIN profiles as prof ON prof.id=p.profile_id 
INNER JOIN users as u ON u.id=prof.user_id
WHERE p.profile_id=2 OR (p.profile_id=f.friend_profile_id AND f.friend_profile_id!=2) 
OR (p.profile_id=f.my_profile_id AND f.my_profile_id!=2) ORDER BY p.created_at DESC LIMIT 0, 10;

SELECT c.id, c.comment_text, c.likes, c.created_at, c.profile_id, u.username FROM comments as c 
INNER JOIN profiles as p ON c.profile_id=p.id INNER JOIN users as u ON u.id=p.user_id
WHERE c.post_id=4 ORDER BY c.created_at DESC LIMIT 0, 3;

SELECT a.id, a.answer_text, a.likes, a.created_at, a.profile_id, u.username FROM answers as a 
INNER JOIN profiles as p ON a.profile_id=p.id INNER JOIN users as u ON u.id=p.user_id
WHERE a.comment_id=4 ORDER BY a.created_at DESC LIMIT 0, 3;

SELECT f.id, f.my_profile_id, f.friend_profile_id, u.username FROM friends AS f 
INNER JOIN profiles AS p ON (f.my_profile_id=p.id OR f.friend_profile_id=p.id)
INNER JOIN users AS u ON u.id=p.user_id
WHERE (f.my_profile_id=2 OR f.friend_profile_id=2) AND username!='mike12';

SELECT f.id, IF(f.friend_profile_id=2, f.my_profile_id, f.friend_profile_id) as friend_profile_id, p.is_active, u.username FROM friends AS f 
INNER JOIN profiles AS p ON (f.my_profile_id=p.id OR f.friend_profile_id=p.id)
INNER JOIN users AS u ON u.id=p.user_id
WHERE (f.my_profile_id=2 OR f.friend_profile_id=2) AND username!='mike12';

SELECT n.id, n.notification_type, n.notification, n.sender_profile_id, n.seen, n.created_at, p.profile_image
FROM notifications AS n INNER JOIN profiles AS p ON p.id=n.sender_profile_id
WHERE n.seen=0 AND n.profile_id=2 ORDER BY created_at DESC;

SELECT * FROM conversations WHERE profile_1_id=1 OR profile_2_id=1;

UPDATE profiles SET is_active=FALSE WHERE id=1;

DELETE FROM messages WHERE id>0;

SELECT * FROM profiles;
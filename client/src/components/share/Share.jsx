//Components
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

//Utils
import { requestConfig, getToLocalStorage } from "../../utils/config";

//Hooks
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//Css
import styles from "./Share.module.css";

//Images
import noPicture from "../../assets/person/noPicture.webp";

//Icons
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Description,
  Cancel,
} from "@mui/icons-material";

const Share = ({ onPostCreated }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [location, setLocation] = useState("");
  const [feelings, setFeelings] = useState("");
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      const token = getToLocalStorage("user")?.token;
      const config = requestConfig("GET", null, token);
      try {
        const res = await fetch(
          `/api/users/username/${encodeURIComponent(currentUser.username)}`,
          config
        );
        const result = await res.json();

        if (result.errors) {
          setError(result.errors);
          return;
        }

        setUser(result);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
        setError("Error fetching users!");
        setUser({});
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      setLoading(false);
    };
  }, [currentUser.username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newPost = {
      userId: currentUser._id,
      description,
      // tags,
      // location,
      // feelings,
    };

    let payload = newPost;

    if (file) {
      const formData = new FormData();
      Object.keys(newPost).forEach((key) => {
        formData.append(key, newPost[key]);
      });
      formData.append("img", file);
      payload = formData;

      // Listando o conteúdo do FormData - apenas para verificação
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          //console.log(`${key}: ${value.name}`);
        } else {
          //console.log(`${key}: ${value}`);
        }
      }
    }

    const token = getToLocalStorage("user")?.token;
    const config = requestConfig("POST", payload, token);
    try {
      const res = await fetch(`/api/posts/register`, config);
      const result = await res.json();

      if (result.errors) {
        setError(result.errors);
        return;
      }

      if (!result.errors) {
        setDescription("");
        setFile(null);
        setTags([]);
        setLocation("");
        setFeelings("");

        if (onPostCreated) {
          onPostCreated();
        }
      }
    } catch (error) {
      console.error("Error registering post:", error);
      setError("Erro ao postar. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.shareContainer}>
      <div className={styles.shareWrapper}>
        <div className={styles.shareTop}>
          <Link to={`/profile/${user.username}`}>
            <img
              className={styles.shareProfileImg}
              src={user.profilePicture || noPicture}
              alt=""
            />
          </Link>
          <input
            type="text"
            value={description}
            placeholder={`What's in your mind ${user.username}?`}
            className={styles.shareInput}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <hr className={styles.shareHr} />
        {file && (
          <div className={styles.shareImgContainer}>
            <img
              className={styles.shareImg}
              src={URL.createObjectURL(file)}
              alt="Preview"
            />
            <Cancel
              className={styles.shareCancelImg}
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <form className={styles.shareBottom} onSubmit={handleSubmit} noValidate>
          <div className={styles.shareOptions}>
            <label htmlFor="file" className={styles.shareOption}>
              <PermMedia htmlColor="tomato" className={styles.shareIcon} />
              <span className={styles.shareOptionText}>Photo or Video</span>
              <input
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg,.webp"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className={styles.shareOption}>
              <Label htmlColor="blue" className={styles.shareIcon} />
              <span className={styles.shareOptionText}>Tag</span>
            </div>
            <div className={styles.shareOption}>
              <Room htmlColor="green" className={styles.shareIcon} />
              <span className={styles.shareOptionText}>Location</span>
            </div>
            <div className={styles.shareOption}>
              <EmojiEmotions
                htmlColor="goldenrod"
                className={styles.shareIcon}
              />
              <span className={styles.shareOptionText}>Feelings</span>
            </div>
          </div>
          <button type="submit" className={styles.shareButton}>
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;

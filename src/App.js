import logo from './logo.svg';
import './minireset.min.css';
import './App.css';

function App() {
    return (
        <main>
            <header onLoad={fetchPosts}>
                <a href="https://github.com/sammdu">
                    <img src={logo} alt={"Samm Logo"} id="topLogo"></img>
                </a>
                <div>
                    <h3>Cloudflare Recruiting</h3>
                    <h1>Social Media App</h1>
                </div>
            </header>
            <form name="newPost" className={"compose card"} onSubmit={submitPost}>
                <input type="text" id="postTitle" name="title" placeholder={"Title of your post"} required />
                <span>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required></input>
                </span>
                <textarea rows="4" cols="40" id="content" placeholder={"Type your post content here..."} required />
                <button type="submit">Post</button>
            </form>
            <section className={"posts"}></section>
        </main>
    );
}

async function submitPost(event) {
    event.preventDefault();

    let post_body = {
        "title": document.getElementById('postTitle').value,
        "username": document.getElementById('username').value,
        "content": document.getElementById('content').value
    };

    try {
        await fetch("https://cf-backend.sammdu.workers.dev/posts", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(post_body, null, 4)
        });
        document.getElementById('postTitle').value = '';
        document.getElementById('username').value = '';
        document.getElementById('content').value = '';

        await fetchPosts();
    } catch (e) {
        console.log(e);
        console.log(post_body);
    }
}

async function fetchPosts() {
    try {
        // fetch a list of all posts from backend
        const response = await fetch("https://cf-backend.sammdu.workers.dev/posts");
        // get the posts section element
        const postsSection = document.querySelector(".posts");

        // either show no posts or start populating posts
        if (response.status === 404) {
            postsSection.innerHTML = "<center>" + await response.text() + "</center>";
        }
        else {
            const postsArray = await response.json();
            // append each post to the posts section on the page after clearing the section
            postsSection.innerHTML = '';
            for (const post of postsArray) {
                const postElem = makePostELem(post.id, post.title, post.username, post.content);
                postsSection.prepend(postElem);
            }
        }
    }
    catch (e) {
        console.log(e);
    }
}

function makePostELem(id, title, user, content) {
    // create the outer post element
    const postElem = document.createElement("div");
    postElem.className = "card post";

    // create the post title element and append it to the post element
    const postTitle = document.createElement("h3");
    postTitle.textContent = title;
    postElem.appendChild(postTitle);

    // create the post username element and append it to the post element
    const userName = document.createElement("span");
    userName.className = "post-user"
    userName.textContent = "> " + user;
    postElem.appendChild(userName);

    // create the post content element and append it to the post element
    const postContent = document.createElement("p");
    postContent.className = "post-content";
    postContent.textContent = content;
    postElem.appendChild(postContent);

    // create the post ID element and append it to the post element
    const idSpan = document.createElement("span");
    idSpan.className = "post-id";
    idSpan.textContent = id;
    postElem.appendChild(idSpan);

    return postElem;
}

export default App;

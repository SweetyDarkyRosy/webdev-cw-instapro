import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { toggleLike } from "../api.js";
import { formatDistanceToNow } from "date-fns";


export function renderUserPostsPageComponent({ appEl }) {
	console.log("Актуальный список постов:", posts);

	const appHtml = `
		<div class="page-container">
			<div class="header-container"></div>
			<div class="posts-user-header">
				<img src="" class="posts-user-header__user-image">
				<p class="posts-user-header__user-name"></p>
			</div>
			<ul class="posts"></ul>
		</div>`;

	const postHtmlCode = `
		<div class="post-image-container">
			<img class="post-image" src="">
		</div>
		<div class="post-likes">
			<button data-post-id="" class="like-button">
				<img src="">
			</button>
			<p class="post-likes-text"></p>
		</div>
		<p class="post-text">
			<span class="user-name"></span>
		</p>
		<p class="post-date"></p>`;

	appEl.innerHTML = appHtml;

	renderHeaderComponent({
			element: document.querySelector(".header-container"),
		});


	// ----- Filling the user-specific page header -----

	if (posts.length == 0)
	{
		throw new Error("У данного пользователя нет постов");
	}

	let elBeingEdited = document.querySelector(".posts-user-header__user-image");
	elBeingEdited.setAttribute("src", posts[0].user.imageUrl);

	elBeingEdited = document.querySelector(".posts-user-header__user-name");
	elBeingEdited.innerHTML = ("src", posts[0].user.name);


	const postList = document.querySelector(".posts");

	for (const postData of posts)
	{
		let post = document.createElement('li');
		post.classList.add("post");
		post.innerHTML = postHtmlCode;


		// ----- Filling the user name data -----

		elBeingEdited = post.querySelector(".user-name");
		elBeingEdited.innerHTML = postData.user.name;


		// ----- Setting the post image URL -----

		elBeingEdited = post.querySelector(".post-image");
		elBeingEdited.setAttribute("src", postData.imageUrl);
	
	
		// ----- Filling the post comment -----
	
		elBeingEdited = post.querySelector(".post-text");
		const postComment = document.createTextNode(postData.description);
		elBeingEdited.appendChild(postComment);
	
	
		// ----- Sets the time distance -----
	
		elBeingEdited = post.querySelector(".post-date");
		elBeingEdited.innerHTML = formatDistanceToNow(new Date(postData.createdAt),
			{ includeSeconds: true });
	
	
		// ----- Like block initialisation -----
	
		elBeingEdited = post.querySelector(".post-likes-text");
	
		if (postData.likes.length == 0)
		{
			elBeingEdited.innerHTML = "Нравится: <strong>0</strong>";
		}
		else if (postData.likes.length == 1)
		{
			elBeingEdited.innerHTML = "Нравится: <strong>" + postData.likes[0].name + "</strong>";
		}
		else
		{
			elBeingEdited.innerHTML = "Нравится: <strong>" + postData.likes[0].name + " и ешё " + (postData.likes.length - 1) + "</strong>";
		}

		elBeingEdited = post.querySelector(".like-button");
		elBeingEdited.setAttribute("data-post-id", postData.id);

		if (postData.isLiked === true)
		{
			elBeingEdited.innerHTML = '<img src="./assets/images/like-active.svg">';
		}
		else
		{
			elBeingEdited.innerHTML = '<img src="./assets/images/like-not-active.svg">';
		}


		elBeingEdited.addEventListener("click", (event) => {
				event.stopPropagation();
				const targetEl = event.currentTarget;

				const token = getToken();
				if (token == undefined)
				{
					return;
				}

				let isLiked;
				if (targetEl.querySelector("img").getAttribute("src") === "./assets/images/like-active.svg")
				{
					isLiked = true;
				}
				else
				{
					isLiked = false;
				}

				toggleLike({
					postId: targetEl.getAttribute("data-post-id"),
					isLiked: isLiked,
					token: token,}).then((isToggled) => {
							if (isToggled == true)
							{
								goToPage(USER_POSTS_PAGE, {
										userId: posts[0].user.id,
									});
							}
						}).catch((error) => {
								console.warn(error);
								setError(error.message);
							});
			});
		
		postList.appendChild(post);
	}
}

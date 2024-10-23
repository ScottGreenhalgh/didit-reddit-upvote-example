## Upvote

Upvote is a Reddit-esque web application that allows users to create posts, upvote and downvote posts, and comment on posts in a multi-threaded, nested list.

The project is built using Next.js with the /app router and [Tailwind CSS](https://tailwindcss.com/), and uses [Auth.js (formerly Next Auth)](https://authjs.dev/) for user authentication. The data is stored in a Postgres database, which is created and accessed with raw SQL queries using the `pg` package.

The project is a work in progress and is not yet complete.

## Features

- [x] View a list of posts
- [x] View a single post
- [x] Create a post
- [x] Upvote and downvote posts
- [x] Pagination of posts
- [x] Comment on posts
- [x] Nested comments (recursive lists)
- [x] User authentication

## Setup instructions

1. Fork the repository (check "copy the main branch only") and clone your fork to your local machine
2. Run `npm install`
3. Create a `.env.local` file in the root directory and add the following environment variables:
   - `DATABASE_URL` - the URL of your Postgres database (eg. the Supabase connection string)
   - `AUTH_SECRET` - the Next Auth secret string (this can be anything at all like a password, but keep it secret!)
   - `AUTH_GITHUB_ID` - the GitHub OAuth client ID (create yours in [Github developer settings](https://github.com/settings/developers)
   - `AUTH_GITHUB_SECRET` - the GitHub OAuth client secret (create this in [Github developer settings](https://github.com/settings/developers))
4. Create the database schema by running the SQL commands in `schema.sql` in your database (eg. by running the commands in Supabase Query Editor)
5. Run `npm run dev` to start the development server
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the site

## Potential future features

- [x] User profiles
- [x] Sorting posts by recent (date posted), top (most upvotes), and most controversial (most upvotes _and_ downvotes)
- [x] User karma scores
- [ ] User badges / trophies (awards for achievements like number of posts, years on the site, etc.)
- [x] User settings (eg. number of posts per page, theme, etc.)
- [ ] Moderation tools / reporting or flagging objectionable comments for removable by admins
- [ ] Searching posts (possibly using simple SQL LIKE '%some search%', or [Postgres text search](https://www.crunchydata.com/blog/postgres-full-text-search-a-search-engine-in-a-database))
- [ ] Subreddits (separate communities, that isn't just one big list of posts, that can be created by users)
- [ ] User notifications
- [ ] User private messaging
- [ ] User blocking
- [ ] User following
- [ ] User feed (posts from users you follow)
- [ ] User flair

## Reflection

This project is a little different to what I've previously been doing. All prior projects involved creating something from the ground up. The nice thing about this one was not needing to do all the preliminary setup process which saved a substantial amount of time.

### Setup

To get this project in a working condition, I needed to setup a github auth where the instructions are listed above. This was a relatively straightforward process. This video helped a fair bit with the procedure: https://www.youtube.com/watch?v=H-1ozULYdyc. From here I just needed to setup my .env file with the correct variables outlined in the template and I was up and running.

From here I needed to get my tables built and my postgresql database url added to the .env too. I had to rename one of the tables called `comments` to `d_comments` because I already had a table called comments under that database url. Besides that I thought it would be best not to change how the tables looked to avoid breaking anything existing. Then I just renamed any instance where comments was used in the project to d_comments so everything worked as intended.

### Initial bugs

There were a few initial bugs that needed ironing out. I can't remember exactly what they were, I just remember whenever I encountered the issue, I just had a read of the error message given when loading the page in browser via npm run dev and it would usually be very descriptive of what the problem is. I believe the first thing I changed was the img tag to an Image tag from next/image because this is more optimised for next applications.

From here I also added a not-found.jsx and error.jsx file under the app router to handle any problems that might appear. Then I added some metadata to the top of each page so I could clearly see what I was looking at at any given time using the tabs.

I also noticed in one of the db request being made, sql injection mitigations were not being used, so I also fixed that.

### Refactoring

Every programmer makes things slightly different to each other. This is something I've always known, and became quite apparent during prior group projects and had to be accounted for. However, since I was now working on this alone, I could change this to suit my needs, so I started by moving things around to how I prefer them. I removed all of the header content found inside the layout.jsx file into its own Header component. This required me to do a little fiddling to get the client and server components to work. This was because initially under the LoginButton and LogoutButton components there was a "use server" and it appears that even when I didn't specify if my Header was a client component, it seemed to be treating it as one. So I moved all of the logic from UserInfo into the header and deleted it but still had the issue. So I just moved the content inside the button components into the header too and deleted them also.

I also didn't like how all the posts were in a component, where the page was basically empty, just calling the component. There didn't seem like there was a reason for this, so I just moved all of this logic into the page. Umtil later when I found there was a reason under the page route, which didn't seem to have much of a usage when I initially looked because I didn't have enough posts on the page. So I moved this back to how it was.

## Additonal features

From here I wanted to add some additonal features. So I just started at the top of the list and worked my way down. The features I completed are marked using the tick boxes above the reflection.

### User Page

The first feature added was the user page. This was relatively simple to add. I simply created a new route under `app/u/[username]/page.jsx` with the u acting as a spacer to prevent usernames such as post from causing problems with the routes. From here I just modified the query which grabbed all the posts and instead made it check the username matched the given post.

### Sorting

With the easiest change implemented, I turned my attention to search parameters and how I could use them to filter posts based on the url value. I knew it was essential to use search params for this since the db query is handled on the server. With button interaction, the most reliable method I have for sending information from client to server is search parameters. http requests were another option, but that seemed redundant given the minimal information I'm sending and recieving. Problems did start here however, when making my buttons it kept complaining about passing functions to the client:

```
Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".
```

This was an issue last time I did this, so my initial reaction was to wrap the button in a form, something that fixed my issue last time I did this, however the error persisted. I believe this was something to do with how I was passing this function to the client. After going around in circles for a couple hours trying various different things, I eventually had the sudden realisation that to do what I was asking of it, I needed to give it a callback function. To give some context I was initially trying to do something like this:

```jsx
<form action={handleSort}>
  <input type="hidden" name="sortBy" value="asc" />
  <button type="submit">Sort: A-Z</button>
</form>
```

My intent here was to grab the formdata through the action and then obtain the value, in this example this was asc which I could then append to the url. I believe the reason this doesn't work is because the function is sent to the client on render which is handled server side. If I use a callback to the function instead I believe it only hands it off when it's needed, or something similar. For me, it's still mostly a guessing game as to why this happens, all I know is I can't pass the function directly to the client. Instead I did this:

```jsx
<button type="button" onClick={(e) => handleSort(e, "asc")}>
  Sort: A-Z
</button>
```

With that hurdle out of the way, the rest of the process was relatively simple. I applied some basic tailwind css styling on the buttons to have them align in a row and spaced apart. Then I placed the component above the posts.

### Karma

Next up was the user karma score, which I needed to create a new db request to handle. Since the karma would be user specific I decided I would handle this on the previously created user page. To created the query I needed to pay close attention to the tables given in schema.sql to work out exactly how I was going to get the information I needed. So I started by pasting all the images into a seperate document and drawing arrows. So the flow of data would be from the users table given the username, grabbing the id. Taking this value and passing it to the posts table where I would find all post_id's where the user_id matches the id taken from the users table. From here I would compare these post_id's with the votes table and grab all the entries that match this. Then I would get the vote (either 1 or -1). I would then sum all the values together to get the votes. I would wrap this in COALESCE to make sure the result would output 0 instead of null, because a null would break everything. While I was here I also got a sum of the postitive 1 values and a sum of the negative -1 values to get a total of upvotes and downvotes that user has recieved.

With the query sorted I could take these outputted values and apply them to the user page.

### Post per page

Here I took a look at posts per page. This was when I had a look at the page route and realised my earlier refactoring broke multiple pages because I deleted the component it relied on. I think in future I need to be a little less heavy handed with just deleting things before checking if they're used anywhere first. Anyway, having restored this, I needed to tackle user defined posts per page. Currently the default value for this is defined under config.js (which I moved to utils for organisation). Since search params worked quite nicely last time I thought it would be a good idea to use them again for this project. They're relatively easy to implament and seem to easily send data back to the server without a huge http request headache. So I made a slider under my buttons and passed a function to it, similar to how I did previously and handled creating query strings the same way. As for reading them, I simply changed POSTS_PER_PAGE in the db request to the result of the search params, defaulting to the config value if none is given.

### TipTap

Towards the end of the process I decided to explore TipTap to allow users to write HTML for their posts so the look a little nicer. This was at least the initial plan, but things fell apart once I finally got it to a working state. It seems that posts submitted by a TipTap EditorContent component (as a replacement for textarea), the data encapsulated in p tags, and any html elements are surrounded by quotes, preventing them from actually rendering. Now this could either be due to my form submission, or because I'm sanatizing the post.body before applying it to the page (using dompurify, which prevents helps prevent dangerous html from running on the page). AFter manually checking the database, I can see it's a form submit problem, or possibly how postgres stores the data. Either way, functionality seems to remain as it was, so to prevent breaking things further, I can use this small exploration of a new library to research this more down the line.

Given more time, the rest of the features could eventually be added, but since this was designed to be a short project I believe this is good for now.

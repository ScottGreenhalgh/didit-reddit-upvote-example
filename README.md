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
- [ ] User settings (eg. number of posts per page, theme, etc.)
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

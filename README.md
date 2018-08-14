# look-id

<p align="center">
<img src="/client/public/assets/logo.png"  />
</p>

<p align="center">Find what you want to wear.</p>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Used](#tech-used)
- [Installation & Usage](#installation--usage)
  - [Getting Started](#getting-started)
  - [Concurrently](#concurrently)
  - [Cloudinary](#cloudinary)
  - [Saving Images to a Local Folder](#saving-images-to-a-local-folder)
    - [Profile Routes](#profile-routes)
- [Credits](#credits)


# Introduction
LookID is a website that is for budget shoppers and people looking to be a part of a fashionable community.


# Features
A few things that you can do on LookID:

- Query for clothing items and filter your search by color and price
- Upload images and describe clothing items
- Comment and like on posts
- Save your favorite posts to a board
- Update your post's items and caption
- User notifications
- Follow other users


# Tech Used
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Express](https://expressjs.com/)
- [NodeJS](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/download-center#community)


# Installation & Usage


## Getting Started

If you prefer to use a hosted version of MongoDB instead of downloading MongoDB locally, use [mLab](https://mlab.com/). There's a free sandbox version available for use.

Clone or download the repository:
```
git clone https://github.com/treykris/look-id.git
```
In the root application directory run the following commands:
```
npm install 
cd client
npm install
```

Before you run LookID, go into server.js (Line 73) and add a session secret string for the session. 

(Recommended) - Use a random string for your session secret. Create a .env file and store that session secret string in an environment variable.

```
app.use(session({
    cookie: {
        // Live for one day
        maxAge: 24 * 60 * 100 * 1000
    },
    secret: (ENTER SESSION SECRET HERE),
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
```

In the root application directory run:
```
node server.js
```
Open another terminal window and in the root application directory run the following commands:

```
cd client
npm start
```

## Concurrently
Having to do two separate commands to start the application may be annoying. If you prefer to start the application with one command, install [Concurrently](https://www.npmjs.com/package/concurrently).


```
npm install --save-dev concurrently
```

Replace the "scripts" in package.json on root level with the "scripts" below:
```
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "react": "cd client && npm start",
    "server": "nodemon server.js",
    "dev": "concurrently --kill-others \"npm run start\" \"npm run react\"",
    "heroku-postbuild": "cd client && npm install && npm install --only=dev --no-shrinkwrap && npm run build"
  },
```

If you're using [nodemon](https://www.npmjs.com/package/nodemon) replace "dev" with the following:
```
"dev": "concurrently --kill-others \"npm run server\" \"npm run react\"",
```

In the root application directory run:
```
npm run dev
```




## Cloudinary

If you'd like to save images to a local folder instead of Cloudinary see [Saving Images to a Local Folder](#saving-images-to-a-local-folder).

Sign up for [Cloudinary](https://cloudinary.com/). I recommend creating a .env file and placing your Cloudinary information in environment variables like so:

```
CLOUDINARY_API_KEY = 'API KEY'
CLOUDINARY_API_SECRET = 'API SECRET'
CLOUDINARY_CLOUD_NAME = 'CLOUDNAME'
```


## Saving Images to a Local Folder

If you'd like to save images to a cloud service see [Cloudinary](#cloudinary).

This application assumes that you will use Cloudinary to store images. There's some work that needs to be done if you want to save the images to a local folder, but we'll take it step by step.


The file that we will be working with:
- "/routes/profile-routes.js"


### Profile Routes


Open "/routes/profile-routes.js" go to line 22. Uncomment the destination property and have your code match the snippet below:

```
// Store files and name format them - 'li-(date).(type)'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './client/public/images');
    },
    filename: function (req, file, cb) {
      cb(null, 'li' + '-' + Date.now() + '.' + mime.getExtension(file.mimetype));
    }
});
```
The rest of the guide assumes you will use the "public/images" folder found inside "client" as the path to your images. Create a folder named "images" inside '/client/public' if no folder currently exists.

**All of work from here will be done inside the POST "uploadphoto" route on line 60.**

Since we're not using Cloudinary, we have to make sure that we take the code from line 89 - 154 out of the Cloudinary function and paste below line 75:
```
 // Create a post ID
    const usernameLength = req.user.username.length;
    const userASCII = req.user.username.charCodeAt(0) + req.user.username.charCodeAt(usernameLength - 1);
    const timestamp = Date.now();
    const postID = `${userASCII}${timestamp}`;
    
    // PASTE HERE
```

We're free to delete the cloudinary function:
```
 // Save image to cloudinary
    cloudinary.v2.uploader.upload(req.file.path,
        {
            public_id: `${postID}`
        }, 
        (error, result) => {

            if(error){
                return res.status(415).json({ error: 'File could not be uploaded.' });
            }

            
        });
```


Delete this block of code pasted below line 75:

```
// Delete file from temporary folder
                 fs.unlink(`${req.file.path}`, (err) => {
                    if (err) throw err;
                });
```




At the top of the route make a variable to store the name of the file. We're going to prefix it with the path our images are being saved to:
```
const imagePath = `/images/${req.file.filename}`;
```

Where you see:
```
image: result.url   //(2 in total)
```
Replace with our new variable:
```
image: imagePath
```


#### You're all set!



# Credits

<p><img src="/client/public/icons/like.svg" width="30" height="30" /> Icon made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from www.flaticon.com</p>
<p><img src="/client/public/icons/plus.svg" width="30" height="30" /> Icon made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from www.flaticon.com</p>
<p><img src="/client/public/icons/chat.svg" width="30" height="30" /> Icon made by <a href="https://www.flaticon.com/authors/gregor-cresnar" title="Gregor Cresnar">Gregor Cresnar</a> from www.flaticon.com</p>
<p><img src="/client/public/icons/search.svg" width="30" height="30" /> Icon made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from www.flaticon.com</p>
